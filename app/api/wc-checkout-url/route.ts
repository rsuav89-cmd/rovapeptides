import { NextResponse } from "next/server";

// GET /api/wc-checkout-url
// Returns the live WooCommerce checkout URL for the storefront cart drawer.
// Configure WC_CHECKOUT_URL in your environment (Vercel → Project → Settings →
// Environment Variables, and locally in .env.local), e.g.
//   WC_CHECKOUT_URL=https://shop.rovapeptides.com/checkout
// That WooCommerce checkout page is where Zelle, Cash App, and ePayVista
// process live payments.
export const dynamic = "force-dynamic";

export function GET() {
  const url = process.env.WC_CHECKOUT_URL;

  if (!url) {
    return NextResponse.json(
      { error: "WC_CHECKOUT_URL is not configured." },
      { status: 503 }
    );
  }

  return NextResponse.json({ url });
}
