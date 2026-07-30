import { NextResponse } from "next/server";

type CheckoutItem = { sku: string; qty: number };

type ResolvedItem = {
  id: number;
  qty: number;
  variationId?: number;
  attribute?: { name: string; value: string };
};

const VARIABLE_PARENT_IDS = [33, 42, 36, 48];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { items?: CheckoutItem[] };
    const items = body.items ?? [];

  const base = process.env.WC_API_URL;
    const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!base || !key || !secret || items.length === 0) {
    return NextResponse.json({ resolved: [] });
  }

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const resolved: ResolvedItem[] = [];

  for (const item of items) {
    if (!item?.sku || !item.qty) continue;
    let matched = false;

    try {
      const res = await fetch(
        `${base}/products?sku=${encodeURIComponent(item.sku)}`,
        { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" }
        );
      if (res.ok) {
        const data = (await res.json()) as { id?: number }[];
        if (Array.isArray(data) && data[0]?.id) {
          resolved.push({ id: data[0].id, qty: item.qty });
          matched = true;
        }
      }
    } catch {}

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
              variationId: variation.id,
              attribute: attr ? { name: attr.name, value: attr.option } : undefined,
            });
            matched = true;
            break;
          }
        } catch {}
      }
    }
  }

  return NextResponse.json({ resolved });
  } catch {
    return NextResponse.json({ resolved: [] });
  }
}
