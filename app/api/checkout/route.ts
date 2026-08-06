// ─────────────────────────────────────────────────────────────────────────────
// Checkout: create a pending WooCommerce order, return its Order Pay URL.
// ─────────────────────────────────────────────────────────────────────────────
// The previous architecture posted a signed cart to a mu-plugin on the store,
// which rebuilt the WooCommerce cart server-side and forwarded to /checkout/.
// That depended on the shopper carrying a WooCommerce session cookie across
// rovapeptides.com → shop.rovapeptides.com. Third-party cookie handling drops
// it, and the shopper lands on an empty cart.
//
// This route removes the session dependency entirely. It translates the cart to
// numeric Woo IDs, creates a `pending` order through the REST API, and returns
// the order's own `payment_url`:
//
//   https://shop.rovapeptides.com/checkout/order-pay/1234/?pay_for_order=true&key=wc_order_...
//
// That URL is authenticated by the order key in the query string, not by a
// cookie, so it works cold in any browser, in a new tab, or on a phone opening
// an emailed link.
//
// Prices are never sent from the client — only product/variation IDs and
// quantities. WooCommerce prices the order itself, so a tampered payload cannot
// change what the shopper is charged.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { wooRef } from "@/lib/woo-mapping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Environment resolution ───────────────────────────────────────────────────
// Both naming conventions are accepted so the same build works against a Vercel
// project configured with either WC_* or WOOCOMMERCE_* variables. Nothing here
// may be renamed without keeping the alias — a rename silently 500s production.
const SHOP_BASE = (
  process.env.WC_SHOP_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WC_CHECKOUT_URL ||
  "https://shop.rovapeptides.com"
)
  .replace(/\/+$/, "")
  .replace(/\/checkout$/i, "");

/**
 * Accepts either a full REST base (".../wp-json/wc/v3") or a bare site root
 * ("https://shop.example.com") and always returns a full v3 base.
 *
 * This normalisation matters: WC_API_URL is conventionally a full endpoint
 * while NEXT_PUBLIC_WORDPRESS_URL is a site root. Concatenating "/orders" onto
 * an unnormalised root produces https://shop.../orders, which 404s and looks
 * exactly like a credentials problem.
 */
function toRestBase(value: string): string {
  const trimmed = value.replace(/\/+$/, "");
  if (/\/wp-json\//.test(trimmed)) return trimmed;
  return `${trimmed}/wp-json/wc/v3`;
}

const WC_API_BASE = toRestBase(
  process.env.WC_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || SHOP_BASE
);

const CONSUMER_KEY =
  process.env.WC_CONSUMER_KEY || process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const CONSUMER_SECRET =
  process.env.WC_CONSUMER_SECRET || process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

// Some managed WordPress hosts strip the Authorization header before PHP sees
// it, which makes Basic auth fail with a 401. Setting WC_AUTH_IN_QUERY=1 falls
// back to consumer_key/consumer_secret as query parameters. This is off by
// default on purpose: credentials in a URL end up in access logs and proxy
// logs. Prefer fixing the host's header passthrough.
const AUTH_IN_QUERY = process.env.WC_AUTH_IN_QUERY === "1";

const MAX_LINES = 40;
const MAX_QTY_PER_LINE = 99;
const WC_TIMEOUT_MS = 12_000;

const NO_STORE = { "Cache-Control": "no-store" } as const;

type IncomingItem = { id?: unknown; qty?: unknown };
type WooLineItem = { product_id: number; variation_id?: number; quantity: number };

/** Read cart items from a JSON body (preferred) or a form POST (legacy). */
async function readItems(req: NextRequest): Promise<IncomingItem[]> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (Array.isArray(body?.items)) return body.items as IncomingItem[];
    if (Array.isArray(body)) return body as IncomingItem[];
    return [];
  }

  const form = await req.formData().catch(() => null);
  const raw = form?.get("items");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as IncomingItem[];
      if (Array.isArray(parsed?.items)) return parsed.items as IncomingItem[];
    } catch {
      /* fall through */
    }
  }
  return [];
}

