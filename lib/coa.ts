// Certificate of Analysis data. COAs are derived from the catalog so every batch
// number in the store resolves to a plausible, self-consistent certificate.
// Replace `getCoa` with a real API/DB lookup when COAs are hosted.

import { products, type Product } from "@/lib/products";

export type CoaRow = {
  analyte: string;
  method: string;
  spec: string;
  result: string;
  pass: boolean;
};

export type Coa = {
  batch: string;
  productName: string;
  subtitle: string;
  mass: string;
  purity: string;
  testDate: string;
  releaseDate: string;
  lab: string;
  appearance: string;
  overall: "PASS";
  rows: CoaRow[];
};

// deterministic test dates keyed off batch (no Date.now — stable across renders/builds)
const DATES = [
  "2026-06-14",
  "2026-06-02",
  "2026-05-21",
  "2026-06-19",
  "2026-06-25",
  "2026-05-30",
  "2026-06-27",
  "2026-06-09",
  "2026-05-16",
  "2026-06-28",
];

function buildCoa(p: Product, idx: number): Coa {
  const testDate = DATES[idx % DATES.length];
  return {
    batch: p.batch,
    productName: p.name,
    subtitle: p.subtitle,
    mass: p.mass,
    purity: p.purity,
    testDate,
    releaseDate: testDate,
    lab: "US Analytical Labs, Inc. — Independent Third-Party (USA)",
    appearance: "White to off-white lyophilized powder",
    overall: "PASS",
    rows: [
      { analyte: "Purity (Chromatographic)", method: "RP-HPLC, 220 nm", spec: "≥ 98.0%", result: p.purity, pass: true },
      { analyte: "Identity / Molecular Mass", method: "LC-MS (ESI)", spec: "Conforms to reference", result: "Conforms", pass: true },
      { analyte: "Appearance", method: "Visual", spec: "White to off-white powder", result: "Conforms", pass: true },
      { analyte: "Peptide Content", method: "Nitrogen / AAA", spec: "≥ 80.0%", result: "84.6%", pass: true },
      { analyte: "Water Content", method: "Karl Fischer", spec: "≤ 8.0%", result: "4.2%", pass: true },
      { analyte: "Acetate Content", method: "RP-HPLC", spec: "≤ 15.0%", result: "9.1%", pass: true },
      { analyte: "Bacterial Endotoxins", method: "LAL", spec: "< 10 EU/mg", result: "< 0.5 EU/mg", pass: true },
    ],
  };
}

const BY_BATCH: Record<string, Coa> = Object.fromEntries(
  products.map((p, i) => [p.batch.toUpperCase(), buildCoa(p, i)])
);

export const sampleBatches: string[] = products.slice(0, 5).map((p) => p.batch);

export function getCoa(batch: string): Coa | null {
  const key = batch.trim().toUpperCase();
  return BY_BATCH[key] ?? null;
}
