# 01 — Inventory Reconciliation (40/40, zero product loss)

**Total SKUs:** 40  ·  **Families:** 33  ·  **Collections:** 8  ·  **Live-priced:** 13  ·  **Pending-priced:** 27

Every one of the 40 active source records appears exactly once. `sourceId` is immutable and is the exact value submitted to the cart. Grouping is by id, never display name.

## Per-SKU reconciliation (all 40)

| # | sourceId | Name | Slug | Strength | Price | Pricing | Image | Family | Primary collection | Secondary | Grouped | Grouping reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `bpc-157-5mg` | BPC-157 | `bpc-157-5mg` | 5 mg | $54 | live | `/products/bpc-157.jpg` | bpc-157 | Recovery & Tissue Repair | — | no | Standalone product (single SKU) |
| 2 | `tesamorelin-10mg` | Tesamorelin | `tesamorelin-10mg` | 10 mg | $99 | live | `/products/tesamorelin.jpg` | tesamorelin | Hormone & Sexual Health | Weight & Metabolic | no | Standalone product (single SKU) |
| 3 | `ss-31-10mg` | SS-31 | `ss-31-10mg` | 10 mg | $129 | live | `/products/ss-31.jpg` | ss-31 | Mitochondrial & Cellular Energy | Longevity & Healthy Aging | no | Standalone product (single SKU) |
| 4 | `selank-10mg` | Selank | `selank-10mg` | 10 mg | $64 | live | `/products/selank.jpg` | selank | Brain & Mood | — | yes | Same compound, different strength/format (variants of one product) |
| 5 | `cerebrolysin-60mg` | Cerebrolysin | `cerebrolysin-60mg` | 60 mg | $109 | live | `/products/cerebrolysin.jpg` | cerebrolysin | Brain & Mood | — | no | Standalone product (single SKU) |
| 6 | `nad-plus-1000mg` | NAD+ | `nad-plus-1000mg` | 1000 mg | $119 | live | `/products/nad-plus.jpg` | nad-plus | Mitochondrial & Cellular Energy | Longevity & Healthy Aging | no | Standalone product (single SKU) |
| 7 | `epithalon-50mg` | Epithalon | `epithalon-50mg` | 50 mg | $69 | live | `/products/epithalon.jpg` | epithalon | Longevity & Healthy Aging | — | no | Standalone product (single SKU) |
| 8 | `foxo4-dri-10mg` | FOXO4-DRI | `foxo4-dri-10mg` | 10 mg | $189 | live | `/products/foxo4-dri.jpg` | foxo4-dri | Longevity & Healthy Aging | — | no | Standalone product (single SKU) |
| 9 | `glutathione-1500mg` | Glutathione | `glutathione-1500mg` | 1500 mg | $89 | live | `/products/glutathione.jpg` | glutathione | Skin, Hair & Antioxidant | Longevity & Healthy Aging | no | Standalone product (single SKU) |
| 10 | `ghk-cu-100mg` | GHK-Cu | `ghk-cu-100mg` | 100 mg | $72 | live | `/products/ghk-cu.jpg` | ghk-cu | Skin, Hair & Antioxidant | Recovery & Tissue Repair | no | Standalone product (single SKU) |
| 11 | `snap-8-10mg` | Snap-8 | `snap-8-10mg` | 10 mg | $58 | live | `/products/snap-8.jpg` | snap-8 | Skin, Hair & Antioxidant | — | no | Standalone product (single SKU) |
| 12 | `vitamin-b12-10mg` | Vitamin B-12 | `vitamin-b12-10mg` | 10 mg | $34 | live | `/products/vitamin-b12.jpg` | vitamin-b12 | Vitamins & Preparation Supplies | Mitochondrial & Cellular Energy | no | Standalone product (single SKU) |
| 13 | `bac-water-10ml` | Bacteriostatic Water | `bac-water-10ml` | 10 mL | $12 | live | `/products/bac-water.jpg` | bacteriostatic-water | Vitamins & Preparation Supplies | — | yes | Same compound, different strength/format (variants of one product) |
| 14 | `5-amino-1mq-10mg` | 5-Amino-1MQ | `5-amino-1mq-10mg` | 10 mg | $0 | pending | `/products/5-amino-1mq-10mg.jpg` | 5-amino-1mq | Weight & Metabolic | — | yes | Same compound, different strength/format (variants of one product) |
| 15 | `5-amino-1mq-50mg` | 5-Amino-1MQ | `5-amino-1mq-50mg` | 50 mg | $0 | pending | `/products/5-amino-1mq-50mg.jpg` | 5-amino-1mq | Weight & Metabolic | — | yes | Same compound, different strength/format (variants of one product) |
| 16 | `adamax-10mg` | Adamax | `adamax-10mg` | 10 mg | $0 | pending | `/products/adamax.jpg` | adamax | Brain & Mood | — | no | Standalone product (single SKU) |
| 17 | `aod-9604-5mg` | AOD-9604 | `aod-9604-5mg` | 5 mg | $0 | pending | `/products/aod-9604.jpg` | aod-9604 | Weight & Metabolic | — | no | Standalone product (single SKU) |
| 18 | `ara-290-10mg` | ARA-290 | `ara-290-10mg` | 10 mg | $0 | pending | `/products/ara-290.jpg` | ara-290 | Recovery & Tissue Repair | — | no | Standalone product (single SKU) |
| 19 | `bpc-157-tb-500-combo` | BPC-157 + TB-500 | `bpc-157-tb-500-combo` | 5 mg + 5 mg | $0 | pending | `/products/bpc-157-tb-500.jpg` | bpc-157-tb-500 | Recovery & Tissue Repair | — | no | Distinct blend formulation — kept separate from its component compounds |
| 20 | `cagrilintide-10mg` | Cagrilintide | `cagrilintide-10mg` | 10 mg | $0 | pending | `/products/cagrilintide.jpg` | cagrilintide | Weight & Metabolic | — | no | Standalone product (single SKU) |
| 21 | `cardiogen-20mg` | Cardiogen | `cardiogen-20mg` | 20 mg | $0 | pending | `/products/cardiogen.jpg` | cardiogen | Longevity & Healthy Aging | — | no | Standalone product (single SKU) |
| 22 | `cjc-1295-ipamorelin-combo` | CJC-1295 No-DAC + Ipamorelin | `cjc-1295-ipamorelin-combo` | 5 mg + 5 mg | $0 | pending | `/products/cjc-1295-ipamorelin.jpg` | cjc-1295-ipamorelin | Hormone & Sexual Health | Longevity & Healthy Aging | no | Distinct blend formulation — kept separate from its component compounds |
| 23 | `glow-70mg` | GLOW | `glow-70mg` | 70 mg | $0 | pending | `/products/glow.jpg` | glow | Skin, Hair & Antioxidant | — | no | Distinct blend formulation — kept separate from its component compounds |
| 24 | `klow-80mg` | KLOW | `klow-80mg` | 80 mg | $0 | pending | `/products/klow.jpg` | klow | Skin, Hair & Antioxidant | — | no | Distinct blend formulation — kept separate from its component compounds |
| 25 | `mots-c-10mg` | MOTS-c | `mots-c-10mg` | 10 mg | $0 | pending | `/products/mots-c-10mg.jpg` | mots-c | Mitochondrial & Cellular Energy | Weight & Metabolic | yes | Same compound, different strength/format (variants of one product) |
| 26 | `mots-c-20mg` | MOTS-c | `mots-c-20mg` | 20 mg | $0 | pending | `/products/mots-c-20mg.jpg` | mots-c | Mitochondrial & Cellular Energy | Weight & Metabolic | yes | Same compound, different strength/format (variants of one product) |
| 27 | `mt-1-10mg` | MT-1 | `mt-1-10mg` | 10 mg | $0 | pending | `/products/mt-1.jpg` | mt-1 | Skin, Hair & Antioxidant | — | no | Standalone product (single SKU) |
| 28 | `mt-2-10mg` | MT-2 | `mt-2-10mg` | 10 mg | $0 | pending | `/products/mt-2.jpg` | mt-2 | Skin, Hair & Antioxidant | Hormone & Sexual Health | no | Standalone product (single SKU) |
| 29 | `pt-141-10mg` | PT-141 | `pt-141-10mg` | 10 mg | $0 | pending | `/products/pt-141.jpg` | pt-141 | Hormone & Sexual Health | — | no | Standalone product (single SKU) |
| 30 | `retatrutide-10mg` | Retatrutide | `retatrutide-10mg` | 10 mg | $0 | pending | `/products/retatrutide-10mg.jpg` | retatrutide | Weight & Metabolic | — | yes | Same compound, different strength/format (variants of one product) |
| 31 | `retatrutide-20mg` | Retatrutide | `retatrutide-20mg` | 20 mg | $0 | pending | `/products/retatrutide-20mg.jpg` | retatrutide | Weight & Metabolic | — | yes | Same compound, different strength/format (variants of one product) |
| 32 | `retatrutide-30mg` | Retatrutide | `retatrutide-30mg` | 30 mg | $0 | pending | `/products/retatrutide-30mg.jpg` | retatrutide | Weight & Metabolic | — | yes | Same compound, different strength/format (variants of one product) |
| 33 | `selank-5mg` | Selank | `selank-5mg` | 5 mg | $0 | pending | `/products/selank-5mg.jpg` | selank | Brain & Mood | — | yes | Same compound, different strength/format (variants of one product) |
| 34 | `semax-10mg` | Semax | `semax-10mg` | 10 mg | $0 | pending | `/products/semax.jpg` | semax | Brain & Mood | — | no | Standalone product (single SKU) |
| 35 | `thymosin-alpha-1-10mg` | Thymosin Alpha-1 | `thymosin-alpha-1-10mg` | 10 mg | $0 | pending | `/products/thymosin-alpha-1.jpg` | thymosin-alpha-1 | Recovery & Tissue Repair | — | no | Standalone product (single SKU) |
| 36 | `tirzepatide-30mg` | Tirzepatide | `tirzepatide-30mg` | 30 mg | $0 | pending | `/products/tirzepatide-30mg.jpg` | tirzepatide | Weight & Metabolic | — | yes | Same compound, different strength/format (variants of one product) |
| 37 | `tirzepatide-60mg` | Tirzepatide | `tirzepatide-60mg` | 60 mg | $0 | pending | `/products/tirzepatide-60mg.jpg` | tirzepatide | Weight & Metabolic | — | yes | Same compound, different strength/format (variants of one product) |
| 38 | `vip-5mg` | VIP | `vip-5mg` | 5 mg | $0 | pending | `/products/vip.jpg` | vip | Brain & Mood | — | no | Standalone product (single SKU) |
| 39 | `hcg-5000iu` | HCG | `hcg-5000iu` | 5000 IU | $0 | pending | `/products/hcg.jpg` | hcg | Hormone & Sexual Health | — | no | Standalone product (single SKU) |
| 40 | `bac-water-3ml` | Bacteriostatic Water | `bac-water-3ml` | 3 mL | $0 | pending | `/products/bac-water-3ml.jpg` | bacteriostatic-water | Vitamins & Preparation Supplies | — | yes | Same compound, different strength/format (variants of one product) |

