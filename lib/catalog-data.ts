// ─────────────────────────────────────────────────────────────────────────────
// ROVA family definitions — the ONLY grouping source of truth.
// Runtime-neutral leaf module (only a type import) so scripts/validate-catalog.ts
// can import the REAL data structures under `node --experimental-strip-types`.
// Grouping is DECLARED by immutable source SKU ids, never inferred from names.
// Blends are their own families and are never merged into a component compound.
// ─────────────────────────────────────────────────────────────────────────────
import type { CollectionId } from "./collections";

export type FamilyDef = {
  id: string; // stable family slug (canonical product URL segment)
  name: string; // canonical family name
  skus: string[]; // source product ids, in variant display order
  primary: CollectionId;
  secondary?: CollectionId[];
  blend?: boolean;
  featured?: boolean; // curated family-level merchandising flag
  aliases?: string[]; // extra search terms
  confidence?: "high" | "medium"; // taxonomy confidence; medium => flagged in audit
};

export const FAMILIES: FamilyDef[] = [
  { id: "5-amino-1mq", name: "5-Amino-1MQ", skus: ["5-amino-1mq-10mg", "5-amino-1mq-50mg"], primary: "weight-metabolic", aliases: ["5 amino 1mq", "5amino1mq", "amino 1mq", "nnmt"] },
  { id: "adamax", name: "Adamax", skus: ["adamax-10mg"], primary: "brain-mood", aliases: ["nootropic"] },
  { id: "aod-9604", name: "AOD-9604", skus: ["aod-9604-5mg"], primary: "weight-metabolic", aliases: ["aod9604", "aod 9604", "gh fragment"] },
  { id: "ara-290", name: "ARA-290", skus: ["ara-290-10mg"], primary: "recovery-repair", aliases: ["ara290", "cibinetide"] },
  { id: "bpc-157", name: "BPC-157", skus: ["bpc-157-5mg"], primary: "recovery-repair", featured: true, aliases: ["bpc157", "bpc 157", "body protection compound"] },
  { id: "bpc-157-tb-500", name: "BPC-157 + TB-500", skus: ["bpc-157-tb-500-combo"], primary: "recovery-repair", blend: true, aliases: ["bpc tb", "bpc157 tb500", "bpc tb500", "tb500", "tb-500"] },
  { id: "bacteriostatic-water", name: "Bacteriostatic Water", skus: ["bac-water-10ml", "bac-water-3ml"], primary: "vitamins-supplies", aliases: ["bac water", "bacteriostatic", "reconstitution"] },
  { id: "cagrilintide", name: "Cagrilintide", skus: ["cagrilintide-10mg"], primary: "weight-metabolic", aliases: ["cagri", "amylin"] },
  { id: "cardiogen", name: "Cardiogen", skus: ["cardiogen-20mg"], primary: "longevity-aging", aliases: ["cardiac bioregulator"] },
  { id: "cerebrolysin", name: "Cerebrolysin", skus: ["cerebrolysin-60mg"], primary: "brain-mood", aliases: ["cerebro"] },
  { id: "cjc-1295-ipamorelin", name: "CJC-1295 No-DAC + Ipamorelin", skus: ["cjc-1295-ipamorelin-combo"], primary: "hormone-sexual-health", blend: true, secondary: ["longevity-aging"], aliases: ["cjc 1295", "cjc1295", "ipamorelin", "cjc ipamorelin", "ghrh"] },
  { id: "epithalon", name: "Epithalon", skus: ["epithalon-50mg"], primary: "longevity-aging", aliases: ["epitalon", "telomerase"] },
  { id: "foxo4-dri", name: "FOXO4-DRI", skus: ["foxo4-dri-10mg"], primary: "longevity-aging", aliases: ["foxo4", "foxo 4", "foxo4 dri", "senolytic"] },
  { id: "ghk-cu", name: "GHK-Cu", skus: ["ghk-cu-100mg"], primary: "skin-hair-antioxidant", featured: true, secondary: ["recovery-repair"], aliases: ["ghk cu", "ghkcu", "ghk", "copper peptide"] },
  { id: "glow", name: "GLOW", skus: ["glow-70mg"], primary: "skin-hair-antioxidant", blend: true, featured: true, aliases: ["glow blend"] },
  { id: "glutathione", name: "Glutathione", skus: ["glutathione-1500mg"], primary: "skin-hair-antioxidant", secondary: ["longevity-aging"], aliases: ["antioxidant"] },
  { id: "hcg", name: "HCG", skus: ["hcg-5000iu"], primary: "hormone-sexual-health", aliases: ["human chorionic gonadotropin", "gonadotropin"] },
  { id: "klow", name: "KLOW", skus: ["klow-80mg"], primary: "skin-hair-antioxidant", blend: true, aliases: ["klow blend", "kpv"] },
  { id: "mots-c", name: "MOTS-c", skus: ["mots-c-10mg", "mots-c-20mg"], primary: "mitochondrial-energy", secondary: ["weight-metabolic"], aliases: ["mots c", "motsc"] },
  { id: "mt-1", name: "MT-1", skus: ["mt-1-10mg"], primary: "skin-hair-antioxidant", aliases: ["melanotan 1", "melanotan i", "mt1", "melanotan"] },
  { id: "mt-2", name: "MT-2", skus: ["mt-2-10mg"], primary: "skin-hair-antioxidant", secondary: ["hormone-sexual-health"], aliases: ["melanotan 2", "melanotan ii", "mt2"] },
  { id: "nad-plus", name: "NAD+", skus: ["nad-plus-1000mg"], primary: "mitochondrial-energy", secondary: ["longevity-aging"], featured: true, aliases: ["nad", "nadplus", "nicotinamide"] },
  { id: "pt-141", name: "PT-141", skus: ["pt-141-10mg"], primary: "hormone-sexual-health", aliases: ["pt141", "pt 141", "bremelanotide"] },
  { id: "retatrutide", name: "Retatrutide", skus: ["retatrutide-10mg", "retatrutide-20mg", "retatrutide-30mg"], primary: "weight-metabolic", featured: true, aliases: ["reta", "triple agonist"] },
  { id: "selank", name: "Selank", skus: ["selank-5mg", "selank-10mg"], primary: "brain-mood", aliases: ["anxiolytic"] },
  { id: "semax", name: "Semax", skus: ["semax-10mg"], primary: "brain-mood", aliases: ["nootropic"] },
  { id: "ss-31", name: "SS-31", skus: ["ss-31-10mg"], primary: "mitochondrial-energy", secondary: ["longevity-aging"], featured: true, aliases: ["ss31", "ss 31", "elamipretide"] },
  { id: "snap-8", name: "Snap-8", skus: ["snap-8-10mg"], primary: "skin-hair-antioxidant", aliases: ["snap8", "snap 8", "octapeptide"] },
  { id: "tesamorelin", name: "Tesamorelin", skus: ["tesamorelin-10mg"], primary: "hormone-sexual-health", secondary: ["weight-metabolic"], featured: true, aliases: ["tesa", "ghrh analog"] },
  { id: "thymosin-alpha-1", name: "Thymosin Alpha-1", skus: ["thymosin-alpha-1-10mg"], primary: "recovery-repair", confidence: "medium", aliases: ["thymosin", "ta1", "thymosin a1", "immune"] },
  { id: "tirzepatide", name: "Tirzepatide", skus: ["tirzepatide-30mg", "tirzepatide-60mg"], primary: "weight-metabolic", featured: true, aliases: ["tirz", "dual agonist"] },
  { id: "vip", name: "VIP", skus: ["vip-5mg"], primary: "brain-mood", confidence: "medium", aliases: ["vasoactive intestinal peptide"] },
  { id: "vitamin-b12", name: "Vitamin B-12", skus: ["vitamin-b12-10mg"], primary: "vitamins-supplies", secondary: ["mitochondrial-energy"], aliases: ["b12", "b-12", "vitamin b12", "methylcobalamin"] },
];
