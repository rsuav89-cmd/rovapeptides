# Final Catalog Alignment — 18 Active Products

`npx tsc --noEmit`: **0 errors.** `npm run qa`: **1,223 assertions pass**, one warning
(the WooCommerce ID gap in §4 — the one thing that blocks launch).

---

## 1. Active catalog — 18 products / 22 SKUs

| # | Product | Strength | Price | SKU | Woo ID |
|---|---|---|---|---|---|
| 1 | BPC-157 / TB-500 Blend | 5 mg / 5 mg | $110 | `bpc-157-tb-500-combo` | **pending** |
| 2 | GLP-2 | 10 mg | $118 | `glp-2-10mg` | **pending** |
| | | 15 mg | $158 | `glp-2-15mg` | **pending** |
| | | 30 mg | $268 | `glp-2-30mg` | **pending** |
| 3 | GLP-3 | 10 mg | $148 | `glp-3-10mg` | 25 |
| | | 20 mg | $228 | `glp-3-20mg` | **pending** |
| | | 30 mg | $298 | `glp-3-30mg` | **pending** |
| 4 | Tesamorelin | 10 mg | $99 | `tesamorelin-10mg` | 42 / var 43 |
| 5 | CJC-1295 No-DAC / Ipamorelin Blend | 5 mg / 5 mg | $98 | `cjc-1295-ipamorelin-combo` | **pending** |
| 6 | AOD-9604 | 5 mg | $54 | `aod-9604-5mg` | 14 |
| 7 | 5-Amino-1MQ | 10 mg | $88 | `5-amino-1mq-10mg` | 30 |
| 8 | SS-31 | 10 mg | $94 | `ss-31-10mg` | 29 |
| 9 | MOTS-c | 10 mg | $78 | `mots-c-10mg` | **pending** |
| 10 | NAD+ | 500 mg | $68 | `nad-plus-500mg` | 48 / var 49 |
| 11 | Epithalon | 10 mg | $58 | `epithalon-10mg` | **pending** |
| 12 | GHK-Cu | 100 mg | $48 | `ghk-cu-100mg` | 36 / var 38 |
| 13 | KPV | 5 mg | $52 | `kpv-5mg` | **pending** |
| 14 | Selank | 10 mg | $54 | `selank-10mg` | 26 |
| 15 | Semax | 10 mg | $56 | `semax-10mg` | 27 |
| 16 | Glutathione | 200 mg | $42 | `glutathione-200mg` | **pending** |
| 17 | Vitamin B-12 (Methylcobalamin) | 10 mg | $34 | `vitamin-b12-10mg` | 31 |
| 18 | Bacteriostatic Water | 30 mL | $12 | `bac-water-30ml` | **pending** |

All 22 SKUs carry `inStock: true` and a real price. **Zero products display "Pricing coming
soon"** — enforced by a QA assertion that now fails the suite if any active SKU lacks a price
or a stock flag, not merely warns.

---

## 2. Purges

Removed from `lib/products.ts`, `lib/catalog-data.ts`, `lib/product-details.ts` and
`lib/woo-mapping.ts`. Because the search index, category filters, collection pages, sitemap,
COA generation and JSON-LD all derive from these modules, removal is total — there is no
second list to clean.

**Requested and removed:** BPC-157 standalone (`bpc-157-5mg`, Woo 33/34).

