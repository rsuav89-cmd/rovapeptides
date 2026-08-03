// ─────────────────────────────────────────────────────────────────────────────
// FAQ content. Rendered by components/faq/FaqAccordion.tsx, previewed on the
// home page (first item of each category), and emitted as FAQPage JSON-LD.
// COMPLIANCE: answers describe materials, testing, and logistics only — no
// dosing, human-use, therapeutic, or outcome language anywhere in this file.
// ─────────────────────────────────────────────────────────────────────────────

export type FaqItem = { question: string; answer: string };
export type FaqCategory = { title: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    title: "Product Quality",
    items: [
      {
        question: "What purity standard do your research compounds meet?",
        answer:
          "Every batch is manufactured to a minimum of 99% purity and verified by third-party HPLC and mass-spectrometry testing before it is released for sale. The measured result for the batch you receive is printed on its Certificate of Analysis, and it is the measured figure — not the minimum spec — that we publish.",
      },
      {
        question: "What does HPLC testing actually measure?",
        answer:
          "High-performance liquid chromatography separates a sample into its individual components and measures the relative area of each peak. The main peak is the target compound; the remaining peaks are related substances. Purity is reported as the percentage of total peak area attributable to the target sequence.",
      },
      {
        question: "Why do you also run mass spectrometry?",
        answer:
          "HPLC confirms how much of the sample is the main component; mass spectrometry confirms that the main component is the sequence it is supposed to be, by measuring its molecular weight. Running both means a batch is verified for identity and for purity rather than only one of the two.",
      },
      {
        question: "Which laboratory performs the testing?",
        answer:
          "Testing is performed by an independent third-party analytical laboratory with no commercial interest in the result. The testing laboratory is named on each Certificate of Analysis alongside the test and release dates.",
      },
      {
        question: "What happens to a batch that fails specification?",
        answer:
          "It is not listed and not shipped. We publish every result we commission, including the ones that send a batch back, and a batch only receives a product page once it has passed identity and purity testing.",
      },
    ],
  },
  {
    title: "COAs & Batch Verification",
    items: [
      {
        question: "How do I verify the Certificate of Analysis for my order?",
        answer:
          "Every product page lists the batch number for the material currently in stock. Enter that batch number on our COA Lookup page and the full certificate for that specific batch will open — including the analyte table, methods, specifications, measured results, and the pass/fail line for each row.",
      },
      {
        question: "Do you provide a Certificate of Analysis for every batch?",
        answer:
          "Yes. A COA is not an optional extra or a per-order request; each batch we release has one, and it is publicly retrievable by batch number without an account or an email address.",
      },
      {
        question: "What is on a Certificate of Analysis?",
        answer:
          "The batch number, product name and presentation, appearance, the testing laboratory, the test and release dates, and an analyte table listing each test performed, the method used, the specification, the measured result, and whether that row passed.",
      },
      {
        question: "The batch number on my vial differs from the one on the website. Is that a problem?",
        answer:
          "No. Product pages show the batch currently being picked, so a vial shipped shortly before a changeover may carry the previous batch number. Look up the number printed on your vial rather than the one on the page — both certificates remain retrievable.",
      },
      {
        question: "Can I request the raw chromatogram for a batch?",
        answer:
          "Yes. Contact support with the batch number and we will provide the underlying chromatogram and mass-spectrometry data for that batch.",
      },
    ],
  },
  {
    title: "Storage & Handling",
    items: [
      {
        question: "How should these compounds be stored?",
        answer:
          "Store lyophilized powders at -20 °C, protected from light and moisture, until they are needed. Short periods at room temperature during transit do not compromise lyophilized material, but vials should be moved to freezer storage promptly on arrival.",
      },
      {
        question: "What is bacteriostatic water used for?",
        answer:
          "It is sterile water containing 0.9% benzyl alcohol, used in laboratory settings to reconstitute lyophilized powders. The benzyl alcohol acts as a bacteriostatic preservative, which is what allows a sealed vial to be accessed more than once under controlled conditions.",
      },
      {
        question: "How should a vial be reconstituted?",
        answer:
          "Work in a clean, controlled laboratory setting. Wipe the septum, introduce the diluent slowly against the vial wall rather than directly onto the powder, and swirl gently until dissolved. Do not shake — agitation can shear peptide structure and produce foaming that makes the solution difficult to draw accurately.",
      },
      {
        question: "How long is a reconstituted research compound stable?",
        answer:
          "Stability varies by compound, diluent, and storage temperature. As a general laboratory guideline, reconstituted solutions should be refrigerated, protected from light, and used within your institution's established protocol window rather than an arbitrary fixed period.",
      },
      {
        question: "Can lyophilized vials be shipped at room temperature?",
        answer:
          "Yes. Freeze-dried research powders are stable at room temperature in transit, which is why lyophilization is the standard presentation for shipping. Cold-chain materials are added whenever a specific compound benefits from temperature protection en route.",
      },
    ],
  },
  {
    title: "Analytical Methods",
    items: [
      {
        question: "How do I read the chromatogram on a peptide COA?",
        answer:
          "An RP-HPLC trace plots detector response against retention time. The target sequence elutes as the dominant peak; everything else — truncated sequences, deletion products, scavenger adducts, residual solvent — appears as smaller peaks before or after it. Purity is the area of the main peak divided by the summed area of all integrated peaks, expressed as a percentage. A single sharp, symmetrical main peak with a flat baseline is what a clean lot looks like; shoulders or a broad tail indicate co-eluting related substances.",
      },
      {
        question: "Why is detection run at 220 nm rather than 280 nm?",
        answer:
          "220 nm targets the peptide bond itself, so every residue contributes to the signal. 280 nm targets aromatic side chains — tryptophan, tyrosine, phenylalanine — which many research peptides contain in small numbers or not at all. A sequence with no aromatic residues is effectively invisible at 280 nm, which is why 220 nm is the standard wavelength for peptide purity work.",
      },
      {
        question: "What does mass spectrometry confirm that HPLC cannot?",
        answer:
          "HPLC quantifies how much of a sample is the main component; it says nothing about what that component is. Electrospray-ionization mass spectrometry measures the molecular mass of the eluting species and compares it against the theoretical mass of the intended sequence. A lot can be 99% pure and still be the wrong peptide — running both methods closes that gap, which is why identity and purity are reported as separate lines on every certificate.",
      },
      {
        question: "What is the difference between chromatographic purity and peptide content?",
        answer:
          "They measure different things and both appear on our certificates. Chromatographic purity (RP-HPLC) describes the proportion of peptide-related material that is the target sequence. Peptide content (nitrogen determination or amino-acid analysis) describes how much of the vial's total mass is peptide at all, with the remainder being counterion salt, residual water, and solvent. A vial can be 99% pure by HPLC and roughly 80% peptide by mass — that is normal for a lyophilized acetate salt, not a discrepancy.",
      },
      {
        question: "How do I calculate the concentration of a reconstituted solution?",
        answer:
          "Concentration equals mass divided by volume. Reconstituting a 10 mg vial with 2 mL of bacteriostatic water yields 5 mg/mL; the same vial with 1 mL yields 10 mg/mL. Working in mg/mL and recording the exact diluent volume in your lab notebook keeps subsequent dilution calculations traceable. This is solution-preparation arithmetic for laboratory use and is not guidance on administering anything.",
      },
      {
        question: "Why is acetate content reported, and does it affect my calculations?",
        answer:
          "Most synthetic peptides are purified as acetate salts, so a portion of the vial's mass is counterion rather than peptide. We report acetate content per batch (specification ≤ 15.0%) precisely so that laboratories doing mass-based calculations can account for it. If your work requires net peptide mass rather than gross vial mass, use the peptide content figure on the certificate.",
      },
      {
        question: "What do the endotoxin and water-content results mean?",
        answer:
          "Bacterial endotoxins are measured by LAL assay and reported in endotoxin units per milligram; a low result indicates the material was handled under controlled conditions during synthesis and fill. Water content is measured by Karl Fischer titration — excess residual moisture accelerates degradation of a lyophilized powder in storage, so a low figure is a stability indicator as much as a purity one.",
      },
    ],
  },
  {
    title: "Ordering & Payments",
    items: [
      {
        question: "Do you require a research or institutional affiliation to order?",
        answer:
          "Products are sold to qualified researchers and institutions for laboratory use only. By placing an order you confirm that the materials will be used accordingly and that you are legally able to receive research chemicals at your delivery address.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept major credit and debit cards along with the additional secure checkout methods shown at checkout. All transactions are processed over an encrypted connection and card details are never stored on our servers.",
      },
      {
        question: "Can I modify or cancel an order after placing it?",
        answer:
          "Contact support as soon as possible with your order number. Orders that have not yet been picked and packed can usually be adjusted or canceled; once a parcel has been handed to the carrier we can no longer change its contents.",
      },
      {
        question: "Do you offer volume or wholesale pricing?",
        answer:
          "Yes. Laboratories, research institutions, and distributors ordering at volume can request tiered pricing through our Wholesale page, which covers minimums, lead times, and recurring-order terms.",
      },
      {
        question: "What if my order arrives damaged or does not match its COA?",
        answer:
          "Contact support within a reasonable period of delivery with your order number and photographs of the vial and packaging. Material that arrives damaged, or that does not correspond to the certificate published for its batch, will be replaced or refunded.",
      },
    ],
  },
  {
    title: "Shipping & Packaging",
    items: [
      {
        question: "How quickly do orders ship?",
        answer:
          "Orders placed before the daily cut-off are picked and dispatched within 24 hours; anything after it goes out the next business day. You will receive tracking as soon as the label is scanned, and the Order Tracking page will show status at any time.",
      },
      {
        question: "How is my order packaged?",
        answer:
          "Orders ship in discreet, unmarked outer packaging with no product names, logos, or contents description on the exterior. Vials are cushioned individually, and cold-chain materials are included whenever a compound benefits from temperature protection in transit.",
      },
      {
        question: "Is shipping free?",
        answer:
          "Domestic shipping is free on orders over $200. Below that threshold, live carrier rates for your selected service are calculated at checkout.",
      },
      {
        question: "Do you offer shipping protection?",
        answer:
          "Yes. Shipping Protection and Priority Handling can be added at checkout. Shipping Protection covers loss or damage in transit; Priority Handling moves your order to the front of the daily pick queue.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Availability depends on your destination's regulations for laboratory research materials, and the recipient is responsible for import compliance and any duties. Contact support before ordering to confirm we can ship to your region.",
      },
    ],
  },
  {
    title: "Compliance & Research Use",
    items: [
      {
        question: "Are your products intended for human or veterinary use?",
        answer:
          "No. All items are sold strictly for laboratory and in-vitro research use, and are not intended for human or veterinary consumption, diagnostic use, or therapeutic use. Nothing on this site should be read as medical guidance.",
      },
      {
        question: "Why does your product copy avoid describing effects or outcomes?",
        answer:
          "Because these are research materials, not products for consumption. Our descriptions cover what a compound is, what it is structurally, and the research contexts in which it appears in the literature. Anything framed as an effect, an outcome, or a protocol would misrepresent what we sell.",
      },
      {
        question: "Do you provide dosing, protocol, or usage guidance?",
        answer:
          "No. We supply characterized materials with published analytical data. Study design, handling protocols, and the regulatory approvals governing them are the responsibility of the researcher and their institution.",
      },
      {
        question: "Who is responsible for compliance with local regulations?",
        answer:
          "The purchaser. Regulations covering the possession, import, and use of research compounds vary by jurisdiction, and by ordering you confirm that you are permitted to receive and handle these materials where you are located.",
      },
    ],
  },
];
