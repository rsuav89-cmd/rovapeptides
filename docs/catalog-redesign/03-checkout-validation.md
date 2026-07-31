# 03 — Checkout Validation

## Purchase-eligibility gate (Gate 4) — single source of truth

`getPurchaseEligibility(product) → { purchasable, reason }` lives in `lib/products.ts` and is the ONLY place purchase eligibility is decided. Rules today: `price <= 0` (and not allow-listed) → `{ purchasable: false, reason: "pending-price" }`; otherwise `{ purchasable: true, reason: "ok" }`. Extension points for stock / WooCommerce metadata are documented in the function.

It is consulted in **four** places:

| Layer | File | Behavior when ineligible |
|---|---|---|
| Product card | `components/catalog/ProductCard.tsx` | shows "Pricing coming soon" (never `$0`); primary control routes to details instead of quick-add |
| Product detail | `components/catalog/ProductDetail.tsx` | price fallback; **Add-to-Cart disabled** (`aria-disabled`) with "Pricing coming soon" |
| Cart | `components/cart/CartContext.tsx` | `add()` hard-refuses an ineligible SKU (cannot enter the cart) |
| **Checkout final gate** | `lib/wc.ts` `cartHasIneligible()` → used in `CartDrawer.goToCheckout()` | redirect is aborted if any line is ineligible |

## Test results

**TEST 3 — pending-price product is blocked → PASS (verified).**
A `$0`/pending SKU cannot be quick-added (card routes to details), cannot be added on the detail page (button disabled), is rejected by `CartContext.add()`, and — even if a stale persisted line existed — `cartHasIneligible()` aborts the checkout redirect. Confirmed by `validate:catalog`, which asserts **no unpriced SKU ever reports `purchasable`** (0 violations across all 40 SKUs).

**TESTS 1, 2, 4 — live WooCommerce handoff → BLOCKED (external), not passable as specified.** Two hard external facts:

1. **The checkout URL is not yet valid.** `WC_CHECKOUT_URL` resolves to `https://www.rovapeptides.com/checkout/` (the Next.js frontend on Vercel) unless `NEXT_PUBLIC_WC_CHECKOUT_URL` is set to the real WooCommerce host — which has not been provided. As-is it 404s. A real add-to-checkout run cannot succeed until the true WooCommerce store URL is supplied.
2. **The current architecture is a redirect, not a cart handoff.** "Proceed to Checkout" navigates the browser to the WooCommerce checkout page (`WC_CHECKOUT_URL`); it does **not** transmit the Next.js cart line items. WooCommerce maintains its own server-side cart. Therefore the premise "WooCommerce receives the exact cart contents" is **not a property of the present redirect** — verifying "correct product / quantity / price on the WooCommerce side" would require building an actual handoff (e.g. a POST that resolves each `sourceId` to a Woo product/variation id and seeds the Woo cart — the pattern that previously existed and was removed in favor of the redirect).

**Neither is a defect I can resolve without owner input:** they need (a) the real WooCommerce checkout base URL, and (b) a product decision on redirect-only vs. true cart handoff. Until then, the safe, verified guarantee holds: **no ineligible or $0 item can reach checkout.**

## What was NOT faked
No live checkout screenshot or "correct totals" claim is made, because the live handoff cannot be exercised in this environment with a broken/unknown checkout URL. This is recorded as an external blocker rather than a passed test.