## All 33 product families

| Family | SKUs | Grouping reason | Confidence |
|---|---|---|---|
| **5-Amino-1MQ** (`5-amino-1mq`) | `5-amino-1mq-10mg`, `5-amino-1mq-50mg` | Same compound, different strength/format (variants of one product) | high |
| **Adamax** (`adamax`) | `adamax-10mg` | Standalone product (single SKU) | high |
| **AOD-9604** (`aod-9604`) | `aod-9604-5mg` | Standalone product (single SKU) | high |
| **ARA-290** (`ara-290`) | `ara-290-10mg` | Standalone product (single SKU) | high |
| **Bacteriostatic Water** (`bacteriostatic-water`) | `bac-water-10ml`, `bac-water-3ml` | Same compound, different strength/format (variants of one product) | high |
| **BPC-157** (`bpc-157`) | `bpc-157-5mg` | Standalone product (single SKU) | high |
| **BPC-157 + TB-500** (`bpc-157-tb-500`) | `bpc-157-tb-500-combo` | Distinct blend formulation — kept separate from its component compounds | high |
| **Cagrilintide** (`cagrilintide`) | `cagrilintide-10mg` | Standalone product (single SKU) | high |
| **Cardiogen** (`cardiogen`) | `cardiogen-20mg` | Standalone product (single SKU) | high |
| **Cerebrolysin** (`cerebrolysin`) | `cerebrolysin-60mg` | Standalone product (single SKU) | high |
| **CJC-1295 No-DAC + Ipamorelin** (`cjc-1295-ipamorelin`) | `cjc-1295-ipamorelin-combo` | Distinct blend formulation — kept separate from its component compounds | high |
| **Epithalon** (`epithalon`) | `epithalon-50mg` | Standalone product (single SKU) | high |
| **FOXO4-DRI** (`foxo4-dri`) | `foxo4-dri-10mg` | Standalone product (single SKU) | high |
| **GHK-Cu** (`ghk-cu`) | `ghk-cu-100mg` | Standalone product (single SKU) | high |
| **GLOW** (`glow`) | `glow-70mg` | Distinct blend formulation — kept separate from its component compounds | high |
| **Glutathione** (`glutathione`) | `glutathione-1500mg` | Standalone product (single SKU) | high |
| **HCG** (`hcg`) | `hcg-5000iu` | Standalone product (single SKU) | high |
| **KLOW** (`klow`) | `klow-80mg` | Distinct blend formulation — kept separate from its component compounds | high |
| **MOTS-c** (`mots-c`) | `mots-c-10mg`, `mots-c-20mg` | Same compound, different strength/format (variants of one product) | high |
| **MT-1** (`mt-1`) | `mt-1-10mg` | Standalone product (single SKU) | high |
| **MT-2** (`mt-2`) | `mt-2-10mg` | Standalone product (single SKU) | high |
| **NAD+** (`nad-plus`) | `nad-plus-1000mg` | Standalone product (single SKU) | high |
| **PT-141** (`pt-141`) | `pt-141-10mg` | Standalone product (single SKU) | high |
| **Retatrutide** (`retatrutide`) | `retatrutide-10mg`, `retatrutide-20mg`, `retatrutide-30mg` | Same compound, different strength/format (variants of one product) | high |
| **Selank** (`selank`) | `selank-5mg`, `selank-10mg` | Same compound, different strength/format (variants of one product) | high |
| **Semax** (`semax`) | `semax-10mg` | Standalone product (single SKU) | high |
| **Snap-8** (`snap-8`) | `snap-8-10mg` | Standalone product (single SKU) | high |
| **SS-31** (`ss-31`) | `ss-31-10mg` | Standalone product (single SKU) | high |
| **Tesamorelin** (`tesamorelin`) | `tesamorelin-10mg` | Standalone product (single SKU) | high |
| **Thymosin Alpha-1** (`thymosin-alpha-1`) | `thymosin-alpha-1-10mg` | Standalone product (single SKU) | medium |
| **Tirzepatide** (`tirzepatide`) | `tirzepatide-30mg`, `tirzepatide-60mg` | Same compound, different strength/format (variants of one product) | high |
| **VIP** (`vip`) | `vip-5mg` | Standalone product (single SKU) | medium |
| **Vitamin B-12** (`vitamin-b12`) | `vitamin-b12-10mg` | Standalone product (single SKU) | high |

