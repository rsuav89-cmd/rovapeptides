// RovaPeptides catalog — real product renders live in /public/products/<slug>.jpg.
// COMPLIANCE: all items are laboratory research materials. Copy avoids dosing/human-use language.

export type Category = "Research Peptides" | "Longevity" | "Skin & Beauty" | "Supplies";

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
  /** Active inventory flag. False removes the SKU from checkout eligibility. */
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
};

export const CATEGORY_TABS: ("All" | Category | "New Arrivals")[] = [
  "All",
  "Research Peptides",
  "Longevity",
  "Skin & Beauty",
  "Supplies",
  "New Arrivals",
];

const img = (slug: string) => `/products/${slug}.jpg`;

export const products: Product[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVE STORE CATALOG — 18 products / 22 SKUs.
  // This array IS the storefront. Anything not listed here is purged from the
  // grid, search, filters, collections, sitemap and COA generation.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "bpc-157-tb-500-combo",
    name: "BPC-157 / TB-500 Blend",
    subtitle: "Two-Peptide Repair Blend",
    description:
      "A combined preparation of BPC-157 and TB-500, 5 mg of each sequence in a single 10 mg vial, supplied for tissue- and cellular-repair research.",
    categories: ["Research Peptides"],
    mass: "5 mg / 5 mg",
    purity: "99%",
    price: 110,
    batch: "RV-BTB-2418",
    image: img("bpc-157-tb-500"),
    photo: img("bpc-157-tb-500"),
    inStock: true,
    featured: true,
  },
  {
    id: "glp-2-10mg",
    name: "GLP-2",
    subtitle: "Dual GIP/GLP-1 Agonist",
    description:
      "A dual GIP/GLP-1 receptor-agonist peptide (formerly listed as tirzepatide) studied in metabolic and glucose-regulation research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 118,
    batch: "RV-GL2-2610",
    image: img("tirzepatide-30mg"),
    photo: img("tirzepatide-30mg"),
    inStock: true,
    featured: true,
  },
  {
    id: "glp-2-15mg",
    name: "GLP-2",
    subtitle: "Dual GIP/GLP-1 Agonist",
    description:
      "A dual GIP/GLP-1 receptor-agonist peptide (formerly listed as tirzepatide) studied in metabolic and glucose-regulation research models.",
    categories: ["Research Peptides"],
    mass: "15 mg",
    purity: "99%",
    price: 158,
    batch: "RV-GL2-2615",
    image: img("tirzepatide-30mg"),
    photo: img("tirzepatide-30mg"),
    inStock: true,
  },
  {
    id: "glp-2-30mg",
    name: "GLP-2",
    subtitle: "Dual GIP/GLP-1 Agonist",
    description:
      "A dual GIP/GLP-1 receptor-agonist peptide (formerly listed as tirzepatide) studied in metabolic and glucose-regulation research models.",
    categories: ["Research Peptides"],
    mass: "30 mg",
    purity: "99%",
    price: 268,
    batch: "RV-GL2-2630",
    image: img("tirzepatide-60mg"),
    photo: img("tirzepatide-60mg"),
    inStock: true,
  },
  {
    id: "glp-3-10mg",
    name: "GLP-3",
    subtitle: "GIP/GLP-1/Glucagon Triple Agonist",
    description:
      "A triple-agonist peptide (formerly listed as retatrutide) with activity at the GIP, GLP-1 and glucagon receptors, studied in metabolic and energy-balance research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 148,
    batch: "RV-GL3-2610",
    image: img("retatrutide-10mg"),
    photo: img("retatrutide-10mg"),
    inStock: true,
    featured: true,
  },
  {
    id: "glp-3-20mg",
    name: "GLP-3",
    subtitle: "GIP/GLP-1/Glucagon Triple Agonist",
    description:
      "A triple-agonist peptide (formerly listed as retatrutide) with activity at the GIP, GLP-1 and glucagon receptors, studied in metabolic and energy-balance research models.",
    categories: ["Research Peptides"],
    mass: "20 mg",
    purity: "99%",
    price: 228,
    batch: "RV-GL3-2620",
    image: img("retatrutide-20mg"),
    photo: img("retatrutide-20mg"),
    inStock: true,
  },
  {
    id: "glp-3-30mg",
    name: "GLP-3",
    subtitle: "GIP/GLP-1/Glucagon Triple Agonist",
    description:
      "A triple-agonist peptide (formerly listed as retatrutide) with activity at the GIP, GLP-1 and glucagon receptors, studied in metabolic and energy-balance research models.",
    categories: ["Research Peptides"],
    mass: "30 mg",
    purity: "99%",
    price: 298,
    batch: "RV-GL3-2630",
    image: img("retatrutide-30mg"),
    photo: img("retatrutide-30mg"),
    inStock: true,
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
    batch: "RV-TES-2429",
    image: img("tesamorelin"),
    photo: img("tesamorelin"),
    inStock: true,
    featured: true,
  },
  {
    id: "cjc-1295-ipamorelin-combo",
    name: "CJC-1295 No-DAC / Ipamorelin Blend",
    subtitle: "GHRH + GHRP Blend",
    description:
      "A paired growth-hormone-releasing-hormone analog and secretagogue blend, 5 mg of each sequence per vial, studied in endocrine-signaling research.",
    categories: ["Research Peptides"],
    mass: "5 mg / 5 mg",
    purity: "99%",
    price: 98,
    batch: "RV-CJI-2451",
    image: img("cjc-1295-ipamorelin"),
    photo: img("cjc-1295-ipamorelin"),
    inStock: true,
  },
  {
    id: "aod-9604-5mg",
    name: "AOD-9604",
    subtitle: "GH Fragment 176–191",
    description:
      "A modified fragment of the growth-hormone peptide studied in lipid-metabolism and adipose research models.",
    categories: ["Research Peptides"],
    mass: "5 mg",
    purity: "99%",
    price: 54,
    batch: "RV-AOD-2407",
    image: img("aod-9604"),
    photo: img("aod-9604"),
    inStock: true,
  },
  {
    id: "5-amino-1mq-10mg",
    name: "5-Amino-1MQ",
    subtitle: "NNMT Inhibitor",
    description:
      "A small-molecule NNMT inhibitor investigated in metabolic and adipose-tissue research models. High-purity lyophilized research material.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 88,
    batch: "RV-AMQ-2455",
    image: img("5-amino-1mq-10mg"),
    photo: img("5-amino-1mq-10mg"),
    inStock: true,
  },
  {
    id: "ss-31-10mg",
    name: "SS-31",
    subtitle: "Elamipretide · Mitochondrial Tetrapeptide",
    description:
      "A mitochondria-targeted tetrapeptide investigated in cellular-energy and oxidative-stress research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 94,
    batch: "RV-SS31-2288",
    image: img("ss-31"),
    photo: img("ss-31"),
    inStock: true,
    featured: true,
  },
  {
    id: "mots-c-10mg",
    name: "MOTS-c",
    subtitle: "Mitochondrial-Derived Peptide",
    description:
      "A mitochondrial-derived peptide investigated in metabolic-regulation and cellular-energy research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 78,
    batch: "RV-MOT-2433",
    image: img("mots-c-10mg"),
    photo: img("mots-c-10mg"),
    inStock: true,
  },
  {
    id: "nad-plus-500mg",
    name: "NAD+",
    subtitle: "Redox Coenzyme",
    description:
      "Nicotinamide adenine dinucleotide, a coenzyme central to cellular-energy and longevity research pathways. High-purity lyophilized research powder.",
    categories: ["Longevity"],
    mass: "500 mg",
    purity: "99%",
    price: 68,
    batch: "RV-NAD-2505",
    image: img("nad-plus"),
    photo: img("nad-plus"),
    inStock: true,
    featured: true,
  },
  {
    id: "epithalon-10mg",
    name: "Epithalon",
    subtitle: "Telomerase Research Peptide",
    description:
      "A synthetic tetrapeptide studied in telomere and cellular-aging research models. Lyophilized research powder.",
    categories: ["Longevity"],
    mass: "10 mg",
    purity: "99%",
    price: 58,
    batch: "RV-EPI-2310",
    image: img("epithalon"),
    photo: img("epithalon"),
    inStock: true,
  },
  {
    id: "ghk-cu-100mg",
    name: "GHK-Cu",
    subtitle: "Copper Tripeptide-1",
    description:
      "A naturally occurring copper-binding tripeptide investigated in collagen, skin, and cellular-signaling research.",
    categories: ["Skin & Beauty"],
    mass: "100 mg",
    purity: "99%",
    price: 48,
    batch: "RV-GHK-2377",
    image: img("ghk-cu"),
    photo: img("ghk-cu"),
    inStock: true,
    featured: true,
  },
  {
    id: "kpv-5mg",
    name: "KPV",
    subtitle: "α-MSH Tripeptide Fragment",
    description:
      "The C-terminal tripeptide fragment of alpha-melanocyte-stimulating hormone, studied in inflammatory-signaling and mucosal research models.",
    categories: ["Research Peptides"],
    mass: "5 mg",
    purity: "99%",
    price: 52,
    batch: "RV-KPV-2605",
    image: img("kpv"),
    photo: img("kpv"),
    inStock: true,
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
    price: 54,
    batch: "RV-SEL-2361",
    image: img("selank"),
    photo: img("selank"),
    inStock: true,
  },
  {
    id: "semax-10mg",
    name: "Semax",
    subtitle: "ACTH(4–10) Fragment Analog",
    description:
      "A synthetic ACTH(4–10) fragment peptide studied in neurotrophic and neuroprotective research models.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 56,
    batch: "RV-SMX-2344",
    image: img("semax"),
    photo: img("semax"),
    inStock: true,
  },
  {
    id: "glutathione-200mg",
    name: "Glutathione",
    subtitle: "Glu-Cys-Gly Tripeptide",
    description:
      "A naturally occurring tripeptide antioxidant studied in oxidative-balance and skin research models. High-purity lyophilized powder.",
    categories: ["Skin & Beauty", "Longevity"],
    mass: "200 mg",
    purity: "99%",
    price: 42,
    batch: "RV-GSH-2320",
    image: img("glutathione"),
    photo: img("glutathione"),
    inStock: true,
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
    batch: "RV-B12-2390",
    image: img("vitamin-b12"),
    photo: img("vitamin-b12"),
    inStock: true,
  },
  {
    id: "bac-water-30ml",
    name: "Bacteriostatic Water",
    subtitle: "0.9% Benzyl Alcohol · For Reconstitution",
    description:
      "Sterile water with 0.9% benzyl alcohol for laboratory reconstitution of lyophilized research materials.",
    categories: ["Supplies"],
    mass: "30 mL",
    purity: "99%",
    price: 12,
    batch: "RV-BAC-2630",
    image: img("bac-water"),
    photo: img("bac-water"),
    inStock: true,
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

/**
 * SKUs whose product render does not exist yet. Declaring one here keeps the
 * QA suite green for real regressions while reporting the gap on every run —
 * the alternative (pointing at another compound's vial) ships a mislabelled
 * photograph, which on a research product is worse than a missing one.
 */
export const PENDING_PRODUCT_RENDERS: readonly string[] = ["kpv-5mg"];

export type PurchaseReason = "ok" | "pending-price" | "unavailable";
export type PurchaseEligibility = { purchasable: boolean; reason: PurchaseReason };

// SINGLE source of purchase eligibility. Card, detail, cart, and the checkout
// gate must all consult this — never test price directly. Extend here when
// stock / WooCommerce metadata become part of the model.
export function getPurchaseEligibility(p: Product): PurchaseEligibility {
  if (p.price <= 0 && !ALLOW_ZERO_PRICE_IDS.includes(p.id)) {
    return { purchasable: false, reason: "pending-price" };
  }
  if (!p.inStock) {
    return { purchasable: false, reason: "unavailable" };
  }
  return { purchasable: true, reason: "ok" };
}

export function isPurchasable(p: Product): boolean {
  return getPurchaseEligibility(p).purchasable;
}

/** Display label: real price when priced, else an approved fallback (never "$0"). */
export function priceLabel(p: Product): string {
  if (isPurchasable(p)) return money(p.price);
  return getPurchaseEligibility(p).reason === "unavailable"
    ? "Out of stock"
    : "Pricing coming soon";
}

// ── NEW badge policy ─────────────────────────────────────────────────────────
// Curated marquee launches only — NOT a blanket flag. Keeps the badge meaningful.
export const NEW_BADGE_IDS: readonly string[] = [
  "glp-3-10mg",
  "glp-3-20mg",
  "glp-3-30mg",
  "glp-2-10mg",
  "glp-2-15mg",
  "glp-2-30mg",
  "kpv-5mg",
];

export function showNewBadge(p: Product): boolean {
  return NEW_BADGE_IDS.includes(p.id);
}
