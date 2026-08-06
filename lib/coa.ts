// ─────────────────────────────────────────────────────────────────────────────
// Certificate of Analysis database.
//
// This file replaces the previous generated-certificate model. Nothing here is
// derived or synthesised: a record exists only because a real document exists,
// and every SKU without one is explicitly marked `isPending` rather than being
// given plausible-looking numbers. That distinction is the whole point of the
// file — a published certificate is a factual claim about a physical lot.
// ─────────────────────────────────────────────────────────────────────────────
import { products } from "@/lib/products";

export interface LabResultItem {
  analyte: string;
  specification: string;
  result: string;
  passed: boolean;
}

export interface COARecord {
  batchNumber: string;
  productSlug: string;
  productName: string;
  testingLab: string;
  testDate: string;
  purityPercentage: number | null;
  pdfUrl: string | null;
  isPending?: boolean;
  labResults: LabResultItem[];
}

/** Placeholder for a SKU with no certificate yet. Never renders as evidence. */
function pendingRecord(slug: string, productName: string): COARecord {
  return {
    batchNumber: `PENDING-${slug.toUpperCase()}`,
    productSlug: slug,
    productName,
    testingLab: "Third-Party Certified Lab",
    testDate: "In Queue",
    purityPercentage: null,
    pdfUrl: null,
    isPending: true,
    labResults: [],
  };
}

// ── Certificates on file ─────────────────────────────────────────────────────
const ACTIVE: Record<string, COARecord[]> = {
  "glp-3-10mg": [
    {
      batchNumber: "GLP3-10-2026-01",
      productSlug: "glp-3-10mg",
      productName: "GLP-3 (10mg)",
      testingLab: "JanoShield Analytical",
      testDate: "2026-07-28",
      purityPercentage: 99.4,
      pdfUrl: "/coas/pdfs/glp3-batch-001.pdf",
      isPending: false,
      labResults: [
        { analyte: "HPLC Purity", specification: "≥ 98.0%", result: "99.4%", passed: true },
        {
          analyte: "Mass Spectrometry",
          specification: "Matches Structure",
          result: "Confirmed",
          passed: true,
        },
      ],
    },
  ],
  "bpc-157-tb-500-combo": [
    {
      batchNumber: "PENDING-BPC-TB",
      productSlug: "bpc-157-tb-500-combo",
      productName: "BPC-157 / TB-500 Blend 10mg",
      testingLab: "Third-Party Certified Lab",
      testDate: "In Queue",
      purityPercentage: null,
      pdfUrl: null,
      isPending: true,
      labResults: [],
    },
  ],
};

/**
 * Every SKU resolves to a record. Pending entries are generated from the live
 * catalog rather than hand-listed, so a new SKU can never silently end up with
 * no COA state at all — it starts as pending and stays that way until a real
 * document replaces it above.
 */
export const COA_DATABASE: Record<string, COARecord[]> = (() => {
  const db: Record<string, COARecord[]> = { ...ACTIVE };
  for (const product of products) {
    if (db[product.id]) continue;
    db[product.id] = [pendingRecord(product.id, `${product.name} (${product.mass})`)];
  }
  return db;
})();

export function getCOAByBatch(batchNumber: string): COARecord | undefined {
  const normalizedBatch = batchNumber.toUpperCase().trim();
  for (const records of Object.values(COA_DATABASE)) {
    const match = records.find((r) => r.batchNumber.toUpperCase() === normalizedBatch);
    if (match) return match;
  }
  return undefined;
}

export function getCOAsBySlug(slug: string): COARecord[] {
  return COA_DATABASE[slug] || [];
}

// ── Derived helpers used by the UI, schema and sitemap ───────────────────────

/** True when a record represents an actual document with results on file. */
export function isActiveCoa(record: COARecord | undefined): record is COARecord {
  return Boolean(record && !record.isPending && record.labResults.length > 0);
}

/** The certificate to show for a SKU, or undefined when none is on file yet. */
export function activeCoaForSlug(slug: string): COARecord | undefined {
  return getCOAsBySlug(slug).find((r) => isActiveCoa(r));
}

/** Every certificate with results — the set that earns a public page. */
export function activeCoas(): COARecord[] {
  return Object.values(COA_DATABASE)
    .flat()
    .filter((r) => isActiveCoa(r));
}

/** Batch numbers offered as lookup examples. Only ever real certificates. */
export const sampleBatches: string[] = activeCoas().map((r) => r.batchNumber);
