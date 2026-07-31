"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { money, showNewBadge } from "@/lib/products";
import { getCollection } from "@/lib/collections";
import type { CatalogProductFamily } from "@/lib/catalog";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";

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
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper-2 transition-[transform,border-color,box-shadow] duration-280 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
      style={
        {
          "--c-accent": collection.tokens.accent,
          "--c-glow": collection.tokens.glow,
          "--c-border": collection.tokens.border,
        } as React.CSSProperties
      }
    >
      {/* whole-card navigation as a single overlay link (no nested interactives) */}
      <Link
        href={`/shop/${family.slug}`}
        aria-label={`${family.name} — ${family.strengthSummary}`}
        className="absolute inset-0 z-0 rounded-xl2"
      />

      {/* image stage — contained vial, category glow, no crop */}
      <div className="image-stage relative aspect-[4/5] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent" />
        <ProductImage
          product={family.variants[0].product}
          className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-280 ease-out-expo will-change-transform group-hover:scale-[1.04]"
        />
        {isNew && (
          <span className="absolute left-3 top-3 rounded-full border collection-border bg-paper/70 px-2.5 py-1 font-sans text-[0.56rem] font-bold uppercase tracking-widest collection-accent backdrop-blur">
            New
          </span>
        )}
        {family.isBlend && (
          <span className="absolute right-3 top-3 rounded-full border border-line-strong bg-paper/70 px-2.5 py-1 font-sans text-[0.56rem] font-semibold uppercase tracking-widest text-ink-2 backdrop-blur">
            Blend
          </span>
        )}
      </div>

      {/* body — non-interactive so clicks fall through to the overlay link */}
      <div className="pointer-events-none relative z-[1] flex flex-1 flex-col p-5">
        <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.18em] collection-accent">
          {collection.shortName}
        </p>
        <h3 className="mt-1.5 font-display text-[1.28rem] font-semibold uppercase leading-tight text-ink">
          {family.name}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {family.variants.length > 1
            ? family.strengthSummary
            : `${family.subtitle}`}
        </p>
        {family.variants.length > 1 && (
          <p className="mt-0.5 text-xs text-muted/80">{family.variants.length} strengths</p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="font-sans text-[0.58rem] uppercase tracking-widest text-muted">
              {family.hasPricing ? "Price" : "Status"}
            </p>
            <p className="font-sans text-lg font-semibold text-ink">{priceText}</p>
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
            <span className="inline-flex items-center gap-1 text-sm font-semibold collection-accent transition-transform duration-160 ease-out-expo group-hover:translate-x-0.5">
              {family.variants.length > 1 ? "Select strength" : "View"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
