"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import type { CatalogProductFamily, SortKey } from "@/lib/catalog";
import { normalizeSearch, sortFamilies } from "@/lib/catalog";
import { FamilyGrid } from "@/components/catalog/FamilyGrid";

type TypeFilter = "all" | "single" | "blend";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "name-asc", label: "Name (A–Z)" },
  { key: "name-desc", label: "Name (Z–A)" },
  { key: "price-asc", label: "Price (low → high)" },
  { key: "price-desc", label: "Price (high → low)" },
];

export function CollectionView({
  families,
  collectionName,
}: {
  families: CatalogProductFamily[];
  collectionName: string;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [type, setType] = useState<TypeFilter>("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Only expose a filter when there are ≥2 meaningful choices.
  const hasBlendChoice = families.some((f) => f.isBlend) && families.some((f) => !f.isBlend);
  const hasAvailabilityChoice = families.some((f) => !f.hasPricing) && families.some((f) => f.hasPricing);
  const activeCount = (type !== "all" ? 1 : 0) + (onlyAvailable ? 1 : 0);

  const results = useMemo(() => {
    const nq = normalizeSearch(q);
    const terms = nq ? nq.split(" ") : [];
    let list = families.filter((f) => {
      if (terms.length && !terms.every((t) => f.searchText.includes(t))) return false;
      if (type === "single" && f.isBlend) return false;
      if (type === "blend" && !f.isBlend) return false;
      if (onlyAvailable && !f.hasPricing) return false;
      return true;
    });
    return sortFamilies(list, sort);
  }, [families, q, type, onlyAvailable, sort]);

  function reset() {
    setQ("");
    setType("all");
    setOnlyAvailable(false);
    setSort("featured");
  }

  return (
    <section className="surface-warm on-light border-t border-line/70">
      <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 lg:py-14">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex-1 sm:max-w-sm">
            <span className="sr-only">Search in {collectionName}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-dark" strokeWidth={2} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${collectionName}…`}
              className="h-11 w-full rounded-full border bg-bone pl-10 pr-4 text-sm text-ink-dark placeholder:text-muted-dark focus:border-copper-muted focus:outline-none"
              style={{ borderColor: "var(--line-warm-strong)" }}
            />
          </label>

          <div className="flex items-center gap-2">
            <span className="hidden font-sans text-xs uppercase tracking-widest text-muted-dark sm:inline">
              {results.length} {results.length === 1 ? "product" : "products"}
            </span>
            <label className="relative">
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-11 rounded-full border bg-bone px-4 text-sm text-ink-dark focus:border-copper-muted focus:outline-none"
                style={{ borderColor: "var(--line-warm-strong)" }}
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key} className="bg-ivory text-ink-dark">
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            {(hasBlendChoice || hasAvailabilityChoice) && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full border bg-bone px-4 text-sm font-medium text-ink-dark transition-colors hover:border-copper-muted lg:hidden"
                style={{ borderColor: "var(--line-warm-strong)" }}
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
                Filters{activeCount ? ` · ${activeCount}` : ""}
              </button>
            )}
          </div>
        </div>

        {/* Desktop inline filters */}
        {(hasBlendChoice || hasAvailabilityChoice) && (
          <div className="mt-4 hidden flex-wrap items-center gap-2 lg:flex">
            {hasBlendChoice &&
              (["all", "single", "blend"] as TypeFilter[]).map((t) => (
                <Chip key={t} active={type === t} onClick={() => setType(t)}>
                  {t === "all" ? "All types" : t === "single" ? "Single compound" : "Blends"}
                </Chip>
              ))}
            {hasAvailabilityChoice && (
              <Chip active={onlyAvailable} onClick={() => setOnlyAvailable((v) => !v)}>
                In stock &amp; priced
              </Chip>
            )}
            {activeCount > 0 && (
              <button onClick={reset} className="inline-flex items-center gap-1.5 px-2 text-xs font-medium text-muted-dark transition-colors hover:text-ink-dark">
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                Reset
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="mt-8">
          {results.length > 0 ? (
            <FamilyGrid families={results} />
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
              <p className="font-display text-xl font-semibold uppercase text-ink-dark">No matches</p>
              <p className="mt-2 text-sm text-muted-dark">
                Nothing in {collectionName} matches your search and filters.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={reset} className="btn-ghost-light">
                  Clear filters
                </button>
                <a href="/shop" className="btn-signal">
                  Browse collections
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={results.length}
        onReset={reset}
        hasBlendChoice={hasBlendChoice}
        hasAvailabilityChoice={hasAvailabilityChoice}
        type={type}
        setType={setType}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
      />
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "rounded-full border px-3.5 py-2 text-xs font-medium transition-colors duration-160",
        active
          ? "border-copper-muted bg-copper-muted/15 text-ink-dark"
          : "bg-bone text-ink-dark-2 hover:text-ink-dark",
      ].join(" ")}
      style={active ? undefined : { borderColor: "var(--line-warm-strong)" }}
    >
      {children}
    </button>
  );
}

function FilterDrawer({
  open,
  onClose,
  resultCount,
  onReset,
  hasBlendChoice,
  hasAvailabilityChoice,
  type,
  setType,
  onlyAvailable,
  setOnlyAvailable,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  onReset: () => void;
  hasBlendChoice: boolean;
  hasAvailabilityChoice: boolean;
  type: TypeFilter;
  setType: (t: TypeFilter) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (v: boolean) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] lg:hidden" initial="closed" animate="open" exit="closed">
          <motion.button
            aria-label="Close filters"
            onClick={onClose}
            className="absolute inset-0 bg-ink-dark/40 backdrop-blur-[2px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            className="absolute inset-x-0 bottom-0 max-h-[80%] overflow-y-auto rounded-t-xl2 border-t bg-ivory p-5"
            style={{ borderColor: "var(--line-warm-strong)" }}
            variants={{ open: { y: 0 }, closed: { y: "100%" } }}
            transition={{ type: "spring", stiffness: 480, damping: 44, mass: 0.8 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold uppercase text-ink-dark">Filters</h2>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close filters"
                className="grid h-10 w-10 place-items-center rounded-full border active:scale-90"
                style={{ borderColor: "var(--line-warm-strong)" }}
              >
                <X className="h-5 w-5 text-ink-dark" />
              </button>
            </div>

            {hasBlendChoice && (
              <div className="mt-5">
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-muted-dark">Type</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["all", "single", "blend"] as TypeFilter[]).map((t) => (
                    <Chip key={t} active={type === t} onClick={() => setType(t)}>
                      {t === "all" ? "All" : t === "single" ? "Single" : "Blends"}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
            {hasAvailabilityChoice && (
              <div className="mt-5">
                <p className="font-sans text-[0.62rem] uppercase tracking-widest text-muted-dark">Availability</p>
                <div className="mt-2">
                  <Chip active={onlyAvailable} onClick={() => setOnlyAvailable(!onlyAvailable)}>
                    In stock &amp; priced
                  </Chip>
                </div>
              </div>
            )}

            <div className="mt-7 flex items-center gap-3">
              <button onClick={onReset} className="btn-ghost-light flex-1">
                Clear
              </button>
              <button onClick={onClose} className="btn-signal flex-1">
                Show {resultCount}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
