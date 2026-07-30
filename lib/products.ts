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
  {
    id: "bpc-157-5mg",
    name: "BPC-157",
    subtitle: "Body Protection Compound",
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
    image: img("tesamorelin"),
    photo: img("tesamorelin"),
    featured: true,
  },
  {
    id: "ss-31-10mg",
    name: "SS-31",
    subtitle: "Elamipretide · Mitochondrial",
    description:
      "A mitochondria-targeted tetrapeptide investigated in cellular-energy and oxidative-stress research models.",
    categories: ["Research Peptides", "Longevity"],
    mass: "10 mg",
    purity: "99%",
    price: 129,
    batch: "RV-SS3-2440",
    image: img("ss-31"),
    photo: img("ss-31"),
    isNew: true,
  },
  {
    id: "selank-10mg",
    name: "Selank",
    subtitle: "Anxiolytic Research Peptide",
    description:
      "A synthetic heptapeptide studied in neuropeptide and behavioral research models. Lyophilized powder for laboratory use.",
    categories: ["Research Peptides"],
    mass: "10 mg",
    purity: "99%",
    price: 64,
    batch: "RV-SEL-2407",
    image: img("selank"),
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
    image: img("cerebrolysin"),
    photo: img("cerebrolysin"),
    isNew: true,
  },
  {
    id: "nad-plus-1000mg",
    name: "NAD+",
    subtitle: "Cellular Coenzyme",
    description:
      "Nicotinamide adenine dinucleotide, a coenzyme central to cellular-energy and longevity research pathways. High-purity lyophilized research powder.",
    categories: ["Longevity"],
    mass: "1000 mg",
    purity: "99%",
    price: 119,
    batch: "RV-NAD-2451",
    image: img("nad-plus"),
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
    image: img("epithalon"),
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
    image: img("foxo4-dri"),
    photo: img("foxo4-dri"),
    isNew: true,
  },
  {
    id: "glutathione-1500mg",
    name: "Glutathione",
    subtitle: "Master Antioxidant Tripeptide",
    description:
      "A naturally occurring tripeptide antioxidant studied in oxidative-balance and skin research models. High-purity lyophilized powder.",
    categories: ["Skin & Beauty", "Longevity"],
    mass: "1500 mg",
    purity: "99%",
    price: 89,
    batch: "RV-GLU-2412",
    image: img("glutathione"),
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
    image: img("ghk-cu"),
    photo: img("ghk-cu"),
    featured: true,
  },
  {
    id: "snap-8-10mg",
    name: "Snap-8",
    subtitle: "Octapeptide",
    description:
      "An eight–amino-acid peptide studied in expression-line and topical cosmetic research models.",
    categories: ["Skin & Beauty"],
    mass: "10 mg",
    purity: "99%",
    price: 58,
    batch: "RV-SN8-2433",
    image: img("snap-8"),
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
    image: img("vitamin-b12"),
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
    image: img("bac-water"),
    photo: img("bac-water"),
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
