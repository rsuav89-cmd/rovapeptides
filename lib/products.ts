// RovaPeptides catalog — real product renders live in /public/products/<slug>.jpg.
// COMPLIANCE: all items are laboratory research materials. Copy avoids dosing/human-use language.

export type Category = "Research Peptides" | "Longevity" | "Skin & Beauty";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  categories: Category[];
  mass: string;
  purity: string;
  price: number;
  batch: string;
  image: string; // real render (also used as fallback)
  photo: string; // real render
  featured?: boolean;
  isNew?: boolean;
};

export const CATEGORY_TABS: ("All" | Category | "New Arrivals")[] = [
  "All",
  "Research Peptides",
  "Longevity",
  "Skin & Beauty",
  "New Arrivals",
];

const img = (slug: string) => `/products/${slug}.jpg`;

export const products: Product[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // EXISTING 13 — unchanged code. The 12 marked "image refresh" below simply
  // get a new JPEG dropped over the same slug file; no object edits needed.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "bpc-157-5mg",
    name: "BPC-157",
    subtitle: "Gastric Pentadecapeptide",
    description:
      "A synthetic 15–amino-acid peptide derived from a protein found in gastric juice, among the most widely studied research compounds in tissue- and cellular-recovery models.",
    categories: ["Research Peptides"],
    mass: "5 mg",
    purity: "99%",
    price: 54,
    batch: "RV-BPC-2431",
    image: img("bpc-157"),
    photo: img("bpc-157"),
    featured: true,
  },
  {
    id: "tesamorelin-10mg",
    name: "Tesamorelin",
    subtitle: "GHRH Analog",
    description:
      "A growth-hormone-releasing-hormone analog studied in metabolic and endocrine-signaling laboratory models. High-purity lyophilized research powder.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 99,
    batch: "RV-TES-2418",
    image: img("tesamorelin"), // image refresh: 32_ROVA_Tesamorelin_10-mg
    photo: img("tesamorelin"),
    featured: true,
  },
  {
    id: "ss-31-10mg",
    name: "SS-31",
    subtitle: "Elamipretide · Mitochondrial Tetrapeptide",
    description:
      "A mitochondria-targeted tetrapeptide investigated in cellular-energy and oxidative-stress research models.",
    categories: ["Research Peptides", "Longevity"],
    mass: "10 mg",
    purity: "99%",
    price: 129,
    batch: "RV-SS3-2440",
    image: img("ss-31"), // image refresh: 31_ROVA_SS-31_10-mg
    photo: img("ss-31"),
    isNew: true,
  },
  {
    id: "selank-10mg",
    name: "Selank",
    subtitle: "Tuftsin-Derived Heptapeptide",
    description:
      "A synthetic heptapeptide studied in neuropeptide and behavioral research models. Lyophilized powder for laboratory use.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 64,
    batch: "RV-SEL-2407",
    image: img("selank"), // image refresh: 28_ROVA_Selank_10-mg
    photo: img("selank"),
  },
  {
    id: "cerebrolysin-60mg",
    name: "Cerebrolysin",
    subtitle: "Neuropeptide Complex",
    description:
      "A peptide complex investigated in neurotrophic and cognitive research models. Supplied for laboratory research applications.",
    categories: ["Research Peptides"],
    mass: "60 mg",
    purity: "99%",
    price: 109,
    batch: "RV-CER-2447",
    image: img("cerebrolysin"), // image refresh: 10_ROVA_Cerebrolysin_60-mg
    photo: img("cerebrolysin"),
    isNew: true,
  },
  {
    id: "nad-plus-1000mg",
    name: "NAD+",
    subtitle: "Redox Coenzyme",
    description:
      "Nicotinamide adenine dinucleotide, a coenzyme central to cellular-energy and longevity research pathways. High-purity lyophilized research powder.",
    categories: ["Longevity"],
    mass: "1000 mg",
    purity: "99%",
    price: 119,
    batch: "RV-NAD-2451",
    image: img("nad-plus"), // image refresh: 22_ROVA_NADplus_1-000-mg
    photo: img("nad-plus"),
    featured: true,
    isNew: true,
  },
  {
    id: "epithalon-50mg",
    name: "Epithalon",
    subtitle: "Telomerase Research Peptide",
    description:
      "A synthetic tetrapeptide studied in telomere and cellular-aging research models. Lyophilized research powder.",
    categories: ["Longevity"],
    mass: "50 mg",
    purity: "99%",
    price: 69,
    batch: "RV-EPI-2429",
    image: img("epithalon"), // image refresh: 12_ROVA_Epithalon_50-mg
    photo: img("epithalon"),
    isNew: true,
  },
  {
    id: "foxo4-dri-10mg",
    name: "FOXO4-DRI",
    subtitle: "Senolytic Research Peptide",
    description:
      "A FOXO4-p53 interaction-disrupting peptide investigated in senescent-cell and longevity research models.",
    categories: ["Longevity"],
    mass: "10 mg",
    purity: "99%",
    price: 189,
    batch: "RV-FOX-2456",
    image: img("foxo4-dri"), // image refresh: 13_ROVA_FOXO4-DRI_10-mg
    photo: img("foxo4-dri"),
    isNew: true,
  },
  {
    id: "glutathione-1500mg",
    name: "Glutathione",
    subtitle: "Glu-Cys-Gly Tripeptide",
    description:
      "A naturally occurring tripeptide antioxidant studied in oxidative-balance and skin research models. High-purity lyophilized powder.",
    categories: ["Skin & Beauty", "Longevity"],
    mass: "1500 mg",
    purity: "99%",
    price: 89,
    batch: "RV-GLU-2412",
    image: img("glutathione"), // image refresh: 16_ROVA_Glutathione_1-500-mg
    photo: img("glutathione"),
  },
  {
    id: "ghk-cu-100mg",
    name: "GHK-Cu",
    subtitle: "Copper Tripeptide-1",
    description:
      "A naturally occurring copper-binding tripeptide investigated in collagen, skin, and cellular-signaling research.",
    categories: ["Skin & Beauty", "Research Peptides"],
    mass: "100 mg",
    purity: "99%",
    price: 72,
    batch: "RV-GHK-2402",
    image: img("ghk-cu"), // image refresh: 14_ROVA_GHK-Cu_100-mg
    photo: img("ghk-cu"),
    featured: true,
  },
  {
    id: "snap-8-10mg",
    name: "Snap-8",
    subtitle: "Acetyl Octapeptide-3",
    description:
      "An eight–amino-acid peptide studied in expression-line and topical cosmetic research models.",
    categories: ["Skin & Beauty"],
    mass: "10 mg",
    purity: "99%",
    price: 58,
    batch: "RV-SN8-2433",
    image: img("snap-8"), // image refresh: 30_ROVA_Snap-8_10-mg
    photo: img("snap-8"),
  },
  {
    id: "vitamin-b12-10mg",
    name: "Vitamin B-12",
    subtitle: "Methylcobalamin",
    description:
      "Methylcobalamin, a bioactive B-vitamin coenzyme used across metabolic and cellular research applications.",
    categories: ["Longevity"],
    mass: "10 mg",
    purity: "99%",
    price: 34,
    batch: "RV-B12-2405",
    image: img("vitamin-b12"), // image refresh: 06_ROVA_B-12_10-mg
    photo: img("vitamin-b12"),
  },
  {
    id: "bac-water-10ml",
    name: "Bacteriostatic Water",
    subtitle: "0.9% Benzyl Alcohol · For Reconstitution",
    description:
      "Sterile water with 0.9% benzyl alcohol for laboratory reconstitution of lyophilized research materials.",
    categories: ["Research Peptides"],
    mass: "10 mL",
    purity: "USP",
    price: 12,
    batch: "RV-BAC-2400",
    image: img("bac-water"), // image refresh: 39_ROVA_Bacteriostatic-Water_10-mL
    photo: img("bac-water"),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEW 27 — from ROVA_Product_Images_Manifest.txt. Slugs → /products/<slug>.jpg.
  // Optimize each source PNG to that JPEG path before shipping.
  // ─────────────────────────────────────────────────────────────────────────

  // 01 — 5-Amino-1MQ_10-mg
  {
    id: "5-amino-1mq-10mg",
    name: "5-Amino-1MQ",
    subtitle: "NNMT Inhibitor",
    description:
      "A small-molecule NNMT inhibitor investigated in metabolic and adipose-tissue research models. High-purity lyophilized research material.",
    categories: ["Longevity"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-AMQ-2601",
    image: img("5-amino-1mq-10mg"),
    photo: img("5-amino-1mq-10mg"),
    isNew: true,
  },
  // 02 — 5-Amino-1MQ_50-mg
  {
    id: "5-amino-1mq-50mg",
    name: "5-Amino-1MQ",
    subtitle: "NNMT Inhibitor",
    description:
      "A small-molecule NNMT inhibitor investigated in metabolic and adipose-tissue research models. High-purity lyophilized research material.",
    categories: ["Longevity"],
    mass: "50 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-AMQ-2602",
    image: img("5-amino-1mq-50mg"),
    photo: img("5-amino-1mq-50mg"),
    isNew: true,
  },
  // 03 — Adamax_10-mg
  {
    id: "adamax-10mg",
    name: "Adamax",
    subtitle: "ACTH-Fragment Analog",
    description:
      "A synthetic ACTH-fragment peptide analog studied in neuroplasticity and cognitive research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-ADX-2603",
    image: img("adamax"),
    photo: img("adamax"),
    isNew: true,
  },
  // 04 — AOD-9604_5-mg
  {
    id: "aod-9604-5mg",
    name: "AOD-9604",
    subtitle: "GH Fragment 176–191",
    description:
      "A modified fragment of the growth-hormone peptide studied in lipid-metabolism and adipose research models.",
    categories: ["Research Peptides", "Longevity"],
    mass: "5 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-AOD-2604",
    image: img("aod-9604"),
    photo: img("aod-9604"),
    isNew: true,
  },
  // 05 — ARA-290_10-mg
  {
    id: "ara-290-10mg",
    name: "ARA-290",
    subtitle: "Cibinetide · EPO-Derived Peptide",
    description:
      "An erythropoietin-derived peptide (cibinetide) investigated in tissue-repair and neuropathic research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-ARA-2605",
    image: img("ara-290"),
    photo: img("ara-290"),
    isNew: true,
  },
  // 07 — BPC-157 + TB-500_5-mg + 5-mg
  {
    id: "bpc-157-tb-500-combo",
    name: "BPC-157 + TB-500",
    subtitle: "Two-Peptide Repair Blend",
    description:
      "A combined blend of two of the most widely studied recovery peptides, supplied for tissue- and cellular-repair research.",
    categories: ["Research Peptides"],
    mass: "5 mg + 5 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-BTB-2607",
    image: img("bpc-157-tb-500"),
    photo: img("bpc-157-tb-500"),
    featured: true,
    isNew: true,
  },
  // 08 — Cagrilintide_10-mg
  {
    id: "cagrilintide-10mg",
    name: "Cagrilintide",
    subtitle: "Amylin Analog",
    description:
      "A long-acting amylin analog studied in metabolic and appetite-signaling research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-CAG-2608",
    image: img("cagrilintide"),
    photo: img("cagrilintide"),
    isNew: true,
  },
  // 09 — Cardiogen_20-mg
  {
    id: "cardiogen-20mg",
    name: "Cardiogen",
    subtitle: "Cardiac Bioregulator",
    description:
      "A cardiac peptide bioregulator investigated in cardiovascular and cellular-aging research models.",
    categories: ["Longevity"],
    mass: "20 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-CDG-2609",
    image: img("cardiogen"),
    photo: img("cardiogen"),
    isNew: true,
  },
  // 11 — CJC-1295 Without DAC + Ipamorelin_5-mg + 5-mg
  {
    id: "cjc-1295-ipamorelin-combo",
    name: "CJC-1295 No-DAC + Ipamorelin",
    subtitle: "GHRH + GHRP Blend",
    description:
      "A paired growth-hormone-releasing-hormone analog and secretagogue blend studied in endocrine-signaling research.",
    categories: ["Research Peptides"],
    mass: "5 mg + 5 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-CJI-2611",
    image: img("cjc-1295-ipamorelin"),
    photo: img("cjc-1295-ipamorelin"),
    isNew: true,
  },
  // 15 — GLOW_70-mg
  {
    id: "glow-70mg",
    name: "GLOW",
    subtitle: "GHK-Cu · BPC-157 · TB-500",
    description:
      "A tri-peptide beauty blend (GHK-Cu, BPC-157, TB-500) investigated in skin, collagen, and recovery research models.",
    categories: ["Skin & Beauty"],
    mass: "70 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-GLW-2615",
    image: img("glow"),
    photo: img("glow"),
    featured: true,
    isNew: true,
  },
  // 17 — KLOW_80-mg
  {
    id: "klow-80mg",
    name: "KLOW",
    subtitle: "GHK-Cu · BPC-157 · TB-500 · KPV",
    description:
      "A four-component peptide blend (GHK-Cu, BPC-157, TB-500, KPV) studied in skin, repair, and inflammatory-signaling research.",
    categories: ["Skin & Beauty"],
    mass: "80 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-KLW-2617",
    image: img("klow"),
    photo: img("klow"),
    isNew: true,
  },
  // 18 — MOTS-c_10-mg
  {
    id: "mots-c-10mg",
    name: "MOTS-c",
    subtitle: "Mitochondrial-Derived Peptide",
    description:
      "A mitochondrial-derived peptide investigated in metabolic-regulation and cellular-energy research models.",
    categories: ["Longevity"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-MTS-2618",
    image: img("mots-c-10mg"),
    photo: img("mots-c-10mg"),
    featured: true,
    isNew: true,
  },
  // 19 — MOTS-c_20-mg
  {
    id: "mots-c-20mg",
    name: "MOTS-c",
    subtitle: "Mitochondrial-Derived Peptide",
    description:
      "A mitochondrial-derived peptide investigated in metabolic-regulation and cellular-energy research models.",
    categories: ["Longevity"],
    mass: "20 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-MTS-2619",
    image: img("mots-c-20mg"),
    photo: img("mots-c-20mg"),
    isNew: true,
  },
  // 20 — MT-1_10-mg
  {
    id: "mt-1-10mg",
    name: "MT-1",
    subtitle: "Melanotan I · α-MSH Analog",
    description:
      "A synthetic analog of alpha-melanocyte-stimulating hormone studied in melanogenesis and pigmentation research models.",
    categories: ["Skin & Beauty"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-MT1-2620",
    image: img("mt-1"),
    photo: img("mt-1"),
    isNew: true,
  },
  // 21 — MT-2_10-mg
  {
    id: "mt-2-10mg",
    name: "MT-2",
    subtitle: "Melanotan II · Cyclic Melanocortin Analog",
    description:
      "A synthetic melanocortin analog investigated in pigmentation and melanogenesis research models.",
    categories: ["Skin & Beauty"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-MT2-2621",
    image: img("mt-2"),
    photo: img("mt-2"),
    isNew: true,
  },
  // 23 — PT-141_10-mg
  {
    id: "pt-141-10mg",
    name: "PT-141",
    subtitle: "Bremelanotide",
    description:
      "A melanocortin-receptor-agonist peptide (bremelanotide) studied in neuroendocrine-signaling research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-PT1-2623",
    image: img("pt-141"),
    photo: img("pt-141"),
    isNew: true,
  },
  // 24 — Retatrutide_10-mg
  {
    id: "retatrutide-10mg",
    name: "Retatrutide",
    subtitle: "GIP/GLP-1/Glucagon Triple Agonist",
    description:
      "A triple-agonist peptide (GIP/GLP-1/glucagon) studied in metabolic and energy-balance research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-RET-2624",
    image: img("retatrutide-10mg"),
    photo: img("retatrutide-10mg"),
    featured: true,
    isNew: true,
  },
  // 25 — Retatrutide_20-mg
  {
    id: "retatrutide-20mg",
    name: "Retatrutide",
    subtitle: "GIP/GLP-1/Glucagon Triple Agonist",
    description:
      "A triple-agonist peptide (GIP/GLP-1/glucagon) studied in metabolic and energy-balance research models.",
    categories: ["Research Peptides"],
    mass: "20 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-RET-2625",
    image: img("retatrutide-20mg"),
    photo: img("retatrutide-20mg"),
    isNew: true,
  },
  // 26 — Retatrutide_30-mg
  {
    id: "retatrutide-30mg",
    name: "Retatrutide",
    subtitle: "GIP/GLP-1/Glucagon Triple Agonist",
    description:
      "A triple-agonist peptide (GIP/GLP-1/glucagon) studied in metabolic and energy-balance research models.",
    categories: ["Research Peptides"],
    mass: "30 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-RET-2626",
    image: img("retatrutide-30mg"),
    photo: img("retatrutide-30mg"),
    isNew: true,
  },
  // 27 — Selank_5-mg  (variant; existing selank = 10 mg)
  {
    id: "selank-5mg",
    name: "Selank",
    subtitle: "Tuftsin-Derived Heptapeptide",
    description:
      "A synthetic heptapeptide studied in neuropeptide and behavioral research models. Lyophilized powder for laboratory use.",
    categories: ["Research Peptides"],
    mass: "5 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-SEL-2627",
    image: img("selank-5mg"),
    photo: img("selank-5mg"),
    isNew: true,
  },
  // 29 — Semax_10-mg
  {
    id: "semax-10mg",
    name: "Semax",
    subtitle: "ACTH(4–10) Fragment Analog",
    description:
      "A synthetic ACTH(4–10) fragment peptide studied in neurotrophic and neuroprotective research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-SMX-2629",
    image: img("semax"),
    photo: img("semax"),
    isNew: true,
  },
  // 33 — Thymosin Alpha-1_10-mg
  {
    id: "thymosin-alpha-1-10mg",
    name: "Thymosin Alpha-1",
    subtitle: "Thymus-Derived Peptide",
    description:
      "A thymus-derived peptide investigated in immune-modulation and cellular-signaling research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-THA-2633",
    image: img("thymosin-alpha-1"),
    photo: img("thymosin-alpha-1"),
    isNew: true,
  },
  // 34 — Tirzepatide_30-mg
  {
    id: "tirzepatide-30mg",
    name: "Tirzepatide",
    subtitle: "Dual GIP/GLP-1 Agonist",
    description:
      "A dual GIP/GLP-1 receptor-agonist peptide studied in metabolic and glucose-regulation research models.",
    categories: ["Research Peptides"],
    mass: "30 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-TZP-2634",
    image: img("tirzepatide-30mg"),
    photo: img("tirzepatide-30mg"),
    featured: true,
    isNew: true,
  },
  // 35 — Tirzepatide_60-mg
  {
    id: "tirzepatide-60mg",
    name: "Tirzepatide",
    subtitle: "Dual GIP/GLP-1 Agonist",
    description:
      "A dual GIP/GLP-1 receptor-agonist peptide studied in metabolic and glucose-regulation research models.",
    categories: ["Research Peptides"],
    mass: "60 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-TZP-2635",
    image: img("tirzepatide-60mg"),
    photo: img("tirzepatide-60mg"),
    isNew: true,
  },
  // 36 — VIP_5-mg
  {
    id: "vip-5mg",
    name: "VIP",
    subtitle: "Vasoactive Intestinal Peptide",
    description:
      "Vasoactive intestinal peptide, investigated in immune, vascular, and neuro-signaling research models.",
    categories: ["Research Peptides"],
    mass: "5 mg",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-VIP-2636",
    image: img("vip"),
    photo: img("vip"),
    isNew: true,
  },
  // 37 — HCG_5-000-IU
  {
    id: "hcg-5000iu",
    name: "HCG",
    subtitle: "Glycoprotein Hormone",
    description:
      "Human chorionic gonadotropin, studied in endocrine- and reproductive-signaling research models. Lyophilized research material.",
    categories: ["Research Peptides"],
    mass: "5000 IU",
    purity: "99%",
    price: 0, // ← set price
    batch: "RV-HCG-2637",
    image: img("hcg"),
    photo: img("hcg"),
    isNew: true,
  },
  // 38 — Bacteriostatic Water_3-mL  (variant; existing bac-water = 10 mL)
  {
    id: "bac-water-3ml",
    name: "Bacteriostatic Water",
    subtitle: "0.9% Benzyl Alcohol · For Reconstitution",
    description:
      "Sterile water with 0.9% benzyl alcohol for laboratory reconstitution of lyophilized research materials.",
    categories: ["Research Peptides"],
    mass: "3 mL",
    purity: "USP",
    price: 0, // ← set price
    batch: "RV-BAC-2638",
    image: img("bac-water-3ml"),
    photo: img("bac-water-3ml"),
  },
];

export const productStorageNote = "Lyophilized powder. Store at -20°C, protected from light.";

export function money(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}


export type InsuranceOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  batch: string;
};

export const shippingInsurance: InsuranceOption[] = [
  {
    id: "shipping-protection",
    name: "Shipping Protection",
    description: "Covers your order against loss or damage in transit.",
    price: 4.99,
    batch: "RV-INS-STD",
  },
  {
    id: "priority-handling",
    name: "Priority Handling",
    description: "Moves your order to the front of the packing queue for faster dispatch.",
    price: 9.99,
    batch: "RV-INS-PRI",
  },
  ];

export function getRecommended(excludeIds: string[] = [], count = 4): Product[] {
  const pool = products.filter((p) => !excludeIds.includes(p.id));
  const featured = pool.filter((p) => p.featured);
  const rest = pool.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, count);
}


// ── Pricing policy (single source of truth) ──────────────────────────────────
// A public purchasable variant may NOT display or submit a zero price unless it
// is explicitly allow-listed. Intentionally empty: nothing is free.
export const ALLOW_ZERO_PRICE_IDS: readonly string[] = [];

export type PurchaseReason = "ok" | "pending-price" | "unavailable";
export type PurchaseEligibility = { purchasable: boolean; reason: PurchaseReason };

// SINGLE source of purchase eligibility. Card, detail, cart, and the checkout
// gate must all consult this — never test price directly. Extend here when
// stock / WooCommerce metadata become part of the model.
export function getPurchaseEligibility(p: Product): PurchaseEligibility {
  if (p.price <= 0 && !ALLOW_ZERO_PRICE_IDS.includes(p.id)) {
    return { purchasable: false, reason: "pending-price" };
  }
  return { purchasable: true, reason: "ok" };
}

export function isPurchasable(p: Product): boolean {
  return getPurchaseEligibility(p).purchasable;
}

/** Display label: real price when priced, else an approved fallback (never "$0"). */
export function priceLabel(p: Product): string {
  return isPurchasable(p) ? money(p.price) : "Pricing coming soon";
}

// ── NEW badge policy ─────────────────────────────────────────────────────────
// Curated marquee launches only — NOT a blanket flag. Keeps the badge meaningful.
export const NEW_BADGE_IDS: readonly string[] = [
  "retatrutide-10mg",
  "retatrutide-20mg",
  "retatrutide-30mg",
  "tirzepatide-30mg",
  "tirzepatide-60mg",
  "cagrilintide-10mg",
  "mots-c-10mg",
  "mots-c-20mg",
  "glow-70mg",
  "klow-80mg",
];

export function showNewBadge(p: Product): boolean {
  return NEW_BADGE_IDS.includes(p.id);
}
