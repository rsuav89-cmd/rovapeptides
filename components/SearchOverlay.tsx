"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { products } from "@/lib/products";
import { ProductImage } from "@/components/ProductImage";
import { useModal } from "@/lib/useModal";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 8);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.batch.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [query]);

  const panelRef = useRef<HTMLDivElement>(null);
  useModal(open, onClose, panelRef, inputRef);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-start justify-center px-3 pt-[max(1rem,env(safe-area-inset-top))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 bg-white/50 backdrop-blur-[3px]"
          />

          <motion.div
            ref={panelRef}
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-hidden rounded-xl2 border border-line bg-paper-2 shadow-lift"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={2} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search peptides, batches, categories…"
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="grid h-11 w-11 place-items-center sm:h-9 sm:w-9 rounded-full border border-line-strong transition-transform active:scale-90"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <ul className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-muted">No products match your search.</li>
              ) : (
                results.map((p) => (
                  <li key={p.id}>
                    <a
                      href={`/shop/${p.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md border border-line bg-paper">
                        <ProductImage product={p} className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold leading-snug text-ink">{p.name}</p>
                        <p className="truncate font-mono text-[0.62rem] uppercase tracking-wider text-muted">
                          {p.mass} · {p.batch}
                        </p>
                      </div>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
