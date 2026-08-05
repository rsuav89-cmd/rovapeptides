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
  { id: "5-amino-1mq", name: "5-Amino-1MQ", skus: ["5-amino-1mq-10mg"], primary: "weight-metabolic", aliases: ["5 amino 1mq", "5amino1mq", "amino 1mq", "nnmt"] },
  { id: "aod-9604", name: "AOD-9604", skus: ["aod-9604-5mg"], primary: "weight-metabolic", secondary: ["hormone-sexual-health"], aliases: ["aod9604", "aod 9604", "gh fragment"] },
  { id: "bacteriostatic-water", name: "Bacteriostatic Water", skus: ["bac-water-30ml"], primary: "vitamins-supplies", aliases: ["bac water", "bacteriostatic", "reconstitution"] },
  { id: "bpc-157-tb-500", name: "BPC-157 / TB-500 Blend", skus: ["bpc-157-tb-500-combo"], primary: "recovery-repair", blend: true, featured: true, aliases: ["bpc tb", "bpc157 tb500", "bpc 157", "bpc157", "tb500", "tb-500", "wolverine"] },
  { id: "cjc-1295-ipamorelin", name: "CJC-1295 No-DAC / Ipamorelin Blend", skus: ["cjc-1295-ipamorelin-combo"], primary: "hormone-sexual-health", blend: true, secondary: ["longevity-aging"], aliases: ["cjc 1295", "cjc1295", "ipamorelin", "cjc ipamorelin", "ghrh"] },
  { id: "epithalon", name: "Epithalon", skus: ["epithalon-10mg"], primary: "longevity-aging", aliases: ["epitalon", "telomerase"] },
  { id: "ghk-cu", name: "GHK-Cu", skus: ["ghk-cu-100mg"], primary: "skin-hair-antioxidant", featured: true, secondary: ["recovery-repair"], aliases: ["ghk cu", "ghkcu", "ghk", "copper peptide"] },
  { id: "glp-2", name: "GLP-2", skus: ["glp-2-10mg", "glp-2-15mg", "glp-2-30mg"], primary: "weight-metabolic", featured: true, aliases: ["glp2", "glp 2", "tirzepatide", "tirz", "dual agonist"] },
  { id: "glp-3", name: "GLP-3", skus: ["glp-3-10mg", "glp-3-20mg", "glp-3-30mg"], primary: "weight-metabolic", featured: true, aliases: ["glp3", "glp 3", "retatrutide", "reta", "triple agonist"] },
  { id: "glutathione", name: "Glutathione", skus: ["glutathione-200mg"], primary: "skin-hair-antioxidant", secondary: ["longevity-aging"], aliases: ["antioxidant", "gsh"] },
  { id: "kpv", name: "KPV", skus: ["kpv-5mg"], primary: "recovery-repair", secondary: ["skin-hair-antioxidant"], aliases: ["kpv peptide", "lysine proline valine", "alpha msh fragment"] },
  { id: "mots-c", name: "MOTS-c", skus: ["mots-c-10mg"], primary: "mitochondrial-energy", secondary: ["weight-metabolic"], aliases: ["mots c", "motsc"] },
  { id: "nad-plus", name: "NAD+", skus: ["nad-plus-500mg"], primary: "mitochondrial-energy", secondary: ["longevity-aging"], featured: true, aliases: ["nad", "nadplus", "nicotinamide"] },
  { id: "selank", name: "Selank", skus: ["selank-10mg"], primary: "brain-mood", aliases: ["tuftsin"] },
  { id: "semax", name: "Semax", skus: ["semax-10mg"], primary: "brain-mood", aliases: ["acth fragment"] },
  { id: "ss-31", name: "SS-31", skus: ["ss-31-10mg"], primary: "mitochondrial-energy", secondary: ["longevity-aging"], featured: true, aliases: ["ss31", "ss 31", "elamipretide"] },
  { id: "tesamorelin", name: "Tesamorelin", skus: ["tesamorelin-10mg"], primary: "hormone-sexual-health", secondary: ["weight-metabolic"], featured: true, aliases: ["tesa", "ghrh analog"] },
  { id: "vitamin-b12", name: "Vitamin B-12", skus: ["vitamin-b12-10mg"], primary: "mitochondrial-energy", secondary: ["longevity-aging"], aliases: ["b12", "b-12", "vitamin b12", "methylcobalamin"] },
];
