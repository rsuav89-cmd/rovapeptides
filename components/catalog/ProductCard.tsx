"use client";

import { useState } from "react";
import { Check, Plus, Eye } from "lucide-react";
import { money, type Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import { useQuickView } from "@/components/quickview/QuickViewContext";
import { ProductImage } from "@/components/ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { open } = useQuickView();
  const [added, setAdded] = useState(false);

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    add(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  }

  return (
    <article
      onClick={() => open(product)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl2 border border-line bg-paper-2 transition-[transform,box-shadow,border-color] duration-280 ease-out-expo will-change-transform hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
    >
      {/* IMAGE — real render (product.photo) with SVG fallback; fixed aspect = no layout shift */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-paper-2 to-paper">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(70%_55%_at_70%_15%,rgba(183,110,89,0.10),transparent_60%)]" />
        <ProductImage
          product={product}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-280 ease-out-expo will-change-transform group-hover:scale-[1.05]"
        />

        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-cta px-2.5 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-widest text-white shadow-sm">
            New
          </span>
        )}

        {/* Quick-view affordance — keyboard-focusable, reveals on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            open(product);
          }}
          aria-label={`Quick view ${product.name}`}
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full border border-line-strong bg-paper/90 px-3 py-1.5 text-xs font-medium opacity-0 backdrop-blur transition-[opacity,transform] duration-220 ease-out-expo will-change-transform focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          Quick view
        </button>
      </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-signal-ink">
          {product.categories[0]}
        </p>

        <h3 className="mt-1 font-display text-[1.15rem] font-semibold leading-tight text-ink">
          {product.name}
        </h3>
        <p className="mt-0.5 text-sm text-muted">{product.subtitle}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="data-tag">{product.mass}</span>
          <span className="data-tag">{product.purity} pure</span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 font-mono text-[0.66rem] text-muted">
          <span className="h-1 w-1 rounded-full bg-brand-cta" />
          Batch {product.batch}
        </div>

        <div className="mt-4 flex items-end justify-between pt-1">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted">Price</p>
            <p className="font-sans text-xl font-semibold text-ink">{money(product.price)}</p>
          </div>

          <button
            onClick={quickAdd}
            aria-label={`Add ${product.name} to cart`}
            className={[
              "group/btn inline-flex h-11 items-center overflow-hidden rounded-full px-3 font-semibold transition-[background-color,transform] duration-160 ease-out-expo will-change-transform active:scale-95",
              added ? "bg-white text-brand-cta" : "bg-brand-cta text-white hover:shadow-copper",
            ].join(" ")}
          >
            {added ? (
              <Check className="h-5 w-5" strokeWidth={2.4} />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.4} />
            )}
            <span
              className={[
                "max-w-0 overflow-hidden whitespace-nowrap text-sm transition-[max-width,margin] duration-220 ease-out-expo",
                added ? "ml-1.5 max-w-[5rem]" : "group-hover/btn:ml-1.5 group-hover/btn:max-w-[5rem]",
              ].join(" ")}
            >
              {added ? "Added" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
