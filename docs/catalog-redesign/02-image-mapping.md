# 02 — Image Reconciliation (40 SKUs / 40 images)

## Resolution of the "39 vs 40" question

**There is no missing image and no shared image.** `public/products/` contains **40** JPEGs — exactly one per SKU, all resolving (confirmed by `validate:catalog`).

The "39" refers to the **39 newly-generated source renders** delivered in the image batch. The 40th image, `bpc-157.jpg`, is a **pre-existing render** already in the repo: the source batch contained a **BPC-157 + TB-500 blend** render but no standalone **BPC-157** render, so BPC-157 (`bpc-157-5mg`) keeps its original image. 39 new + 1 pre-existing = 40. Case: **all SKUs have their own image; none shared, none missing, no broken paths.**

## Per-SKU image status (all 40)

| # | sourceId | Expected image | Actual path | Status |
|---|---|---|---|---|
| 1 | `bpc-157-5mg` | `/products/bpc-157.jpg` | `public/products/bpc-157.jpg` | OK |
| 2 | `tesamorelin-10mg` | `/products/tesamorelin.jpg` | `public/products/tesamorelin.jpg` | OK |
| 3 | `ss-31-10mg` | `/products/ss-31.jpg` | `public/products/ss-31.jpg` | OK |
| 4 | `selank-10mg` | `/products/selank.jpg` | `public/products/selank.jpg` | OK |
| 5 | `cerebrolysin-60mg` | `/products/cerebrolysin.jpg` | `public/products/cerebrolysin.jpg` | OK |
| 6 | `nad-plus-1000mg` | `/products/nad-plus.jpg` | `public/products/nad-plus.jpg` | OK |
| 7 | `epithalon-50mg` | `/products/epithalon.jpg` | `public/products/epithalon.jpg` | OK |
| 8 | `foxo4-dri-10mg` | `/products/foxo4-dri.jpg` | `public/products/foxo4-dri.jpg` | OK |
| 9 | `glutathione-1500mg` | `/products/glutathione.jpg` | `public/products/glutathione.jpg` | OK |
| 10 | `ghk-cu-100mg` | `/products/ghk-cu.jpg` | `public/products/ghk-cu.jpg` | OK |
| 11 | `snap-8-10mg` | `/products/snap-8.jpg` | `public/products/snap-8.jpg` | OK |
| 12 | `vitamin-b12-10mg` | `/products/vitamin-b12.jpg` | `public/products/vitamin-b12.jpg` | OK |
| 13 | `bac-water-10ml` | `/products/bac-water.jpg` | `public/products/bac-water.jpg` | OK |
| 14 | `5-amino-1mq-10mg` | `/products/5-amino-1mq-10mg.jpg` | `public/products/5-amino-1mq-10mg.jpg` | OK |
| 15 | `5-amino-1mq-50mg` | `/products/5-amino-1mq-50mg.jpg` | `public/products/5-amino-1mq-50mg.jpg` | OK |
| 16 | `adamax-10mg` | `/products/adamax.jpg` | `public/products/adamax.jpg` | OK |
| 17 | `aod-9604-5mg` | `/products/aod-9604.jpg` | `public/products/aod-9604.jpg` | OK |
| 18 | `ara-290-10mg` | `/products/ara-290.jpg` | `public/products/ara-290.jpg` | OK |
| 19 | `bpc-157-tb-500-combo` | `/products/bpc-157-tb-500.jpg` | `public/products/bpc-157-tb-500.jpg` | OK |
| 20 | `cagrilintide-10mg` | `/products/cagrilintide.jpg` | `public/products/cagrilintide.jpg` | OK |
| 21 | `cardiogen-20mg` | `/products/cardiogen.jpg` | `public/products/cardiogen.jpg` | OK |
| 22 | `cjc-1295-ipamorelin-combo` | `/products/cjc-1295-ipamorelin.jpg` | `public/products/cjc-1295-ipamorelin.jpg` | OK |
| 23 | `glow-70mg` | `/products/glow.jpg` | `public/products/glow.jpg` | OK |
| 24 | `klow-80mg` | `/products/klow.jpg` | `public/products/klow.jpg` | OK |
| 25 | `mots-c-10mg` | `/products/mots-c-10mg.jpg` | `public/products/mots-c-10mg.jpg` | OK |
| 26 | `mots-c-20mg` | `/products/mots-c-20mg.jpg` | `public/products/mots-c-20mg.jpg` | OK |
| 27 | `mt-1-10mg` | `/products/mt-1.jpg` | `public/products/mt-1.jpg` | OK |
| 28 | `mt-2-10mg` | `/products/mt-2.jpg` | `public/products/mt-2.jpg` | OK |
| 29 | `pt-141-10mg` | `/products/pt-141.jpg` | `public/products/pt-141.jpg` | OK |
| 30 | `retatrutide-10mg` | `/products/retatrutide-10mg.jpg` | `public/products/retatrutide-10mg.jpg` | OK |
| 31 | `retatrutide-20mg` | `/products/retatrutide-20mg.jpg` | `public/products/retatrutide-20mg.jpg` | OK |
| 32 | `retatrutide-30mg` | `/products/retatrutide-30mg.jpg` | `public/products/retatrutide-30mg.jpg` | OK |
| 33 | `selank-5mg` | `/products/selank-5mg.jpg` | `public/products/selank-5mg.jpg` | OK |
| 34 | `semax-10mg` | `/products/semax.jpg` | `public/products/semax.jpg` | OK |
| 35 | `thymosin-alpha-1-10mg` | `/products/thymosin-alpha-1.jpg` | `public/products/thymosin-alpha-1.jpg` | OK |
| 36 | `tirzepatide-30mg` | `/products/tirzepatide-30mg.jpg` | `public/products/tirzepatide-30mg.jpg` | OK |
| 37 | `tirzepatide-60mg` | `/products/tirzepatide-60mg.jpg` | `public/products/tirzepatide-60mg.jpg` | OK |
| 38 | `vip-5mg` | `/products/vip.jpg` | `public/products/vip.jpg` | OK |
| 39 | `hcg-5000iu` | `/products/hcg.jpg` | `public/products/hcg.jpg` | OK |
| 40 | `bac-water-3ml` | `/products/bac-water-3ml.jpg` | `public/products/bac-water-3ml.jpg` | OK |

**Shared-image check:** none — every SKU maps to a unique image file.
**Missing / broken:** none (validator asserts every `public/products/<slug>.jpg` exists).
