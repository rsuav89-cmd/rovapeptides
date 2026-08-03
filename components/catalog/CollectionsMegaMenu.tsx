"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { collectionsInOrder } from "@/lib/collections";
import { primaryFamilyCount } from "@/lib/catalog";

export function CollectionsMegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-controls="collections-panel"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.9rem] text-ink-2 transition-colors duration-160 hover:text-ink"
      >
        Research Collections
        <ChevronDown className={`h-4 w-4 transition-transform duration-160 ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[560px] rounded-xl2 border border-line bg-paper-2/95 p-3 shadow-lift backdrop-blur-xl animate-fade-up">
          <div className="grid grid-cols-2 gap-1">
            {collectionsInOrder.map((c) => (
              <Link
                key={c.id}
                href={`/shop/collections/${c.slug}`}
                onClick={() => setOpen(false)}
                className="group/item flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/[0.04]"
              >
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: c.tokens.accent }}
                />
                <span className="min-w-0">
                  <span className="block font-sans text-sm font-semibold text-ink">{c.shortName}</span>
                  <span className="block truncate text-xs text-muted">
                    {primaryFamilyCount(c.id)} products
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-line px-3 pt-3">
            <Link href="/shop" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-signal-ink hover:text-brand">
              All collections <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
            <Link href="/shop/all" onClick={() => setOpen(false)} className="text-sm font-medium text-ink-2 hover:text-ink">
              View all products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
