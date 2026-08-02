"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileCheck2, Minus, Plus, ShieldCheck, Snowflake, Truck, type LucideIcon } from "lucide-react";
import { money, priceLabel, getPurchaseEligibility, productStorageNote } from "@/lib/products";
import type { CatalogProductFamily } from "@/lib/catalog";
import { familiesInCollection } from "@/lib/catalog";
import { getCollection } from "@/lib/collections";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";
import { FamilyCard } from "@/components/catalog/FamilyCard";

const strengthKey = (s: string) => s.replace(/\s+/g, "").toLowerCase();

export function FamilyDetail({
  family,
  initialStrength,
}: {
  family: CatalogProductFamily;
  initialStrength?: string;
}) {
  const { add, open: openCart } = useCart();

  // Mobile sticky buy bar — shown only once the inline purchase CTA scrolls away.
  const buyRef = useRef<HTMLDivElement | null>(null);
  const [showBuyBar, setShowBuyBar] = useState(false);
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setShowBuyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "0px 0px -40% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const collection = getCollection(family.primaryCollectionId);

  const initialIdx = useMemo(() => {
    if (!initialStrength) return 0;
    const k = strengthKey(initialStrength);
    const i = family.variants.findIndex((v) => strengthKey(v.displayStrength) === k);
    return i >= 0 ? i : 0;
  }, [family, initialStrength]);

  const [idx, setIdx] = useState(initialIdx);
  const [qty, setQty] = useState(1);
  const selected = family.variants[idx];
  const eligible = getPurchaseEligibility(selected.product).purchasable;

  const related = familiesInCollection(family.primaryCollectionId)
    .filter((f) => f.id !== family.id)
    .slice(0, 4);

  function selectVariant(i: number) {
    setIdx(i);
    const v = family.variants[i];
    if (typeof window !== "undefined" && family.variants.length > 1) {
      const url = `/shop/${family.slug}?strength=${strengthKey(v.displayStrength)}`;
      window.history.replaceState(null, "", url);
    }
  }

  function addToCart() {
    if (!eligible) return;
    add(selected.product, qty);
    openCart();
  }

  return (
    <>
      {/* Editorial split: light product-image stage (left) + dark purchase panel (right) */}
      <section className="border-t border-line/70">
        <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            {/* image stage — warm light, contained vial, no crop */}
            <div
              className="image-stage-light relative aspect-square overflow-hidden rounded-xl2 border shadow-card-light"
              style={{ borderColor: "var(--line-warm-strong)" }}
            >
              <div className="absolute left-4 top-4 z-10 flex gap-1.5">
                <span className="data-tag-light">Batch · {selected.product.batch}</span>
                {family.isBlend && <span className="data-tag-light">Blend</span>}
              </div>
              <ProductImage
                product={selected.product}
                loading="eager"
                className="absolute inset-0 h-full w-full object-contain p-8"
              />
            </div>

            {/* purchase panel — dark editorial module (kept dark for authority + AA contrast) */}
            <div className="flex flex-col lg:sticky lg:top-28">
              <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-signal-ink">
                {collection.name}
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold uppercase leading-tight text-ink">
                {family.name}
              </h1>
              <p className="mt-2 text-ink-2">{family.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="data-tag">{selected.displayStrength}</span>
                <span className="data-tag">{selected.product.purity} purity</span>
                <span className="data-tag">HPLC verified</span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-ink-2">{family.description}</p>

              {/* variant selector */}
              {family.variants.length > 1 && (
                <div className="mt-6">
                  <p className="font-sans text-[0.62rem] uppercase tracking-widest text-muted">
                    Strength / format
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Select strength">
                    {family.variants.map((v, i) => (
                      <button
                        key={v.sourceId}
                        type="button"
                        aria-pressed={i === idx}
                        onClick={() => selectVariant(i)}
                        className={[
                          "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-160",
                          i === idx
                            ? "border-brand bg-brand-cta/15 text-ink"
                            : "border-line-strong text-ink-2 hover:text-ink",
                        ].join(" ")}
                      >
                        {v.displayStrength}
                        {!v.available && <span className="ml-1.5 text-[0.6rem] uppercase text-muted">soon</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <p className="font-sans text-2xl font-semibold text-ink">{priceLabel(selected.product)}</p>
              </div>

              {/* qty + add */}
              <div ref={buyRef} className="mt-4 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-line-strong">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-160 hover:bg-white/[0.04] active:scale-90"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                  <span className="w-8 text-center font-sans text-sm tabular-nums">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-160 hover:bg-white/[0.04] active:scale-90"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </div>
                {eligible ? (
                  <button onClick={addToCart} className="btn-signal flex-1">
                    Add {qty > 1 ? `${qty} ` : ""}· {money(selected.product.price * qty)}
                  </button>
                ) : (
                  <button type="button" disabled aria-disabled="true" className="btn-signal flex-1 cursor-not-allowed opacity-60">
                    Pricing coming soon
                  </button>
                )}
              </div>

              {/* specs */}
              <div className="mt-6 space-y-2 rounded-xl border border-line bg-paper-2/40 p-3">
                <Spec icon={ShieldCheck} label="Purity" value={`${selected.product.purity} (third-party COA)`} />
                <Spec icon={Snowflake} label="Storage" value={productStorageNote} />
                <Spec icon={Truck} label="Shipping" value="Discreet · ships within 24h" />
              </div>

              <Link
                href="/coas"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-signal-ink transition-colors hover:text-brand"
              >
                <FileCheck2 className="h-4 w-4" strokeWidth={2} />
                View Certificate of Analysis — {selected.product.batch}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="surface-warm on-light border-t" style={{ borderColor: "var(--line-warm-strong)" }}>
          <div className="mx-auto max-w-[1360px] px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="kicker-dark">Related Research Products</p>
                <h2 className="mt-3 text-display-md text-ink-dark">More in {collection.shortName}</h2>
              </div>
              <Link
                href={`/shop/collections/${collection.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-copper-muted transition-colors hover:text-copper-deep"
              >
                View collection
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((f) => (
                <FamilyCard key={f.id} family={f} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* mobile sticky buy bar — keeps the primary CTA reachable on small screens */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pt-3 backdrop-blur",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-220 ease-out-expo lg:hidden",
          showBuyBar ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        aria-hidden={!showBuyBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm font-medium text-ink">{family.name}</p>
            <p className="text-xs text-muted">
              {selected.displayStrength} · {priceLabel(selected.product)}
            </p>
          </div>
          {eligible ? (
            <button
              onClick={addToCart}
              tabIndex={showBuyBar ? 0 : -1}
              className="btn-signal shrink-0"
            >
              Add · {money(selected.product.price * qty)}
            </button>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              className="btn-signal shrink-0 cursor-not-allowed opacity-60"
            >
              Coming soon
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Spec({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" strokeWidth={1.9} />
      <div className="text-sm">
        <span className="font-medium text-ink">{label}:</span> <span className="text-ink-2">{value}</span>
      </div>
    </div>
  );
}
