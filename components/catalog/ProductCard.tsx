"use client";

import { useState } from "react";
import { Check, Plus, Eye } from "lucide-react";
import { priceLabel, isPurchasable, showNewBadge, type Product } from "@/lib/products";
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
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-280 ease-out-expo will-change-transform group-hover:scale-[1.05]"
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
      <div className="pointer-events-none relative z-[1] flex flex-1 flex-col p-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-copper-muted">
          {product.categories[0]}
        </p>

        <h3 className="mt-1 whitespace-normal break-words hyphens-auto font-display text-[1.05rem] font-semibold leading-tight text-ink-dark [overflow-wrap:anywhere] min-[520px]:text-[1.15rem]">
          {product.name}
        </h3>
        <p className="mt-0.5 break-words text-sm text-muted-dark [overflow-wrap:anywhere]">
          {product.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="data-tag-light">{product.mass}</span>
          <span className="data-tag-light">{product.purity} pure</span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 font-mono text-[0.66rem] text-muted-dark">
          <span className="h-1 w-1 rounded-full bg-brand-cta" />
          Batch {product.batch}
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 pt-1">
          <div className="min-w-0">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-dark">Price</p>
            <p className="font-sans text-xl font-semibold text-ink-dark">{priceLabel(product)}</p>
          </div>

          <button
            onClick={quickAdd}
            aria-label={purchasable ? `Add ${product.name} to cart` : `Details and pricing for ${product.name}`}
            className={[
              "group/btn pointer-events-auto relative z-10 inline-flex h-11 items-center overflow-hidden rounded-full px-3 font-semibold transition-[background-color,transform] duration-160 ease-out-expo will-change-transform active:scale-95",
              !purchasable
                ? "border bg-transparent text-ink-dark hover:border-copper-muted hover:text-copper-muted"
                : added
                  ? "bg-graphite text-white"
                  : "bg-brand-cta text-white hover:shadow-copper",
            ].join(" ")}
            style={!purchasable ? { borderColor: "var(--line-warm-strong)" } : undefined}
          >
            {!purchasable ? (
              <Eye className="h-5 w-5" strokeWidth={2.4} />
            ) : added ? (
              <Check className="h-5 w-5" strokeWidth={2.4} />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.4} />
            )}
            <span
              className={[
                "max-w-0 overflow-hidden whitespace-nowrap text-sm transition-[max-width,margin] duration-220 ease-out-expo",
                !purchasable
                  ? "group-hover/btn:ml-1.5 group-hover/btn:max-w-[6rem]"
                  : added
                    ? "ml-1.5 max-w-[5rem]"
                    : "group-hover/btn:ml-1.5 group-hover/btn:max-w-[5rem]",
              ].join(" ")}
            >
              {!purchasable ? "Details" : added ? "Added" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
