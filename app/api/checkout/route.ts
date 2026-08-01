// ─────────────────────────────────────────────────────────────────────────────
// Checkout handoff route
// ─────────────────────────────────────────────────────────────────────────────
// Receives the cart drawer's items, translates each frontend slug to its numeric
// WooCommerce IDs via `lib/woo-mapping.ts`, signs the payload with HMAC-SHA256
// (shared secret: env HANDOFF_SECRET), and 302-redirects the browser to the
// Hostinger handoff endpoint, which rebuilds the WooCommerce cart server-side and
// sends the shopper to checkout.
//
// Because this is a top-level navigation (a form POST from the cart), there is no
// CORS involved and the WooCommerce session cookie set on shop.rovapeptides.com
// is first-party. The mu-plugin `rova-handoff.php` verifies the signature and
// builds the cart.
//
// The cart drawer submits a form POST to /api/checkout with a single field
// `items` = JSON string of [{ id: slug, qty }]. JSON bodies are also accepted for
// testing (curl / fetch).
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { wooRef } from "@/lib/woo-mapping";

// crypto (HMAC) requires the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Shop base URL. Accepts WC_SHOP_URL (server-only) OR the same
// NEXT_PUBLIC_WC_CHECKOUT_URL that lib/wc.ts uses, so one env var configures the
// whole app. Any trailing slash or /checkout suffix is normalized off.
const SHOP_BASE = (
  process.env.WC_SHOP_URL ||
  process.env.NEXT_PUBLIC_WC_CHECKOUT_URL ||
  "https://shop.rovapeptides.com"
)
  .replace(/\/+$/, "")
  .replace(/\/checkout$/i, "");
const HANDOFF_SECRET = process.env.HANDOFF_SECRET || "";
const TTL_SECONDS = 900; // signed link is valid for 15 minutes

type IncomingItem = { id?: unknown; qty?: unknown };
type WooLine = { product_id: number; variation_id: number; qty: number };

/** Read cart items from either a form POST (`items` field) or a JSON body. */
async function readItems(req: NextRequest): Promise<IncomingItem[]> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    if (Array.isArray(body?.items)) return body.items as IncomingItem[];
    if (Array.isArray(body)) return body as IncomingItem[];
    return [];
  }

  // form-urlencoded / multipart (top-level navigation from the cart drawer)
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

export async function POST(req: NextRequest) {
  if (!HANDOFF_SECRET) {
    return NextResponse.json(
      { error: "Checkout is not configured (HANDOFF_SECRET missing)." },
      { status: 500 },
    );
  }

  const incoming = await readItems(req);

  const lines: WooLine[] = [];
  const unmapped: string[] = [];

  for (const item of incoming) {
    const slug = String(item?.id ?? "").trim();
    if (!slug) continue;
    const qty = Math.max(1, Math.floor(Number(item?.qty) || 1));
    const ref = wooRef(slug);
    if (!ref) {
      unmapped.push(slug);
      continue;
    }
    // Force clean, finite integers — WooCommerce's add_to_cart silently no-ops
    // on a non-integer or NaN product/variation id, which is what leaves the
    // shopper on an empty /cart. variation_id 0 means "simple product".
    const product_id = Math.trunc(Number(ref.productId));
    const variation_id = ref.variationId != null ? Math.trunc(Number(ref.variationId)) : 0;
    if (!Number.isInteger(product_id) || product_id <= 0) {
      unmapped.push(slug);
      continue;
    }
    lines.push({
      product_id,
      variation_id: Number.isInteger(variation_id) && variation_id > 0 ? variation_id : 0,
      qty,
    });
  }

  if (lines.length === 0) {
    return NextResponse.json(
      { error: "No purchasable items in cart.", unmapped },
      { status: 400 },
    );
  }

  // Sign the exact base64url payload string. `exp` lives inside the payload so it
  // is covered by the signature and cannot be tampered with.
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = JSON.stringify({ items: lines, exp });
  const data = Buffer.from(payload, "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", HANDOFF_SECRET).update(data).digest("hex");

  const url = `${SHOP_BASE}/rova-handoff?data=${encodeURIComponent(data)}&sig=${sig}`;

  // 302: the browser follows this to the shop, which builds the cart and
  // redirects on to /checkout/. (A form POST triggers a top-level GET on the
  // 302 target — no CORS, first-party WooCommerce session.)
  return NextResponse.redirect(url, 302);
}

// Optional: a bare GET is not a valid entry point; nudge callers to POST.
export async function GET() {
  return NextResponse.json(
    { error: "Use POST with cart items to begin checkout." },
    { status: 405 },
  );
}