/** Same-origin guard: cheap abuse control against blind order-spam POSTs. */
function originAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // server-to-server / curl during testing
  try {
    const host = new URL(origin).host;
    return host === req.headers.get("host") || /(^|\.)rovapeptides\.com$/.test(host);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error(
      "[CHECKOUT] WooCommerce REST credentials are not configured. Set either " +
        "WC_CONSUMER_KEY/WC_CONSUMER_SECRET or WOOCOMMERCE_CONSUMER_KEY/" +
        "WOOCOMMERCE_CONSUMER_SECRET in the deployment environment.",
      {
        hasKey: Boolean(CONSUMER_KEY),
        hasSecret: Boolean(CONSUMER_SECRET),
        apiBase: WC_API_BASE,
      }
    );
    return NextResponse.json(
      { error: "Checkout is not configured. Please contact support." },
      { status: 500, headers: NO_STORE }
    );
  }

  if (!originAllowed(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403, headers: NO_STORE });
  }

  const incoming = await readItems(req);

  const lineItems: WooLineItem[] = [];
  const unmapped: string[] = [];

  for (const item of incoming.slice(0, MAX_LINES)) {
    const slug = String(item?.id ?? "").trim();
    if (!slug) continue;

    const quantity = Math.min(
      MAX_QTY_PER_LINE,
      Math.max(1, Math.floor(Number(item?.qty) || 1))
    );

    const ref = wooRef(slug);
    if (!ref) {
      unmapped.push(slug);
      continue;
    }

    // WooCommerce silently no-ops on a non-integer or NaN id, which is what
    // leaves a shopper staring at an empty order. Force clean integers.
    const productId = Math.trunc(Number(ref.productId));
    const variationId = ref.variationId != null ? Math.trunc(Number(ref.variationId)) : 0;
    if (!Number.isInteger(productId) || productId <= 0) {
      unmapped.push(slug);
      continue;
    }

    lineItems.push({
      product_id: productId,
      ...(Number.isInteger(variationId) && variationId > 0 ? { variation_id: variationId } : {}),
      quantity,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "No purchasable items in cart.", unmapped },
      { status: 400, headers: NO_STORE }
    );
  }

  // Partial mapping is worse than none: the shopper would pay for an order
  // quietly missing items they chose. Refuse the whole thing.
  if (unmapped.length > 0) {
    return NextResponse.json(
      {
        error: "Some items are not yet available for checkout. Remove them and try again.",
        unmapped,
      },
      { status: 409, headers: NO_STORE }
    );
  }

  const endpoint = new URL(`${WC_API_BASE}/orders`);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (AUTH_IN_QUERY) {
    endpoint.searchParams.set("consumer_key", CONSUMER_KEY);
    endpoint.searchParams.set("consumer_secret", CONSUMER_SECRET);
  } else {
    headers.Authorization = `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`;
  }

  // NOTE: deliberately no retry. POST /orders is not idempotent — a retry after
  // a timeout can leave two pending orders for one shopper.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WC_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(endpoint.toString(), {
      method: "POST",
      headers,
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        status: "pending",
        set_paid: false,
        line_items: lineItems,
        // Traceability without storing anything personal.
        meta_data: [{ key: "_rova_source", value: "headless-storefront" }],
      }),
    });
  } catch (err) {
    clearTimeout(timeout);
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error("[CHECKOUT] order creation failed", aborted ? "timeout" : err);
    return NextResponse.json(
      {
        error: aborted
          ? "The store took too long to respond. Please try again."
          : "We could not reach the store. Please try again.",
      },
      { status: 502, headers: NO_STORE }
    );
  }
  clearTimeout(timeout);

  const payload = (await response.json().catch(() => null)) as
    | { id?: number; payment_url?: string; message?: string; code?: string }
    | null;

  if (!response.ok) {
    // Never surface the store's raw error to the browser: it can leak plugin
    // names, table prefixes and credential hints.
    console.error("[CHECKOUT] WooCommerce rejected the order", {
      status: response.status,
      code: payload?.code,
      message: payload?.message,
    });
    return NextResponse.json(
      { error: "The store could not create this order. Please try again or contact support." },
      { status: 502, headers: NO_STORE }
    );
  }

  const checkoutUrl = payload?.payment_url;
  if (!checkoutUrl || typeof checkoutUrl !== "string") {
    console.error("[CHECKOUT] order created without a payment_url", { id: payload?.id });
    return NextResponse.json(
      { error: "The order was created but no payment link was returned. Please contact support." },
      { status: 502, headers: NO_STORE }
    );
  }

  console.log("[CHECKOUT] pending order created", {
    orderId: payload?.id,
    lines: lineItems.length,
    units: lineItems.reduce((n, l) => n + l.quantity, 0),
  });

  return NextResponse.json(
    { checkoutUrl, orderId: payload?.id ?? null },
    { status: 200, headers: NO_STORE }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with cart items to begin checkout." },
    { status: 405, headers: NO_STORE }
  );
}
