// ─────────────────────────────────────────────────────────────────────────────
// Long-form catalog copy, keyed by FAMILY id (lib/catalog-data.ts).
// COMPLIANCE: every string here is laboratory framing only — mechanism and
// research-context language, never human use, dosing, outcomes, or therapeutic
// claims. Cards keep the short `product.description`; detail pages add depth.
// ─────────────────────────────────────────────────────────────────────────────

export type ProductDetail = {
  /** 2–3 sentence laboratory overview shown on the family detail page. */
  overview: string;
  /** Short, neutral research-context tags rendered as a spec row. */
  researchAreas: string[];
  /** Physical presentation override (default: lyophilized powder). */
  form?: string;
  /** Handling note override (default: reconstitute with bacteriostatic water). */
  handling?: string;
};

export const DEFAULT_FORM = "Lyophilized powder, sealed vial";
export const DEFAULT_HANDLING =
  "Reconstitute with bacteriostatic water in a controlled laboratory setting; swirl gently rather than shaking to preserve peptide structure.";
export const DEFAULT_STORAGE =
  "Store lyophilized at -20 °C, protected from light and moisture. Refrigerate after reconstitution.";
export const TESTING_METHOD = "Third-party HPLC and mass spectrometry, per batch";

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "bpc-157-tb-500": {
    overview:
      "A pre-combined blend of BPC-157 and TB-500 (thymosin beta-4 fragment), supplied as a single lyophilized preparation so laboratories can evaluate the two sequences together without preparing separate vials. Both components appear widely across tissue- and cytoskeletal-repair research.",
    researchAreas: ["Tissue repair models", "Actin-binding studies", "Comparative blend research"],
  },
  tesamorelin: {
    overview:
      "Tesamorelin is GHRH(1-44) carrying a trans-3-hexenoic acid group at its N-terminus, a single modification that blocks DPP-4 cleavage and extends the peptide's survival in solution. That stability is what makes it useful in GHRH-receptor binding work: assays can run longer before degradation confounds the readout. Endocrine-signaling and metabolic investigation is its principal research context.",
    researchAreas: ["Endocrine signaling", "GHRH receptor studies", "Metabolic models"],
  },
  "ss-31": {
    overview:
      "SS-31 (elamipretide) is an aromatic-cationic tetrapeptide that concentrates in the inner mitochondrial membrane and binds cardiolipin. Uptake does not depend on membrane potential, so it still localizes in mitochondria that have already lost polarization - the reason it is a workhorse in oxidative-stress and cristae-integrity studies. Cellular-energy work uses it where membrane structure is the variable under observation.",
    researchAreas: ["Mitochondrial function", "Oxidative stress", "Cardiolipin binding"],
  },
  selank: {
    overview:
      "Selank is a synthetic heptapeptide derived from the endogenous tetrapeptide tuftsin, studied in neuropeptide and behavioral research models. It appears frequently in preclinical work examining monoamine and GABAergic signaling.",
    researchAreas: ["Neuropeptide signaling", "Behavioural models", "Stress-response models"],
  },
  semax: {
    overview:
      "Semax is ACTH(4-10) with a Pro-Gly-Pro tail appended to the C-terminus, an extension that slows enzymatic degradation while leaving out the corticotropic activity of the parent hormone. It turns up most often in BDNF and TrkB expression work, where neurotrophic signaling is the measured endpoint. Comparative studies frequently pair it with other ACTH-fragment analogs such as Adamax.",
    researchAreas: ["Neurotrophic signaling", "BDNF expression", "Cognitive models"],
  },
  "nad-plus": {
    overview:
      "Nicotinamide adenine dinucleotide works two ways in the cell - as a redox carrier cycling between NAD+ and NADH, and as a consumed substrate for sirtuins, PARPs, and CD38. That second role is why it anchors so much longevity-pathway investigation: those enzymes cleave the molecule rather than borrow it. Supplied as a high-purity 1000 mg lyophilized preparation for bench work at assay scale.",
    researchAreas: ["Cellular energy", "Sirtuin pathways", "Redox biology"],
  },
  epithalon: {
    overview:
      "Epithalon is the synthetic tetrapeptide Ala-Glu-Asp-Gly, the sequence isolated from the pineal preparation epithalamin. Cultured-cell studies report induction of telomerase activity in somatic cell lines, which is why it recurs in telomere-length and replicative-aging work. It is among the shortest sequences in this catalog - four residues, 50 mg per vial.",
    researchAreas: ["Telomere research", "Cellular aging", "Telomerase assays"],
  },
  "mots-c": {
    overview:
      "MOTS-c is a 16–amino-acid mitochondrial-derived peptide encoded in mitochondrial DNA, investigated in metabolic-regulation and cellular-energy research. It is widely used in AMPK-pathway and mitonuclear-signaling studies.",
    researchAreas: ["Mitochondrial signaling", "AMPK pathway", "Metabolic regulation"],
  },
  "5-amino-1mq": {
    overview:
      "5-Amino-1MQ is a small-molecule inhibitor of nicotinamide N-methyltransferase (NNMT), investigated in metabolic and adipose-tissue research models. Unlike the peptides in this catalog it is a quinolinium salt, and is often used as a positive control in NNMT enzyme assays.",
    researchAreas: ["NNMT inhibition", "Adipose tissue models", "Metabolic research"],
    form: "Lyophilized small-molecule powder, sealed vial",
  },
  "aod-9604": {
    overview:
      "AOD-9604 is a modified C-terminal fragment (176–191) of human growth hormone, studied in lipid-metabolism and adipose research models. It is used in work that isolates the fragment's activity from full-length growth-hormone signaling.",
    researchAreas: ["Lipid metabolism", "Adipose models", "GH fragment research"],
  },
  "cjc-1295-ipamorelin": {
    overview:
      "A paired preparation of CJC-1295 (No-DAC), a GHRH analog, and ipamorelin, a selective growth-hormone secretagogue. Supplying both sequences in one vial supports endocrine-signaling research that examines GHRH- and GHRP-pathway interaction.",
    researchAreas: ["Endocrine signaling", "GHRH/GHRP pathways", "Comparative blend research"],
  },
  "ghk-cu": {
    overview:
      "GHK-Cu is the copper(II) complex of glycyl-L-histidyl-L-lysine, a tripeptide present in human plasma where reported concentrations decline with age. The copper affinity is the point: it makes the molecule a recurring subject in extracellular-matrix and gene-expression studies, with broad transcriptional shifts reported in cultured cell lines. Skin and collagen work accounts for most of its published research footprint.",
    researchAreas: ["Collagen research", "Copper binding", "Extracellular matrix"],
  },
  glutathione: {
    overview:
      "Glutathione is a naturally occurring tripeptide (glutamate-cysteine-glycine) and the principal intracellular antioxidant, studied in oxidative-balance and skin research models. It is a standard reference in redox and tyrosinase-activity assays.",
    researchAreas: ["Oxidative balance", "Redox assays", "Skin research"],
  },
  "vitamin-b12": {
    overview:
      "Methylcobalamin is the bioactive coenzyme form of vitamin B-12, used across metabolic and cellular research applications. It is commonly included as a cofactor in methylation and homocysteine-pathway work.",
    researchAreas: ["Methylation pathways", "Metabolic research", "Coenzyme studies"],
  },
  "bacteriostatic-water": {
    overview:
      "Sterile water containing 0.9% benzyl alcohol as a bacteriostatic preservative, used to reconstitute lyophilized research materials. The preservative allows a sealed vial to be accessed more than once under laboratory conditions.",
    researchAreas: ["Reconstitution", "Laboratory supplies", "Sample preparation"],
    form: "Sterile solution, sealed multi-use vial",
    handling:
      "Wipe the septum before each withdrawal and store the sealed vial at controlled room temperature, away from light.",
  },
  "glp-2": {
    overview:
      "Two incretin receptors, one 39-amino-acid backbone. GLP-2 (formerly listed as tirzepatide) engages both the GIP and GLP-1 receptors and carries a C20 fatty-diacid chain that promotes albumin binding, the structural feature behind its extended half-life. Its agonism is deliberately imbalanced toward GIP, which is why binding-profile studies almost always run it alongside a pure GLP-1 comparator.",
    researchAreas: ["Incretin receptors", "Glucose regulation", "Metabolic models"],
  },
  "glp-3": {
    overview:
      "GLP-3 (formerly listed as retatrutide) adds a third arm to the incretin-agonist design: a single molecule with activity at the GIP, GLP-1 and glucagon receptors. The glucagon component is what separates it from dual agonists in energy-balance work, and it is typically characterized against both single- and dual-agonist references to isolate that contribution. Supplied lyophilized in 10, 20 and 30 mg presentations for comparative receptor studies.",
    researchAreas: ["GIP/GLP-1/glucagon receptors", "Metabolic models", "Energy balance"],
  },
  kpv: {
    overview:
      "KPV is the C-terminal tripeptide fragment (lysine-proline-valine) of alpha-melanocyte-stimulating hormone. It carries the anti-inflammatory signalling of the parent hormone without its melanocortin-receptor activity, which is why it appears in mucosal and inflammatory-signalling literature rather than in pigmentation work.",
    researchAreas: ["Inflammatory signaling", "Mucosal research", "NF-kB pathway studies"],
  },
};

export function getProductDetail(familyId: string): ProductDetail | undefined {
  return PRODUCT_DETAILS[familyId];
}
