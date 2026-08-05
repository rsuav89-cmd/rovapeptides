// ─────────────────────────────────────────────────────────────────────────────
// WooCommerce ID mapping
// ─────────────────────────────────────────────────────────────────────────────
// Bridges the headless catalog (string slugs in `lib/products.ts` → `product.id`)
// to the numeric WooCommerce Product IDs (and Variation IDs, for variable
// products) that live on the Hostinger store at shop.rovapeptides.com.
//
// Pulled live from the Store API:
//   https://shop.rovapeptides.com/wp-json/wc/store/v1/products
//
// The checkout handoff (`app/api/checkout/route.ts`) uses this to translate the
// cart drawer's slugs into the numeric IDs the WooCommerce cart expects.
//
// MAINTENANCE: when you add a Woo product (or set a price on a currently-unpriced
// frontend SKU so it becomes purchasable), add its slug → { productId } entry
// here. A slug with no entry is treated as non-purchasable by the checkout route
// and is simply skipped (it can never reach the Woo cart).
// ─────────────────────────────────────────────────────────────────────────────

export type WooRef = {
  /** Numeric WooCommerce post ID of the product. */
  productId: number;
  /** Variation ID — required only for `variable` products. */
  variationId?: number;
};

/**
 * Frontend catalog slug (`product.id`) → WooCommerce numeric IDs.
 * Only slugs present here are purchasable through the handoff.
 */
export const WOO_MAPPING: Record<string, WooRef> = {
  // ── Realigned catalog (IDs supplied Aug 2026) ────────────────────────────
  "glp-2-10mg": { productId: 1001 },
  "glp-2-15mg": { productId: 1002 },
  "glp-2-30mg": { productId: 1003 },
  "glp-3-10mg": { productId: 1004 }, // supersedes legacy Woo #25 (Retatrutide 10 mg)
  "glp-3-20mg": { productId: 1005 },
  "glp-3-30mg": { productId: 1006 },
  "bpc-157-tb-500-combo": { productId: 1007 }, // supplied as "bpc-157-tb-500-blend-10mg"
  "nad-plus-500mg": { productId: 1008 }, // supersedes legacy Woo #48 / variation #49
  "glutathione-200mg": { productId: 1009 },
  "epithalon-10mg": { productId: 1010 },
  "mots-c-10mg": { productId: 1011 },
  "bac-water-30ml": { productId: 1012 }, // supplied as "bacteriostatic-water-30ml"

  // ── Carried over from the pre-realignment store ──────────────────────────
  "tesamorelin-10mg": { productId: 42, variationId: 43 }, // Tesamorelin → 10 mg
  "ghk-cu-100mg": { productId: 36, variationId: 38 }, // GHK-Cu → 100 mg
  "ss-31-10mg": { productId: 29 },
  "selank-10mg": { productId: 26 },
  "semax-10mg": { productId: 27 },
  "aod-9604-5mg": { productId: 14 },
  "5-amino-1mq-10mg": { productId: 30 },
  "vitamin-b12-10mg": { productId: 31 },

  // ── Insurance / handling line items ──────────────────────────────────────
  "shipping-protection": { productId: 78 },
  "priority-handling": { productId: 79 },
};

/**
 * ACTIVE SKUS AWAITING A WOOCOMMERCE ID.
 *
 * Two SKUs remain: no ID was supplied for either in the August 2026 mapping
 * list. They stay declared rather than deleted, because an undeclared unmapped
 * SKU is a hard QA failure by design — a priced product with no Woo ID would
 * otherwise reach the cart and be dropped at handoff.
 *
 * Until each moves into WOO_MAPPING above:
 *   • /api/checkout returns 409 naming the offending item
 *   • the cart drawer blocks checkout before the shopper loses the cart
 *   • `npm run qa` reports the count as a warning on every run
 *
 * Lead for KPV: Woo #39 exists (5/10 mg, variable — variation ID unknown).
 * The CJC-1295 No-DAC / Ipamorelin 5 mg/5 mg blend has no Woo product; #17 and
 * #22 are the two components sold separately, not the blend.
 */
export const PENDING_WOO_IDS: readonly string[] = [
  "cjc-1295-ipamorelin-combo",
  "kpv-5mg",
];

export function wooRef(slug: string): WooRef | undefined {
  return WOO_MAPPING[slug];
}

/** True if the slug can be handed off to the WooCommerce cart. */
export function isMappedToWoo(slug: string): boolean {
  return slug in WOO_MAPPING;
}