**Requested but never present:** TB-500 standalone, Semaglutide, CJC-1295 No-DAC 5 mg,
Ipamorelin 5 mg, Sermorelin 5 mg. These had no frontend SKU. TB-500 (Woo #12), CJC-1295
No-DAC (#17) and Ipamorelin (#22) exist as Woo products and should be unpublished or set to
draft on the WooCommerce side — this repo never listed them.

**Also removed, as required by "only the following 18":** Adamax, ARA-290, Cagrilintide,
Cardiogen, Cerebrolysin, FOXO4-DRI, GLOW, HCG, KLOW, MT-1, MT-2, PT-141, Snap-8, Thymosin
Alpha-1, VIP, plus the superseded strengths 5-Amino-1MQ 50 mg, Selank 5 mg, MOTS-c 20 mg,
Bacteriostatic Water 3 mL and 10 mL, NAD+ 1000 mg, Epithalon 50 mg, Glutathione 1500 mg,
Tirzepatide 30/60 mg. **GLOW and KLOW were among the highest-priced blends in the old
catalog** — flagging in case their omission from your 18 was an oversight rather than a decision.

---

## 3. Renames and spec changes

**Tirzepatide → GLP-2** and **Retatrutide → GLP-3.** Handled as a full identity change: family
slug, product name, SKU ids, batch prefixes and copy. Canonical URLs are now `/shop/glp-2` and
`/shop/glp-3`. The original compound names are retained as **search aliases**, so a researcher
typing "tirzepatide" still finds the product, and each overview states "formerly listed as
tirzepatide / retatrutide" once — matching the framing in your own brief.

The variant structures changed, not just the labels: GLP-2 is now 10 / 15 / 30 mg (was
Tirzepatide 30 / 60 mg), and GLP-3 is 10 / 20 / 30 mg with the new prices.

**GHK-Cu** was already 100 mg; the price moved to $48 and the SKU is unchanged.

**Strength changes creating new SKUs:** NAD+ 1000 → 500 mg, Glutathione 1500 → 200 mg,
Epithalon 50 → 10 mg, Bacteriostatic Water 10 mL → 30 mL, MOTS-c 20 → 10 mg. Each is a
different physical product, so each takes a new SKU id — which is why their old Woo IDs could
not simply be carried over.

**New product:** KPV 5 mg, previously only a component of the KLOW blend.

---

## 4. The one thing blocking launch: 12 SKUs have no WooCommerce ID

10 of 22 SKUs carry a verified numeric Woo ID. The other 12 do not, because the realignment
created SKUs that no existing Woo product corresponds to — new strengths, new blends, renamed
compounds with new variant ladders.

**I did not invent IDs for them.** A guessed `productId` does not fail loudly; it adds *a
different product* to the shopper's cart and the order ships wrong. So the gap is declared
instead, in a new `PENDING_WOO_IDS` export in `lib/woo-mapping.ts`, and three guards make it
impossible to miss:

- **`/api/checkout`** now returns **409** with the offending list when a cart contains any
  unmapped SKU. Previously it silently dropped unmapped lines and handed WooCommerce a cart
  quietly missing items — the worst possible failure mode, and a pre-existing bug this
  realignment surfaced.
- **The cart drawer** blocks checkout before submission and names the specific items
  ("KPV 5 mg is not yet available for checkout. Remove it to continue.").
- **`npm run qa`** prints the count and the SKU list on every run, and hard-fails if a SKU is
  unmapped *without* being declared pending.

Leads from the notes already in `lib/woo-mapping.ts`, all requiring confirmation before use:
Woo **#39** is a KPV product (5/10 mg, variable — the variation ID is unknown). **#17**
CJC-1295 No-DAC and **#22** Ipamorelin exist separately, so neither is the 5 mg/5 mg blend.
**#18** Epithalon is the 50 mg variant, **#32** Glutathione the 1500 mg, **#65** Bac water the
10 mL, **#23** MOTS-c the 20 mg — none match the new SKUs.

To close it: create or locate each Woo product, then move the slug from `PENDING_WOO_IDS` into
`WOO_MAPPING` with its numeric ID (and `variationId` for variable products). QA turns green the
moment the list empties.

---

## 5. Two asset problems you'll see immediately

**The GLP-2 and GLP-3 renders still say TIRZEPATIDE and RETATRUTIDE.** The image files
(`/products/tirzepatide-*.jpg`, `/products/retatrutide-*.jpg`) are wired to the new SKUs
because they are the correct vials, but if the vial labels in those photographs carry the old
compound names, every GLP-2 and GLP-3 card and product page contradicts its own title. New
renders are needed before launch. GLP-2 15 mg currently reuses the 30 mg render.

**KPV has no product image.** It points at `/products/kpv.jpg`, which does not exist. I chose a
missing image over borrowing the KLOW render, because a mislabelled vial on a research product
is worse than an obvious gap. It needs a render.

---

## 6. Files changed

`lib/products.ts` (array fully rewritten; `Product` gains `inStock`; eligibility and
`priceLabel` handle an out-of-stock state; NEW badges retargeted to GLP-2 / GLP-3 / KPV),
`lib/catalog-data.ts` (18 families), `lib/product-details.ts` (15 kept, 3 written for GLP-2,
GLP-3, KPV), `lib/woo-mapping.ts` (rewritten with `PENDING_WOO_IDS`), `lib/wc.ts`
(`unmappedCartItems`, mapping-aware gate), `app/api/checkout/route.ts` (409 on partial
mapping), `components/cart/CartDrawer.tsx` (names the blocked items),
`scripts/qa-verify.mjs` (catalog-shape guards, stock and pricing now hard checks),
`tests/e2e/*.spec.ts` (retargeted to live slugs and batches).

Derived automatically, no edits needed: collection pages (all 8 still populated — 6/3/4/2/2/5/2/2
families), search index, category filters, sitemap, `/coas/[batch]` (22 pages),
`/llms.txt`, and all Product / ProductGroup / FAQPage / Certification JSON-LD.

`npm run build` still cannot be executed from this session — run it locally before deploying.
