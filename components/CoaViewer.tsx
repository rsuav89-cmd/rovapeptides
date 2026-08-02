"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ShieldCheck, Download, FileCheck2, AlertCircle, Check } from "lucide-react";
import { getCoa, sampleBatches, type Coa } from "@/lib/coa";
import { Logo } from "@/components/Logo";

export function CoaViewer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Coa | null>(null);
  const [notFound, setNotFound] = useState(false);

  function lookup(batch: string) {
    const c = getCoa(batch);
    if (c) {
      setActive(c);
      setNotFound(false);
    } else {
      setActive(null);
      setNotFound(true);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) lookup(query);
  }

  return (
    <section id="coa" className="scroll-mt-24 border-t border-line/70">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          {/* Left: copy + lookup */}
          <div>
            <span className="kicker inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
              Certificate of Analysis
            </span>
            <h2 className="mt-4 text-display-md text-ink">
              Verify any batch <span className="text-brand">in seconds.</span>
            </h2>
            <p className="mt-4 max-w-md text-ink-2">
              Enter the batch number printed on your vial to open its full lab report — purity,
              identity, endotoxin, and more. Every result, on the record.
            </p>

            <form onSubmit={onSubmit} className="mt-7">
              <div className="flex items-center gap-2 rounded-full border border-line-strong bg-paper-2 p-1.5 pl-4 transition-[border-color,box-shadow] duration-160 focus-within:border-ink focus-within:shadow-card">
                <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={2} />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setNotFound(false);
                  }}
                  placeholder="e.g. RV-BPC-2431"
                  aria-label="Batch number"
                  className="min-w-0 flex-1 bg-transparent py-2.5 font-mono text-sm uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-muted"
                />
                <button type="submit" className="btn-primary shrink-0 !px-5 !py-2.5">
                  Look up
                </button>
              </div>
            </form>

            <AnimatePresence>
              {notFound && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-ink-2"
                >
                  <AlertCircle className="h-4 w-4 text-gold" strokeWidth={2} />
                  No certificate found for that batch. Try a sample below.
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
                Try a sample batch
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sampleBatches.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setQuery(b);
                      lookup(b);
                    }}
                    className="rounded-full border border-line bg-paper-2/50 px-3 py-1.5 font-mono text-[0.72rem] text-ink-2 transition-[transform,border-color,color] duration-160 ease-out-expo hover:border-ink hover:text-ink active:scale-95"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: certificate preview stub */}
          <button
            onClick={() => lookup(sampleBatches[0])}
            aria-label="Open a sample certificate"
            className="group relative hidden overflow-hidden rounded-xl2 border border-line bg-gradient-to-br from-graphite to-paper p-8 text-left shadow-lift lg:block"
          >
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(50%_50%_at_80%_10%,rgba(183,110,89,0.3),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="data-tag border-signal/30 bg-brand-deep/40 text-white/90">
                  Certificate of Analysis
                </span>
                <ShieldCheck className="h-6 w-6 text-signal" strokeWidth={1.8} />
              </div>
              <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-widest text-signal">
                Batch report
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-white">
                Every lot, documented.
              </p>
              <div className="mt-6 space-y-2.5">
                {["Purity — RP-HPLC", "Identity — LC-MS", "Endotoxin — LAL"].map((r) => (
                  <div key={r} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="h-4 w-4 text-signal" strokeWidth={2.4} />
                    {r}
                  </div>
                ))}
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-signal transition-transform duration-160 ease-out-expo group-hover:translate-x-1">
                View a sample certificate →
              </span>
            </div>
          </button>
        </div>
      </div>

      <CoaModal coa={active} onClose={() => setActive(null)} />
    </section>
  );
}

function CoaModal({ coa, onClose }: { coa: Coa | null; onClose: () => void }) {
  useEffect(() => {
    if (!coa) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [coa, onClose]);

  return (
    <AnimatePresence>
      {coa && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial="closed"
          animate="open"
          exit="closed"
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate of Analysis ${coa.batch}`}
        >
          <motion.button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-white/55 backdrop-blur-[3px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="relative z-10 flex max-h-[calc(100dvh-0.75rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-xl2 border border-line bg-paper-2 shadow-lift sm:max-h-[92vh] sm:rounded-xl2"
            variants={{
              open: { opacity: 1, scale: 1, y: 0 },
              closed: { opacity: 0, scale: 0.96, y: 24 },
            }}
            transition={{ type: "spring", stiffness: 540, damping: 40, mass: 0.8 }}
          >
            {/* doc header */}
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-line bg-paper-2 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <Logo />
                <p className="mt-3 font-display text-lg font-semibold leading-tight text-ink">
                  Certificate of Analysis
                </p>
                <p className="font-mono text-[0.7rem] uppercase tracking-widest text-muted">
                  {coa.productName} · {coa.mass}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-cta px-3 py-1 font-mono text-[0.7rem] font-bold uppercase tracking-widest text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  {coa.overall}
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-line-strong px-3 text-xs font-semibold text-ink transition-[transform,border-color] duration-160 ease-out-expo active:scale-90 sm:h-9 sm:w-9 sm:px-0"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                  <span className="sm:hidden">Close</span>
                </button>
              </div>
            </div>

            {/* meta grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-line px-6 py-4 sm:grid-cols-4">
              <Meta label="Batch / Lot" value={coa.batch} mono />
              <Meta label="Test Date" value={coa.testDate} mono />
              <Meta label="Purity" value={coa.purity} mono />
              <Meta label="Appearance" value="Conforms" />
            </div>

            {/* results table */}
            <div className="overflow-y-auto px-4 py-4 sm:px-6">
              <div className="overflow-x-auto">
                <table className="min-w-[560px] w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line-strong">
                      <th className="py-2 pr-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">Analyte</th>
                      <th className="px-2 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">Method</th>
                      <th className="px-2 py-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted">Spec</th>
                      <th className="py-2 pl-2 text-right font-mono text-[0.62rem] uppercase tracking-widest text-muted">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coa.rows.map((r) => (
                      <tr key={r.analyte} className="border-b border-line last:border-0">
                        <td className="py-2.5 pr-2 font-medium text-ink">{r.analyte}</td>
                        <td className="px-2 py-2.5 text-ink-2">{r.method}</td>
                        <td className="px-2 py-2.5 font-mono text-xs text-muted">{r.spec}</td>
                        <td className="py-2.5 pl-2 text-right">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-signal-ink">
                            {r.result}
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* footer */}
            <div className="border-t border-line bg-paper-2/40 px-6 py-4">
              <p className="text-xs leading-relaxed text-muted">
                Independently analyzed by {coa.lab}. Released {coa.releaseDate}. This document
                certifies the tested lot only.{" "}
                <span className="font-medium text-ink-2">
                  For Research Use Only — Not for Human Consumption.
                </span>
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  className="btn-primary !py-2.5 opacity-90"
                  onClick={() => {}}
                  title="PDF export is a demo in this prototype"
                >
                  <Download className="h-4 w-4" strokeWidth={2} />
                  Download PDF
                </button>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <FileCheck2 className="h-4 w-4 text-signal-ink" strokeWidth={2} />
                  Verified document
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted">{label}</p>
      <p className={`mt-0.5 text-sm text-ink ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
