"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqCategory } from "@/lib/faq";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {categories.map((cat) => (
        <div key={cat.title}>
          <h2 className="font-display text-xl font-semibold text-ink">{cat.title}</h2>
          <div className="mt-4 divide-y divide-line rounded-xl2 border border-line bg-paper-2">
            {cat.items.map((item) => {
              const key = `${cat.title}__${item.question}`;
              const isOpen = openKey === key;
              const btnId = `faq-btn-${slugify(key)}`;
              const panelId = `faq-panel-${slugify(key)}`;
              return (
                <div key={key}>
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-ink">{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-muted transition-transform duration-220 ${isOpen ? "rotate-180" : ""}`}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!isOpen}
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-ink-2">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
