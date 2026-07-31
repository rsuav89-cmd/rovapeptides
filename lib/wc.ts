import { getPurchaseEligibility, type Product } from "./products";

const DEFAULT_STORE_URL = "https://www.rovapeptides.com";

function normalizeStoreBase(url: string): string {
  const withoutTrailingSlash = url.replace(/\/+$/, "");
  return withoutTrailingSlash.replace(/\/checkout$/i, "");
}

/** WooCommerce store base URL — used for checkout redirects and account links. */
export const WC_STORE_BASE = normalizeStoreBase(
  process.env.NEXT_PUBLIC_WC_CHECKOUT_URL || DEFAULT_STORE_URL
);

export const WC_CHECKOUT_URL = `${WC_STORE_BASE}/checkout/`;
export const WC_ACCOUNT_URL = `${WC_STORE_BASE}/my-account/`;

// FINAL GATE before checkout redirect: no ineligible (e.g. unpriced) SKU may
// ever be handed off. Consulted by the cart drawer prior to redirecting.
export function cartHasIneligible(lines: { product: Product }[]): boolean {
  return lines.some((l) => !getPurchaseEligibility(l.product).purchasable);
}
