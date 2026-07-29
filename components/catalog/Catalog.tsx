"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_TABS, products, type Category } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type Tab = (typeof CATEGORY_TABS)[number];

function matches(tab: Tab, p: (typeof products)[number]): boolean {
  if (tab === "All") return true;
  if (tab === "New Arrivals") return Boolean(p.isNew) || p.categories.includes("New Arrivals");
  return p.categories.includes(tab as Category);
}

export function Catalog() {
  const [tab, setTab] = useState<Tab>("All");

  const filtered = useMemo(() => products.filter((p) => matches(tab, p)), [tab]);

  return (
    <section id="catalog" className="scroll-mt-24 border-t border-line/70">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
        {/* Asymmetric section header: title left, filter tabs right */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
            <span className="kicker inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
              The Catalog
            </span>
            <h2 className="mt-4 text-display-md text-ink">
              Every compound, <span className="text-brand">batch-verified.</span>
            </h2>
            <p className="mt-3 text-ink-2">
              Filter by category. Each item ships with a lot-specific Certificate of Analysis —
              tap a card to add it, or look up any batch below.
            </p>
          </div>

          {/* Filter tabs with sliding active pill */}
          <div
            role="tablist"
            aria-label="Product categories"
            className="flex flex-wrap gap-1.5 rounded-full border border-line bg-paper-2/50 p-1.5"
          >
            {CATEGORY_TABS.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t)}
                  className={[
                    "relative rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-160 ease-out-expo",
                    active ? "text-white" : "text-ink-2 hover:text-ink",
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
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </span>
          <span className="hairline flex-1" />
        </div>

        {/* Grid — 4-up at xl to avoid the generic 3-col template; animated reflow on filter */}
        <motion.div
          layout
          className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
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
      </div>
    </section>
  );
}
