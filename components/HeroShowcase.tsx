"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { money, products } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";

const featured = products.filter((p) => p.featured);

export function HeroShowcase() {
  const [i, setI] = useState(0);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
    const router = useRouter();
  const p = featured[i] ?? products[0];

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    add(p, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  }

  return (
    <div className="animate-fade-up [animation-delay:120ms]">
      <div
                onClick={() => router.push(`/shop/${p.id}`)}
        className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-xl2 bg-gradient-to-br from-paper-2 to-black shadow-d-3"
      >
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(60%_50%_at_70%_20%,rgba(183,110,89,0.35),transparent_60%)]" />

        <div className="absolute left-5 top-5 z-10">
          <span className="data-tag border-signal/30 bg-brand-deep/40 text-white/90">
            Featured Batch · {p.batch}
          </span>
        </div>

        {/* crossfading product render (real photo w/ SVG fallback) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 1.04, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <ProductImage
              product={p}
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="h-full w-full object-cover transition-transform duration-280 ease-out-expo group-hover:scale-[1.03]"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3">
          <div className="text-white">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-signal">
              Featured
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <p className="mt-1 font-display text-2xl font-semibold">
                  {p.name} · {p.mass}
                </p>
                <p className="mt-0.5 text-sm text-white/70">
                  {p.purity} verified purity · {money(p.price)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={quickAdd}
            aria-label={`Add ${p.name} to cart`}
            className={[
              "grid h-12 w-12 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-160 ease-out-expo will-change-transform active:scale-90",
              added ? "bg-paper-2 text-brand" : "bg-brand-cta text-white hover:shadow-lift",
            ].join(" ")}
          >
            {added ? <Check className="h-5 w-5" strokeWidth={2.6} /> : <Plus className="h-6 w-6" strokeWidth={2.4} />}
          </button>
        </div>
      </div>

      {featured.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {featured.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setI(idx)}
              aria-label={`Show ${f.name}`}
              aria-current={idx === i ? "true" : undefined}
              className="group/dot grid h-11 w-6 place-items-center"
            >
              <span
                className={[
                  "h-1.5 rounded-full transition-[width,background-color] duration-220 ease-out-expo",
                  idx === i ? "w-7 bg-brand-cta" : "w-1.5 bg-line-strong group-hover/dot:bg-muted",
                ].join(" ")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
