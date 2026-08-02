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
  "bpc-157": {
    overview:
      "Fifteen amino acids long and unusually stable in gastric acid, BPC-157 is a synthetic partial sequence of a protein first isolated from human gastric juice. It has become a standing reference compound in tissue- and cellular-recovery work, particularly fibroblast-migration and VEGFR2-mediated angiogenesis assays. That acid stability is much of the appeal: the sequence survives conditions that degrade most peptides of comparable length.",
    researchAreas: ["Tissue repair models", "Angiogenesis assays", "Cellular migration"],
  },
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
  cerebrolysin: {
    overview:
      "Cerebrolysin is a peptide complex of low-molecular-weight neuropeptides and free amino acids, investigated in neurotrophic and cognitive research models. Supplied as a research preparation for laboratory characterization.",
    researchAreas: ["Neurotrophic research", "Cognitive models", "Neuropeptide complexes"],
  },
  adamax: {
    overview:
      "Adamax is a synthetic ACTH-fragment peptide analog studied in neuroplasticity and cognitive research models. It is typically evaluated alongside other ACTH-fragment analogs in comparative in-vitro work.",
    researchAreas: ["Neuroplasticity", "Cognitive models", "Comparative ACTH fragments"],
  },
  vip: {
    overview:
      "Vasoactive intestinal peptide is a 28–amino-acid neuropeptide investigated across immune, vascular, and neuro-signaling research models. Its receptor interactions make it a common reference compound in VPAC-receptor assay work.",
    researchAreas: ["Immune signaling", "Vascular research", "VPAC receptor assays"],
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
  "foxo4-dri": {
    overview:
      "FOXO4-DRI is a D-retro-inverso peptide designed to disrupt the FOXO4–p53 interaction, investigated in senescent-cell and longevity research models. It is a standard tool compound in senolytic screening literature.",
    researchAreas: ["Senolytic research", "FOXO4–p53 interaction", "Cellular senescence"],
  },
  cardiogen: {
    overview:
      "Cardiogen is a short peptide bioregulator investigated in cardiovascular and cellular-aging research models. It belongs to the family of tissue-specific bioregulator peptides characterized in Russian gerontology literature.",
    researchAreas: ["Cardiovascular models", "Peptide bioregulators", "Cellular aging"],
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
  "ara-290": {
    overview:
      "ARA-290 (cibinetide) is an 11–amino-acid peptide derived from the helix-B domain of erythropoietin, investigated in tissue-repair and neuropathic research models. It is studied for innate-repair-receptor interactions without the erythropoietic activity of full-length EPO.",
    researchAreas: ["Tissue repair", "Neuropathic models", "Innate repair receptor"],
  },
  cagrilintide: {
    overview:
      "Cagrilintide is a long-acting amylin analog studied in metabolic and appetite-signaling research models. Its acylated backbone is of interest in work examining peptide half-life and amylin-receptor selectivity.",
    researchAreas: ["Amylin receptor studies", "Metabolic models", "Peptide half-life"],
  },
  retatrutide: {
    overview:
      "Retatrutide adds a third arm to the incretin-agonist design: a single molecule with activity at the GIP, GLP-1, and glucagon receptors. The glucagon component is what separates it from dual agonists in energy-balance work, and it is typically characterized against both single- and dual-agonist references to isolate that contribution. Supplied lyophilized in 10, 20, and 30 mg presentations for comparative receptor studies.",
    researchAreas: ["GIP/GLP-1/glucagon receptors", "Metabolic models", "Energy balance"],
  },
  tirzepatide: {
    overview:
      "Two incretin receptors, one 39-amino-acid backbone. Tirzepatide engages both the GIP and GLP-1 receptors and carries a C20 fatty-diacid chain that promotes albumin binding, the structural feature behind its extended half-life. Its agonism is deliberately imbalanced toward GIP, which is why binding-profile studies almost always run it alongside a pure GLP-1 comparator.",
    researchAreas: ["Incretin receptors", "Glucose regulation", "Metabolic models"],
  },
  "cjc-1295-ipamorelin": {
    overview:
      "A paired preparation of CJC-1295 (No-DAC), a GHRH analog, and ipamorelin, a selective growth-hormone secretagogue. Supplying both sequences in one vial supports endocrine-signaling research that examines GHRH- and GHRP-pathway interaction.",
    researchAreas: ["Endocrine signaling", "GHRH/GHRP pathways", "Comparative blend research"],
  },
  hcg: {
    overview:
      "Human chorionic gonadotropin is a glycoprotein hormone studied in endocrine- and reproductive-signaling research models. It is a standard reference material in LH-receptor and gonadotropin assay work.",
    researchAreas: ["Endocrine signaling", "LH receptor assays", "Reproductive models"],
  },
  "pt-141": {
    overview:
      "PT-141 (bremelanotide) is a melanocortin-receptor agonist peptide and a metabolite of melanotan II, studied in neuroendocrine-signaling research models. It is commonly used to probe MC3R and MC4R selectivity.",
    researchAreas: ["Melanocortin receptors", "Neuroendocrine signaling", "MC3R/MC4R selectivity"],
  },
  "thymosin-alpha-1": {
    overview:
      "Thymosin Alpha-1 is a 28–amino-acid thymus-derived peptide investigated in immune-modulation and cellular-signaling research models. It appears widely in work examining T-cell maturation and toll-like-receptor signaling in vitro.",
    researchAreas: ["Immune modulation", "T-cell research", "TLR signaling"],
  },
  "ghk-cu": {
    overview:
      "GHK-Cu is the copper(II) complex of glycyl-L-histidyl-L-lysine, a tripeptide present in human plasma where reported concentrations decline with age. The copper affinity is the point: it makes the molecule a recurring subject in extracellular-matrix and gene-expression studies, with broad transcriptional shifts reported in cultured cell lines. Skin and collagen work accounts for most of its published research footprint.",
    researchAreas: ["Collagen research", "Copper binding", "Extracellular matrix"],
  },
  glow: {
    overview:
      "GLOW puts three sequences in a single vial - GHK-Cu, BPC-157, and TB-500 - at a combined 70 mg. Each is independently characterized in skin, collagen, or tissue-repair literature; the blend exists for work that evaluates them in combination rather than in isolation. One reconstitution yields one solution, so component ratios stay fixed across the study.",
    researchAreas: ["Skin and collagen models", "Comparative blend research", "Tissue repair"],
  },
  klow: {
    overview:
      "KLOW is a four-component preparation of GHK-Cu, BPC-157, TB-500, and KPV, studied in skin, repair, and inflammatory-signaling research models. KPV, an alpha-MSH fragment, adds an inflammatory-signaling axis to the blend.",
    researchAreas: ["Skin research", "Inflammatory signaling", "Comparative blend research"],
  },
  glutathione: {
    overview:
      "Glutathione is a naturally occurring tripeptide (glutamate-cysteine-glycine) and the principal intracellular antioxidant, studied in oxidative-balance and skin research models. It is a standard reference in redox and tyrosinase-activity assays.",
    researchAreas: ["Oxidative balance", "Redox assays", "Skin research"],
  },
  "snap-8": {
    overview:
      "Snap-8 is an eight–amino-acid elongation of the Argireline sequence, studied in expression-line and topical cosmetic research models. It is typically evaluated for SNARE-complex interaction in vitro.",
    researchAreas: ["Cosmetic research", "SNARE complex studies", "Topical formulation"],
  },
  "mt-1": {
    overview:
      "MT-1 (melanotan I, afamelanotide) is a synthetic analog of alpha-melanocyte-stimulating hormone studied in melanogenesis and pigmentation research models. It shows greater MC1R selectivity than MT-2, which is why both are often run side by side.",
    researchAreas: ["Melanogenesis", "MC1R selectivity", "Pigmentation models"],
  },
  "mt-2": {
    overview:
      "MT-2 (melanotan II) is a cyclic synthetic melanocortin analog investigated in pigmentation and melanogenesis research models. Its broader receptor profile makes it a frequent comparator in melanocortin-selectivity studies.",
    researchAreas: ["Melanogenesis", "Melanocortin receptors", "Pigmentation models"],
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
};

export function getProductDetail(familyId: string): ProductDetail | undefined {
  return PRODUCT_DETAILS[familyId];
}
