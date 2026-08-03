"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { money, showNewBadge } from "@/lib/products";
import { getCollection } from "@/lib/collections";
import type { CatalogProductFamily } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";

// Light family card for the warm/neutral catalog surface. Commerce behavior
// (overlay navigation, single-variant quick-add, pricing gates) is unchanged.
export function FamilyCard({ family }: { family: CatalogProductFamily }) {
  const { add, open } = useCart();
  const [added, setAdded] = useState(false);
  const collection = getCollection(family.primaryCollectionId);

  const single = family.variants.length === 1 ? family.variants[0] : null;
  const singleBuyable = single?.available ?? false;
  const isNew = family.variants.some((v) => showNewBadge(v.product));

  const priceText = family.hasPricing
    ? family.minPrice === family.maxPrice
      ? money(family.minPrice as number)
      : `From ${money(family.minPrice as number)}`
    : "Pricing coming soon";

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!single || !singleBuyable) return;
    add(single.product, 1);
    open();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  }

  return (
    <article className="card-light group">
      {/* whole-card navigation as a single overlay link (no nested interactives) */}
      <Link
        href={`/shop/${family.slug}`}
        aria-label={`${family.name} — ${family.strengthSummary}`}
        className="absolute inset-0 z-0 rounded-xl2"
      />

      {/* image stage — warm light, contained vial, no crop */}
      <div className="image-stage-light relative aspect-[4/5] overflow-hidden">
        <ProductImage
          product={family.variants[0].product}
          className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-280 ease-out-expo will-change-transform group-hover:scale-[1.04]"
        />
        {isNew && (
          <span className="badge-light absolute left-3 top-3 !text-ink-dark backdrop-blur">
            New
          </span>
        )}
        {family.isBlend && (
          <span className="badge-light absolute right-3 top-3 !font-semibold !text-ink-dark-2 backdrop-blur">
            Blend
          </span>
        )}
      </div>

      {/* body — non-interactive so clicks fall through to the overlay link */}
      <div className="pointer-events-none relative z-[1] flex flex-1 flex-col p-5">
        <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-copper-muted">
          {collection.shortName}
        </p>
        <h3 className="mt-1.5 font-display text-[1.28rem] font-semibold uppercase leading-tight text-ink-dark">
          {family.name}
        </h3>
        <p className="mt-1 text-sm text-muted-dark">
          {family.variants.length > 1
            ? family.strengthSummary
            : `${family.subtitle}`}
        </p>
        {family.variants.length > 1 && (
          <p className="mt-0.5 text-xs text-muted-dark/80">{family.variants.length} strengths</p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="font-sans text-[0.58rem] uppercase tracking-widest text-muted-dark">
              {family.hasPricing ? "Price" : "Status"}
            </p>
            <p className="font-sans text-lg font-semibold text-ink-dark">{priceText}</p>
          </div>

          {/* raised action: real button only for a single purchasable variant */}
          {single && singleBuyable ? (
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`Add ${family.name} to cart`}
              className="pointer-events-auto relative z-10 inline-flex h-11 items-center gap-1.5 rounded-full bg-brand-cta px-4 text-sm font-semibold text-white transition-[transform,box-shadow] duration-160 ease-out-expo hover:shadow-copper active:scale-95"
            >
              {added ? <Check className="h-4 w-4" strokeWidth={2.4} /> : <Plus className="h-4 w-4" strokeWidth={2.4} />}
              {added ? "Added" : "Add"}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-copper-muted transition-transform duration-160 ease-out-expo group-hover:translate-x-0.5">
              {family.variants.length > 1 ? "Select strength" : "View"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