## Groupings performed — and why each is safe

- **5-Amino-1MQ** groups 5-amino-1mq-10mg, 5-amino-1mq-50mg: identical compound, differing only by strength/size (a selectable package). Variant selection submits the exact chosen `sourceId`, so no customer can be routed to the wrong SKU.
- **Bacteriostatic Water** groups bac-water-10ml, bac-water-3ml: identical compound, differing only by strength/size (a selectable package). Variant selection submits the exact chosen `sourceId`, so no customer can be routed to the wrong SKU.
- **MOTS-c** groups mots-c-10mg, mots-c-20mg: identical compound, differing only by strength/size (a selectable package). Variant selection submits the exact chosen `sourceId`, so no customer can be routed to the wrong SKU.
- **Retatrutide** groups retatrutide-10mg, retatrutide-20mg, retatrutide-30mg: identical compound, differing only by strength/size (a selectable package). Variant selection submits the exact chosen `sourceId`, so no customer can be routed to the wrong SKU.
- **Selank** groups selank-5mg, selank-10mg: identical compound, differing only by strength/size (a selectable package). Variant selection submits the exact chosen `sourceId`, so no customer can be routed to the wrong SKU.
- **Tirzepatide** groups tirzepatide-30mg, tirzepatide-60mg: identical compound, differing only by strength/size (a selectable package). Variant selection submits the exact chosen `sourceId`, so no customer can be routed to the wrong SKU.

