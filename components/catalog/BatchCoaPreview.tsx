"use client";

import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileCheck2, X } from "lucide-react";
import { getCoa, type CoaRow } from "@/lib/coa";
import { useModal } from "@/lib/useModal";
import { site } from "@/lib/site";
import { Logo } from "@/components/Logo";

// Analytes reordered by decision weight rather than by array order: identity
// and purity first, then the "was it made under control" question, then the
// figures a researcher needs for their own calculations, then confirmation.
const PREVIEW_ORDER = [
  "Purity (Chromatographic)",
  "Identity / Molecular Mass",
  "Bacterial Endotoxins",
  "Peptide Content",
  "Water Content",
  "Acetate Content",
  "Appearance",
];

function ordered(rows: CoaRow[]): CoaRow[] {
  const seen = new Set<string>();
  const out: CoaRow[] = [];
  for (const name of PREVIEW_ORDER) {
    const row = rows.find((r) => r.analyte === name);
    if (row) {
      out.push(row);
      seen.add(row.analyte);
    }
  }
  // Any analyte added later still renders — it never silently disappears.
  rows.forEach((r) => {
    if (!seen.has(r.analyte)) out.push(r);
  });
  return out;
}

/**
 * In-context certificate preview. The objection ("prove the purity claim")
 * gets answered at the pixel where it arises instead of on a route that throws
 * away the selected strength, the quantity, and the scroll position.
 */
export function BatchCoaPreview({
  batch,
  open,
  onClose,
}: {
  batch: string;
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModal(open, onClose, panelRef, closeRef);

  const coa = getCoa(batch);

  return (
    <AnimatePresence>
      {open && coa && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial="closed"
          animate="open"
          exit="closed"
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate of Analysis for batch ${coa.batch}`}
        >
          <motion.button
            aria-label="Close certificate"
            onClick={onClose}
            className="absolute inset-0 bg-ink-dark/55 backdrop-blur-[3px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            ref={panelRef}
            className="relative z-10 flex max-h-[calc(100dvh-0.75rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-xl2 bg-paper-2 shadow-d-4 sm:max-h-[92vh] sm:rounded-xl2"
            variants={{
              open: { opacity: 1, scale: 1, y: 0 },
              closed: { opacity: 0, scale: 0.96, y: 24 },
            }}
            transition={{ type: "spring", stiffness: 540, damping: 40, mass: 0.8 }}
          >
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-line bg-paper-2 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <Logo />
                <p className="mt-3 text-display-sm text-ink">Certificate of Analysis</p>
                <p className="font-mono text-label-sm uppercase text-muted">
                  {coa.productName} · {coa.mass}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-assay-deep px-3 py-1 font-mono text-label-sm uppercase text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  {coa.overall}
                </span>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close certificate"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-line-strong px-3 text-xs font-semibold text-ink transition-[transform,border-color] duration-160 ease-out-expo active:scale-90 sm:h-9 sm:w-9 sm:px-0"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                  <span className="sm:hidden">Close</span>
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-line bg-paper-3/50 p-4 sm:grid-cols-4">
                {[
                  ["Batch / Lot", coa.batch],
                  ["Tested", coa.testDate],
                  ["Released", coa.releaseDate],
                  ["Purity", coa.purity],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-label-sm uppercase text-muted">{label}</dt>
                    <dd className="mt-1 font-mono text-sm text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 text-xs leading-relaxed text-ink-2">
                Independently analyzed by {coa.lab}.
              </p>

              {/* Mobile: method and specification collapse under the analyte name
                  rather than forcing a horizontally scrolling table. */}
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {ordered(coa.rows).map((row) => (
                  <li key={row.analyte} className="grid gap-1 py-3 sm:grid-cols-[1.4fr_1fr_auto] sm:items-baseline sm:gap-4">
                    <span className="text-sm font-medium text-ink">{row.analyte}</span>
                    <span className="font-mono text-xs text-muted">
                      {row.method} · {row.spec}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-assay sm:justify-self-end">
                      {row.result}
                      {row.pass && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-xs leading-relaxed text-muted">
                Chromatographic purity is the share of peptide-related material that is the target
                sequence. Peptide content is how much of the vial&apos;s mass is peptide at all — the
                remainder is acetate counterion and residual water. A high purity figure alongside a
                lower peptide-content figure is a normal lyophilized acetate salt, not a discrepancy.
              </p>
            </div>

            <div className="border-t border-line bg-paper-3/40 px-4 py-4 sm:px-6">
              <p className="text-xs text-ink-2">This document certifies the tested lot only.</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link href={`/coas/${coa.batch}`} className="btn-ghost !px-4 !py-2 text-xs">
                  <FileCheck2 className="h-4 w-4" strokeWidth={2} />
                  Open the full certificate page
                </Link>
              </div>
              <p className="mt-3 font-mono text-label-sm uppercase text-muted">{site.compliance}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
