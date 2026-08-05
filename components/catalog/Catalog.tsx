"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_TABS, products, type Category } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type Tab = (typeof CATEGORY_TABS)[number];

function toTab(category?: string): Tab {
  return CATEGORY_TABS.includes(category as Tab) ? (category as Tab) : "All";
}

function matches(tab: Tab, p: (typeof products)[number]): boolean {
  if (tab === "All") return true;
  if (tab === "New Arrivals") return Boolean(p.isNew);
  return p.categories.includes(tab as Category);
}

/**
 * `limit` caps the grid — used on the home page, where showing all 40 SKUs
 * created an extremely long mobile scroll. Capped rendering puts featured
 * compounds first and pairs the grid with a view-all CTA. `/shop/all` renders
 * the same component uncapped.
 */
export function Catalog({ limit }: { limit?: number } = {}) {
  const [tab, setTab] = useState<Tab>("All");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTab(toTab(params.get("category") ?? undefined));
  }, []);

  const matching = useMemo(() => products.filter((p) => matches(tab, p)), [tab]);

  const filtered = useMemo(() => {
    if (!limit) return matching;
    // Featured first, catalog order preserved within each group, then capped.
    return [...matching]
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      .slice(0, limit);
  }, [matching, limit]);

  const capped = filtered.length < matching.length;

  return (
    <section
      id="catalog"
      className="surface-bone on-light grain scroll-mt-24"
    >
      <div className="container-page section">
        {/* Asymmetric section header: title left, filter tabs right */}
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
            <span className="kicker-dark inline-flex items-center gap-2">
              The Catalog
            </span>
            <h2 className="mt-4 text-display-md text-ink-dark">
              Every compound, <span className="text-copper-muted">batch-verified.</span>
            </h2>
            <p className="mt-3 text-ink-dark-2">
              Filter by category. Each item ships with a lot-specific Certificate of Analysis —
              tap a card to add it, or look up any batch below.
            </p>
          </div>

          {/* Filter tabs with sliding active pill */}
          <div
            role="group"
            aria-label="Product categories"
            className="flex gap-1.5 overflow-x-auto rounded-2xl border bg-bone/70 p-1.5 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:rounded-full [&::-webkit-scrollbar]:hidden"
            style={{ borderColor: "var(--line-warm-strong)" }}
          >
            {CATEGORY_TABS.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  aria-pressed={active}
                  onClick={() => setTab(t)}
                  className={[
                    "relative inline-flex min-h-[44px] shrink-0 items-center rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-160 ease-out-expo lg:min-h-0",
                    active ? "text-white" : "text-ink-dark-2 hover:text-ink-dark",
                  ].join(" ")}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-brand-cta"
                      transition={{ type: "spring", stiffness: 480, damping: 40 }}
                    />
                  )}
                  <span className="relative z-10">{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Count readout */}
        <div className="mt-8 flex items-center gap-3">
          <span
            role="status"
            aria-live="polite"
            className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-dark"
          >
            {capped
              ? `Showing ${filtered.length} of ${matching.length} products`
              : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
          </span>
          <span className="hairline-warm flex-1" />
        </div>

        {/* Grid — 4-up at xl to avoid the generic 3-col template; animated reflow on filter */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {limit ? (
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <Link
              href="/shop"
              className="btn-signal inline-flex min-h-[52px] items-center px-8 text-base"
            >
              View All Peptides
              <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
            </Link>
            <p className="max-w-sm text-sm text-muted-dark">
              All {products.length} research compounds, each shipping with a batch-specific
              Certificate of Analysis.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
