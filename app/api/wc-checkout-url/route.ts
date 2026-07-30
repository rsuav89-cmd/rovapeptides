import { NextResponse } from "next/server";

type CheckoutItem = { sku: string; qty: number };

type ResolvedItem = {
  id: number;
  qty: number;
  sku: string;
  variationId?: number;
  attribute?: { name: string; value: string };
};

type CheckoutApiResponse = {
  resolved: Omit<ResolvedItem, "sku">[];
  error?: "missing_config" | "empty_cart" | "partial_resolution" | "server_error";
  message?: string;
  requestedCount?: number;
  resolvedCount?: number;
  unresolvedSkus?: string[];
};

const VARIABLE_PARENT_IDS = [33, 42, 36, 48];
const MAX_ITEMS = 50;

function normalizeQty(qty: unknown): number | null {
  const value = typeof qty === "number" ? qty : Number(qty);
  if (!Number.isFinite(value)) return null;
  const normalized = Math.floor(value);
  return normalized > 0 ? normalized : null;
}

function normalizeItems(items: unknown): CheckoutItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const { sku, qty } = item as { sku?: unknown; qty?: unknown };
      if (typeof sku !== "string" || !sku.trim()) return null;
      const safeQty = normalizeQty(qty);
      if (!safeQty) return null;
      return { sku: sku.trim(), qty: safeQty };
    })
    .filter((item): item is CheckoutItem => item !== null)
    .slice(0, MAX_ITEMS);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { items?: CheckoutItem[] };
    const items = normalizeItems(body.items);

    if (items.length === 0) {
      return NextResponse.json({
        resolved: [],
        error: "empty_cart",
        message: "No valid items to checkout.",
        requestedCount: 0,
        resolvedCount: 0,
      } satisfies CheckoutApiResponse);
    }

    const base = process.env.WC_API_URL?.replace(/\/+$/, "");
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!base || !key || !secret) {
      return NextResponse.json(
        {
          resolved: [],
          error: "missing_config",
          message: "Checkout is temporarily unavailable. Please contact support.",
          requestedCount: items.length,
          resolvedCount: 0,
          unresolvedSkus: items.map((i) => i.sku),
        } satisfies CheckoutApiResponse,
        { status: 503 }
      );
    }

    const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const resolved: ResolvedItem[] = [];
    const unresolvedSkus: string[] = [];

    for (const item of items) {
      let matched = false;

      try {
        const res = await fetch(
          `${base}/products?sku=${encodeURIComponent(item.sku)}`,
          { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" }
        );
        if (res.ok) {
          const data = (await res.json()) as { id?: number }[];
          if (Array.isArray(data) && data[0]?.id) {
            resolved.push({ id: data[0].id, qty: item.qty, sku: item.sku });
            matched = true;
          }
        }
      } catch {
        // fall through to variation lookup
      }

      if (!matched) {
        for (const parentId of VARIABLE_PARENT_IDS) {
          try {
            const res = await fetch(
              `${base}/products/${parentId}/variations?sku=${encodeURIComponent(item.sku)}`,
              { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" }
            );
            if (!res.ok) continue;
            const data = (await res.json()) as {
              id?: number;
              attributes?: { name: string; option: string }[];
            }[];
            const variation = Array.isArray(data) ? data[0] : undefined;
            if (variation?.id) {
              const attr = variation.attributes?.[0];
              resolved.push({
                id: parentId,
                qty: item.qty,
                sku: item.sku,
                variationId: variation.id,
                attribute: attr ? { name: attr.name, value: attr.option } : undefined,
              });
              matched = true;
              break;
            }
          } catch {
            // try next parent
          }
        }
      }

      if (!matched) {
        unresolvedSkus.push(item.sku);
      }
    }

    const resolvedPayload = resolved.map(({ sku: _sku, ...rest }) => rest);

    if (resolved.length === 0) {
      return NextResponse.json(
        {
          resolved: [],
          error: "partial_resolution",
          message: "We couldn't match any items in your cart to the store catalog.",
          requestedCount: items.length,
          resolvedCount: 0,
          unresolvedSkus,
        } satisfies CheckoutApiResponse,
        { status: 422 }
      );
    }

    if (unresolvedSkus.length > 0) {
      return NextResponse.json(
        {
          resolved: resolvedPayload,
          error: "partial_resolution",
          message: "Some items in your cart could not be matched. Remove them or try again.",
          requestedCount: items.length,
          resolvedCount: resolved.length,
          unresolvedSkus,
        } satisfies CheckoutApiResponse,
        { status: 422 }
      );
    }

    return NextResponse.json({
      resolved: resolvedPayload,
      requestedCount: items.length,
      resolvedCount: resolved.length,
    } satisfies CheckoutApiResponse);
  } catch {
    return NextResponse.json(
      {
        resolved: [],
        error: "server_error",
        message: "Checkout request failed. Please try again.",
      } satisfies CheckoutApiResponse,
      { status: 500 }
    );
  }
}
