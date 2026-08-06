"use client";

import { useState } from "react";
import { Check, Plus, Eye, FileCheck2 } from "lucide-react";
import { priceLabel, isPurchasable, showNewBadge, type Product } from "@/lib/products";
import Link2 from "next/link";
import { activeCoaForSlug } from "@/lib/coa";
import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/ProductImage";

// Light editorial product card — sits on a warm/neutral catalog surface so the
// product photography and price read clearly. All commerce logic (routing,
// quick-add, purchasable gating) is unchanged from the original card.
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const purchasable = isPurchasable(product);
  const coa = activeCoaForSlug(product.id);

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    // Never quick-add an unpriced SKU — route to the product page instead.
    if (!purchasable) {
      router.push(`/shop/${product.id}`);
      return;
    }
    add(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  }

  return (
    <article className="card-light group relative">
      {/* A real anchor, not an onClick handler: keyboard-reachable, middle-clickable,
          and it passes internal link equity to the product page. */}
      <Link
        href={`/shop/${product.id}`}
        aria-label={`View ${product.name} — ${product.subtitle}`}
        className="absolute inset-0 z-0 rounded-xl2"
      />
      {/* IMAGE — warm light stage, real render (product.photo) with SVG fallback */}
      <div className="image-stage-light relative aspect-[4/5] overflow-hidden">
        <ProductImage
          product={product}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[400ms] ease-out-expo will-change-transform group-hover:scale-[1.06]"
        />

        {showNewBadge(product) && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-cta px-2.5 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-widest text-white shadow-sm">
            New
          </span>
        )}

        {/* Quick-view affordance — keyboard-focusable, reveals on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/shop/${product.id}`);
          }}
          aria-label={`View details for ${product.name}`}
          className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 sm:flex translate-y-2 items-center gap-1.5 rounded-full border bg-ivory/90 px-3 py-1.5 text-xs font-medium text-ink-dark backdrop-blur transition-[opacity,transform] duration-220 ease-out-expo will-change-transform focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-2 sm:opacity-0"
          style={{ borderColor: "var(--line-warm-strong)" }}
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          View details
        </button>
      </div>

      {/* BODY */}
      <div className="pointer-events-none relative z-[1] flex flex-1 flex-col p-5">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-copper-muted">
          {product.categories[0]}
        </p>

        <h3 className="mt-1 whitespace-normal break-words hyphens-auto text-display-sm text-ink-dark [overflow-wrap:anywhere]">
          {product.name}
        </h3>
        <span
          aria-hidden
          className="mt-1.5 block h-px w-10 origin-left scale-x-0 bg-copper-muted transition-transform delay-[60ms] duration-240 ease-out-expo group-hover:scale-x-100"
        />
        <p className="mt-1.5 break-words text-sm text-muted-dark [overflow-wrap:anywhere]">
          {product.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="data-tag-light">{product.mass}</span>
          <span className="data-tag-light">{product.purity}+ HPLC verified</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.66rem] text-muted-dark">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-muted-dark/60" />
            {coa ? `Batch ${coa.batchNumber}` : "COA in queue"}
          </span>
        </div>

        {/* PRICE + DUAL ACTION — proof is a first-class action, not a footnote. */}
        <div className="mt-4 pt-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-label-sm uppercase tracking-widest text-muted-dark">
              Price
            </p>
            <p className="font-sans text-xl font-semibold tabular-nums text-ink-dark">
              {priceLabel(product)}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <button
              onClick={quickAdd}
              aria-label={
                purchasable
                  ? `Add ${product.name} to cart`
                  : `Details and pricing for ${product.name}`
              }
              className={[
                "pointer-events-auto relative z-10 inline-flex min-h-[44px] items-center justify-center gap-1.5",
                "rounded-lg px-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
                "transition-[background-color,transform,box-shadow] duration-200 ease-spring-out",
                "will-change-transform active:scale-[0.97]",
                !purchasable
                  ? "border bg-transparent text-ink-dark hover:border-copper-muted"
                  : added
                    ? "bg-graphite text-white"
                    : "bg-brand-cta text-white shadow-copper hover:-translate-y-px hover:shadow-copper-lg",
              ].join(" ")}
              style={!purchasable ? { borderColor: "var(--line-warm-strong)" } : undefined}
            >
              {!purchasable ? (
                <Eye className="h-4 w-4" strokeWidth={2.4} />
              ) : added ? (
                <Check className="h-4 w-4" strokeWidth={2.6} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2.6} />
              )}
              {!purchasable ? "Details" : added ? "Added" : "Add"}
            </button>

            {coa ? (
              <Link2
                href={`/coas/${coa.batchNumber}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`View the certificate of analysis for batch ${coa.batchNumber}`}
                className="pointer-events-auto relative z-10 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border bg-transparent px-3.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-dark transition-[border-color,background-color,transform] duration-200 ease-snap hover:bg-sand/40 active:scale-[0.97]"
                style={{ borderColor: "var(--line-warm-strong)" }}
              >
                <FileCheck2 className="h-3.5 w-3.5" strokeWidth={2} />
                COA
              </Link2>
            ) : (
              <span
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border px-3.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-dark opacity-60"
                style={{ borderColor: "var(--line-warm)" }}
              >
                Pending
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
