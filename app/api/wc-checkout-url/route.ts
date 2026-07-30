import { NextResponse } from "next/server";

type CheckoutItem = { sku: string; qty: number };

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
    const resolved: { id: number; qty: number }[] = [];

  for (const item of items) {
    if (!item?.sku || !item.qty) continue;
    try {
      const res = await fetch(
        `${base}/products?sku=${encodeURIComponent(item.sku)}`,
        { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" }
        );
      if (!res.ok) continue;
      const data = (await res.json()) as { id?: number }[];
      if (Array.isArray(data) && data[0]?.id) {
        resolved.push({ id: data[0].id, qty: item.qty });
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ resolved });
  } catch {
    return NextResponse.json({ resolved: [] });
  }
}
