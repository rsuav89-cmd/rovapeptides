// ─────────────────────────────────────────────────────────────────────────────
// ROVA collection taxonomy — SINGLE SOURCE OF TRUTH for research collections.
//
// A COLLECTION is a navigational/merchandising research area. Product families
// are assigned to collections in lib/catalog.ts (never here). Category strings
// are NOT hardcoded across components — import from this module.
//
// Visual system: every collection carries restrained luxury tokens derived from
// the ROVA obsidian + copper identity. Category color occupies only small
// surfaces (eyebrows, fine borders, focus rings, low-opacity ambient glow).
// COMPLIANCE: descriptions are neutral organizational copy only — no dosing,
// human-use, treatment, disease, or outcome language.
// ─────────────────────────────────────────────────────────────────────────────

export type CollectionId =
  | "weight-metabolic"
  | "recovery-repair"
  | "mitochondrial-energy"
  | "brain-mood"
  | "hormone-sexual-health"
  | "longevity-aging"
  | "skin-hair-antioxidant"
  | "vitamins-supplies";

export type CollectionMotif =
  | "rings"
  | "waves"
  | "grid-nodes"
  | "signal"
  | "orbital"
  | "time-rings"
  | "surface"
  | "measure";

export type Collection = {
  id: CollectionId;
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
  motif: CollectionMotif;
  /** CSS custom-property values. Consumed via .collection-scope in globals.css. */
  tokens: {
    accent: string;
    accentSoft: string;
    glow: string;
    border: string;
    surface: string;
  };
};

