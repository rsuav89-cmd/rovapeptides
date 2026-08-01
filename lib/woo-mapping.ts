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
  // ── Variable products (product + variation) ──────────────────────────────
  "bpc-157-5mg": { productId: 33, variationId: 34 }, // BPC-157 → 5 mg
  "tesamorelin-10mg": { productId: 42, variationId: 43 }, // Tesamorelin → 10 mg
  "nad-plus-1000mg": { productId: 48, variationId: 50 }, // NAD+ → 1,000 mg
  "ghk-cu-100mg": { productId: 36, variationId: 38 }, // GHK-Cu → 100 mg

  // ── Simple products ──────────────────────────────────────────────────────
  "ss-31-10mg": { productId: 29 },
  "selank-10mg": { productId: 26 },
  "cerebrolysin-60mg": { productId: 16 },
  "epithalon-50mg": { productId: 18 },
  "foxo4-dri-10mg": { productId: 19 },
  "glutathione-1500mg": { productId: 32 },
  "snap-8-10mg": { productId: 28 },
  "vitamin-b12-10mg": { productId: 31 },
  "bac-water-10ml": { productId: 65 },
  "hcg-5000iu": { productId: 20 },
  "pt-141-10mg": { productId: 24 },
  "retatrutide-10mg": { productId: 25 },
  "semax-10mg": { productId: 27 },
  "mots-c-20mg": { productId: 23 },
  "aod-9604-5mg": { productId: 14 },
  "cardiogen-20mg": { productId: 15 },
  "5-amino-1mq-10mg": { productId: 30 },

  // ── Insurance / handling line items ──────────────────────────────────────
  "shipping-protection": { productId: 78 },
  "priority-handling": { productId: 79 },
};

/**
 * Woo products that exist on the store but have no matching purchasable frontend
 * slug yet (kept here for reference; not part of the active mapping):
 *   #12 TB-500 (5 mg)              #17 CJC-1295 no-DAC (5 mg)
 *   #21 IGF-1 LR3 (1 mg)          #22 Ipamorelin (5 mg)
 *   #39 KPV (5/10 mg)             + secondary variations:
 *     NAD+ 500 mg (#49), Tesamorelin 20 mg (#44),
 *     GHK-Cu 50 mg (#37), BPC-157 10 mg (#35)
 *
 * Frontend slugs with NO Woo product yet (currently unpriced / non-purchasable,
 * so they never reach checkout): 5-amino-1mq-50mg, adamax-10mg, ara-290-10mg,
 * bpc-157-tb-500-combo, cagrilintide-10mg, cjc-1295-ipamorelin-combo, glow-70mg,
 * klow-80mg, mots-c-10mg, mt-1-10mg, mt-2-10mg, retatrutide-20mg,
 * retatrutide-30mg, selank-5mg, thymosin-alpha-1-10mg, tirzepatide-30mg,
 * tirzepatide-60mg, vip-5mg, bac-water-3ml.
 */

/** Look up the Woo IDs for a frontend slug. Returns undefined if unmapped. */
export function wooRef(slug: string): WooRef | undefined {
  return WOO_MAPPING[slug];
}

/** True if the slug can be handed off to the WooCommerce cart. */
export function isMappedToWoo(slug: string): boolean {
  return slug in WOO_MAPPING;
}
