"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, FileCheck2, ShieldCheck, Truck, Snowflake, type LucideIcon } from "lucide-react";
import { money, productStorageNote } from "@/lib/products";
import { useQuickView } from "@/components/quickview/QuickViewContext";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";

export function ProductModal() {
  const { product, isOpen, close } = useQuickView();
  const { add, open: openCart } = useCart();
  const [qty, setQty] = useState(1);

  // reset qty each time a product opens
  useEffect(() => {
    if (isOpen) setQty(1);
  }, [isOpen, product?.id]);

  // Escape to close + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  function addToCart() {
    if (!product) return;
    add(product, qty);
    close();
    openCart();
  }

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial="closed"
          animate="open"
          exit="closed"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} details`}
        >
          {/* backdrop */}
          <motion.button
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-white/50 backdrop-blur-[3px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* panel — origin-aware spring pop */}
          <motion.div
            className="relative z-10 grid max-h-[92vh] w-full max-w-3xl grid-cols-1 overflow-hidden rounded-t-xl2 border border-line bg-paper-2 shadow-lift sm:rounded-xl2 md:grid-cols-2"
            variants={{
              open: { opacity: 1, scale: 1, y: 0 },
              closed: { opacity: 0, scale: 0.96, y: 24 },
            }}
            transition={{ type: "spring", stiffness: 540, damping: 40, mass: 0.8 }}
          >
            {/* close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-paper/80 backdrop-blur transition-transform duration-160 ease-out-expo hover:bg-paper-2 active:scale-90"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            {/* image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-paper-2 to-black md:aspect-auto">
              <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(60%_50%_at_65%_20%,rgba(183,110,89,0.35),transparent_60%)]" />
              <div className="absolute left-4 top-4 z-10">
                <span className="data-tag border-signal/30 bg-brand-deep/40 text-white/90">
                  Batch · {product.batch}
                </span>
              </div>
              <ProductImage
                product={product}
                loading="eager"
                className="absolute inset-0 h-full w-full object-contain p-3"
              />
            </div>

            {/* details */}
            <div className="flex flex-col overflow-y-auto p-6 sm:p-7">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal-ink">
                {product.categories[0]}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">
                {product.name}
              </h2>
              <p className="mt-1 text-muted">{product.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="data-tag">{product.mass}</span>
                <span className="data-tag">{product.purity} purity</span>
                <span className="data-tag">HPLC verified</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-2">{product.description}</p>

              {/* specs */}
              <div className="mt-4 space-y-2 rounded-xl border border-line bg-paper-2/40 p-3">
                <Spec icon={ShieldCheck} label="Purity" value={`${product.purity} (third-party COA)`} />
                <Spec icon={Snowflake} label="Storage" value={productStorageNote} />
                <Spec icon={Truck} label="Shipping" value="Discreet · ships within 24h" />
              </div>

              {/* COA link */}
              <a
                href="#coa"
                onClick={close}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-signal-ink transition-colors hover:text-brand"
              >
                <FileCheck2 className="h-4 w-4" strokeWidth={2} />
                View Certificate of Analysis — {product.batch}
              </a>

              {/* qty + add */}
              <div className="mt-auto flex items-center gap-3 pt-6">
                <div className="flex items-center rounded-full border border-line-strong">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-160 ease-out-expo hover:bg-white/[0.04] active:scale-90"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                  <span className="w-8 text-center font-mono text-sm tabular-nums">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-160 ease-out-expo hover:bg-white/[0.04] active:scale-90"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>

                <button onClick={addToCart} className="btn-signal flex-1">
                  Add {qty > 1 ? `${qty} ` : ""}· {money(product.price * qty)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
    icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" strokeWidth={1.9} />
      <div className="text-sm">
        <span className="font-medium text-ink">{label}:</span>{" "}
        <span className="text-ink-2">{value}</span>
      </div>
    </div>
  );
}