## Kept SEPARATE on purpose (NOT grouped)

- **BPC-157** vs **BPC-157 + TB-500** — a standalone compound vs a blend containing it. Different formulations → different families.
- **GHK-Cu** vs **GLOW** vs **KLOW** — a single compound vs blends containing it → separate families.
- **MT-1** vs **MT-2**, **CJC-1295 No-DAC + Ipamorelin** as its own blend, **Selank 5mg/10mg** grouped (same compound) but distinct from **Semax** — similar abbreviations/areas but different formulations are never merged.

## Uncertain / flagged (medium confidence — do not assume correctness)

- **Thymosin Alpha-1** → Recovery & Tissue Repair. Research spans multiple areas (e.g. immune / vascular / neuro); primary chosen on best available reviewed copy. Flagged for human review; safe because it only affects which collection lists it, never its SKU/price/checkout.
- **VIP** → Brain & Mood. Research spans multiple areas (e.g. immune / vascular / neuro); primary chosen on best available reviewed copy. Flagged for human review; safe because it only affects which collection lists it, never its SKU/price/checkout.

## Counts
- Total SKUs: **40** (must equal 40 ✓)
- Total families: **33**
- Live-priced SKUs: **13**
- Pending-priced SKUs: **27**
- Missing or duplicated SKUs: **0**