export const collections: Collection[] = [
  {
    id: "weight-metabolic",
    slug: "weight-metabolic",
    name: "Weight & Metabolic Research",
    shortName: "Weight & Metabolic",
    eyebrow: "Research Collection",
    shortDescription:
      "Compounds studied in metabolic-regulation, appetite-signaling, and energy-balance research models.",
    longDescription:
      "This collection organizes research materials investigated in metabolic and energy-balance laboratory models, including incretin and amylin analogs and metabolic small molecules. Supplied for laboratory research use only.",
    displayOrder: 1,
    seoTitle: "Weight & Metabolic Research Peptides — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research materials studied in metabolic and energy-balance models. For research use only.",
    motif: "rings",
    tokens: {
      accent: "#C2653F",
      accentSoft: "#E39A79",
      glow: "rgba(194,101,63,0.16)",
      border: "rgba(194,101,63,0.34)",
      surface: "rgba(194,101,63,0.05)",
    },
  },
  {
    id: "recovery-repair",
    slug: "recovery-tissue-repair",
    name: "Recovery & Tissue Repair",
    shortName: "Recovery & Repair",
    eyebrow: "Research Collection",
    shortDescription:
      "Peptides investigated in tissue-, cellular-repair, and immune-signaling research models.",
    longDescription:
      "This collection organizes research materials studied in tissue- and cellular-repair laboratory models, including protection-compound peptides, repair blends, and immune-signaling peptides. Supplied for laboratory research use only.",
    displayOrder: 2,
    seoTitle: "Recovery & Tissue Repair Research Peptides — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research materials studied in tissue- and cellular-repair models. For research use only.",
    motif: "waves",
    tokens: {
      accent: "#3E8E6E",
      accentSoft: "#71B79B",
      glow: "rgba(62,142,110,0.15)",
      border: "rgba(62,142,110,0.32)",
      surface: "rgba(62,142,110,0.05)",
    },
  },
  {
    id: "mitochondrial-energy",
    slug: "mitochondrial-cellular-energy",
    name: "Mitochondrial & Cellular Energy",
    shortName: "Mitochondrial Energy",
    eyebrow: "Research Collection",
    shortDescription:
      "Compounds studied in mitochondrial-function and cellular-energy research models.",
    longDescription:
      "This collection organizes research materials investigated in mitochondrial and cellular-energy laboratory models, including mitochondria-targeted peptides and cellular coenzymes. Supplied for laboratory research use only.",
    displayOrder: 3,
    seoTitle: "Mitochondrial & Cellular Energy Research — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research materials studied in mitochondrial and cellular-energy models. For research use only.",
    motif: "grid-nodes",
    tokens: {
      accent: "#C9A24B",
      accentSoft: "#E1C583",
      glow: "rgba(201,162,75,0.16)",
      border: "rgba(201,162,75,0.32)",
      surface: "rgba(201,162,75,0.05)",
    },
  },
  {
    id: "brain-mood",
    slug: "brain-mood",
    name: "Brain & Mood Research",
    shortName: "Brain & Mood",
    eyebrow: "Research Collection",
    shortDescription:
      "Peptides investigated in neuropeptide, neuroprotective, and cognitive research models.",
    longDescription:
      "This collection organizes research materials studied in neuropeptide and cognitive laboratory models, including ACTH-fragment analogs and neurotrophic peptide complexes. Supplied for laboratory research use only.",
    displayOrder: 4,
    seoTitle: "Brain & Mood Research Peptides — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research materials studied in neuropeptide and cognitive models. For research use only.",
    motif: "signal",
    tokens: {
      accent: "#8F7EC4",
      accentSoft: "#A99BD3",
      glow: "rgba(124,107,176,0.16)",
      border: "rgba(124,107,176,0.32)",
      surface: "rgba(124,107,176,0.05)",
    },
  },
  {
    id: "hormone-sexual-health",
    slug: "hormone-sexual-health",
    name: "Hormone & Neuroendocrine Research",
    shortName: "Hormone & Endocrine",
    eyebrow: "Research Collection",
    shortDescription:
      "Compounds studied in endocrine-, growth-hormone-axis, and neuroendocrine research models.",
    longDescription:
      "This collection organizes research materials investigated in endocrine and neuroendocrine laboratory models, including growth-hormone secretagogues and gonadotropin research material. Supplied for laboratory research use only.",
    displayOrder: 5,
    seoTitle: "Hormone & Sexual Health Research Peptides — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research materials studied in endocrine and neuroendocrine models. For research use only.",
    motif: "orbital",
    tokens: {
      accent: "#7E9BC4",
      accentSoft: "#8EA7C7",
      glow: "rgba(92,123,166,0.16)",
      border: "rgba(92,123,166,0.32)",
      surface: "rgba(92,123,166,0.05)",
    },
  },
  {
    id: "longevity-aging",
    slug: "longevity-healthy-aging",
    name: "Longevity & Healthy Aging Research",
    shortName: "Longevity & Aging",
    eyebrow: "Research Collection",
    shortDescription:
      "Peptides investigated in cellular-aging, senescence, and bioregulation research models.",
    longDescription:
      "This collection organizes research materials studied in cellular-aging and bioregulation laboratory models, including telomere-research peptides, senolytic peptides, and peptide bioregulators. Supplied for laboratory research use only.",
    displayOrder: 6,
    seoTitle: "Longevity & Healthy Aging Research Peptides — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research materials studied in cellular-aging and bioregulation models. For research use only.",
    motif: "time-rings",
    tokens: {
      accent: "#B08D57",
      accentSoft: "#D0B283",
      glow: "rgba(176,141,87,0.16)",
      border: "rgba(176,141,87,0.32)",
      surface: "rgba(176,141,87,0.05)",
    },
  },
  {
    id: "skin-hair-antioxidant",
    slug: "skin-hair-antioxidant",
    name: "Skin, Hair & Antioxidant Research",
    shortName: "Skin & Antioxidant",
    eyebrow: "Research Collection",
    shortDescription:
      "Compounds studied in skin, collagen, pigmentation, and oxidative-balance research models.",
    longDescription:
      "This collection organizes research materials investigated in skin, collagen, and oxidative-balance laboratory models, including copper peptides, cosmetic peptides, and antioxidant tripeptides. Supplied for laboratory research use only.",
    displayOrder: 7,
    seoTitle: "Skin, Hair & Antioxidant Research Peptides — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research materials studied in skin, collagen, and antioxidant models. For research use only.",
    motif: "surface",
    tokens: {
      accent: "#C98F86",
      accentSoft: "#E3B4AC",
      glow: "rgba(201,143,134,0.16)",
      border: "rgba(201,143,134,0.32)",
      surface: "rgba(201,143,134,0.05)",
    },
  },
  {
    id: "vitamins-supplies",
    slug: "vitamins-preparation-supplies",
    name: "Vitamins & Preparation Supplies",
    shortName: "Vitamins & Supplies",
    eyebrow: "Research Collection",
    shortDescription:
      "Research vitamins and laboratory reconstitution supplies.",
    longDescription:
      "This collection organizes research vitamins and laboratory preparation supplies, including bioactive vitamin coenzymes and bacteriostatic water for reconstitution of lyophilized research materials. Supplied for laboratory research use only.",
    displayOrder: 8,
    seoTitle: "Research Vitamins & Preparation Supplies — RovaPeptides",
    seoDescription:
      "Browse RovaPeptides research vitamins and laboratory preparation supplies. For research use only.",
    motif: "measure",
    tokens: {
      accent: "#8A8F98",
      accentSoft: "#B4B8BF",
      glow: "rgba(138,143,152,0.14)",
      border: "rgba(138,143,152,0.30)",
      surface: "rgba(138,143,152,0.05)",
    },
  },
];

const byId = new Map<CollectionId, Collection>(collections.map((c) => [c.id, c]));
const bySlug = new Map<string, Collection>(collections.map((c) => [c.slug, c]));

export function getCollection(id: CollectionId): Collection {
  const c = byId.get(id);
  if (!c) throw new Error(`Unknown collection id: ${id}`);
  return c;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return bySlug.get(slug);
}

export const collectionsInOrder = [...collections].sort(
  (a, b) => a.displayOrder - b.displayOrder
);
