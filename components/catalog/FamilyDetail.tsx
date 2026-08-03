"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileCheck2, Minus, Plus } from "lucide-react";
import { money, priceLabel, getPurchaseEligibility } from "@/lib/products";
import {
  DEFAULT_FORM,
  DEFAULT_HANDLING,
  DEFAULT_STORAGE,
  TESTING_METHOD,
  getProductDetail,
} from "@/lib/product-details";
import type { CatalogProductFamily } from "@/lib/catalog";
import { familiesInCollection } from "@/lib/catalog";
import { getCollection } from "@/lib/collections";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";
import { FamilyCard } from "@/components/catalog/FamilyCard";
import { site } from "@/lib/site";
import { buildProductFaqs } from "@/lib/product-faq";

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
  useEffect(() => {
    // Reserves space at the document end so the fixed bar never covers content.
    document.body.classList.add("has-buybar");
    return () => document.body.classList.remove("has-buybar");
  }, []);
  const collection = getCollection(family.primaryCollectionId);
  const detail = getProductDetail(family.id);
  const faqs = buildProductFaqs(family);


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
  // Unit economics, shown only when the strength is a clean mg figure. Purely
  // factual — it removes the arithmetic a buyer would otherwise do by hand.
  const perMg = (() => {
    const m = /^([\d.]+)\s*mg$/i.exec(selected.displayStrength.trim());
    const mg = m ? Number(m[1]) : NaN;
    if (!Number.isFinite(mg) || mg <= 0 || !eligible) return null;
    return `$${(selected.product.price / mg).toFixed(2)}`;
  })();

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
              <h1 className="mt-2 whitespace-normal break-words font-display text-2xl font-semibold uppercase leading-tight text-ink [overflow-wrap:anywhere] sm:text-3xl">
                {family.name}
              </h1>
              <p className="mt-2 text-ink-2">{family.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="data-tag">{selected.displayStrength}</span>
                <span className="data-tag">{selected.product.purity} purity</span>
                <span className="data-tag">HPLC verified</span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-ink-2">{family.description}</p>
              {detail && (
                <>
                  {/* Query-shaped heading: "what is <compound>" is the dominant
                      search shape in this niche and is what LLM retrieval extracts on. */}
                  <h2 className="mt-6 font-sans text-[0.62rem] uppercase tracking-widest text-muted">
                    What is {family.name}?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{detail.overview}</p>
                </>
              )}

              {detail && detail.researchAreas.length > 0 && (
                <div className="mt-5">
                  <p className="font-sans text-[0.62rem] uppercase tracking-widest text-muted">
                    Research context
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {detail.researchAreas.map((area) => (
                      <li key={area} className="data-tag">
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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

              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-sans text-2xl font-semibold text-ink">{priceLabel(selected.product)}</p>
                {perMg && (
                  <p className="font-mono text-xs text-muted">{perMg} per mg</p>
                )}
              </div>

              {/* qty + add */}
              <div ref={buyRef} className="mt-4 flex flex-wrap items-center gap-3">
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
                  <button onClick={addToCart} className="btn-signal basis-full sm:basis-0 sm:flex-1">
                    Add {qty > 1 ? `${qty} ` : ""}· {money(selected.product.price * qty)}
                  </button>
                ) : (
                  <button type="button" disabled aria-disabled="true" className="btn-signal basis-full cursor-not-allowed opacity-60 sm:basis-0 sm:flex-1">
                    Pricing coming soon
                  </button>
                )}
              </div>

              {eligible && (
                <p className="mt-2.5 text-xs text-muted">
                  {site.freeShippingThreshold - selected.product.price * qty > 0
                    ? `Free discreet shipping over ${money(site.freeShippingThreshold)} — ${money(
                        site.freeShippingThreshold - selected.product.price * qty
                      )} away.`
                    : "Free discreet shipping included."}
                </p>
              )}
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                COA match guarantee — if the vial you receive does not match the{" "}
                <Link
                  href={`/coas/${selected.product.batch}`}
                  className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-ink"
                >
                  certificate published for its batch
                </Link>
                , we replace or refund it.
              </p>

              {/* specification table */}
              <div className="mt-6 overflow-hidden rounded-xl border border-line bg-paper-2/40">
                <p className="border-b border-line px-4 py-2.5 font-sans text-[0.62rem] uppercase tracking-widest text-muted">
                  Specifications
                </p>
                <dl className="divide-y divide-line">
                  <SpecRow label="Format" value={detail?.form ?? DEFAULT_FORM} />
                  <SpecRow label="Strength" value={selected.displayStrength} />
                  <SpecRow label="Purity" value={`${selected.product.purity} minimum, third-party verified`} />
                  <SpecRow label="Testing" value={TESTING_METHOD} />
                  <SpecRow label="Batch" value={selected.product.batch} />
                  <SpecRow label="Storage" value={DEFAULT_STORAGE} />
                  <SpecRow label="Handling" value={detail?.handling ?? DEFAULT_HANDLING} />
                  <SpecRow label="Shipping" value="Discreet, unmarked packaging. Ships within 24 hours." />
                  <SpecRow
                    label="Intended use"
                    value="Laboratory and in-vitro research use only. Not for human or veterinary consumption."
                  />
                </dl>
              </div>

              <Link
                href={`/coas/${selected.product.batch}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-signal-ink transition-colors hover:text-brand"
              >
                <FileCheck2 className="h-4 w-4" strokeWidth={2} />
                View Certificate of Analysis — {selected.product.batch}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visible Q&A — the same source as the FAQPage JSON-LD on this route, so
          the structured data never describes content a visitor cannot see.
          Native <details> keeps it keyboard- and screen-reader-correct with no JS. */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[880px] px-5 py-12 sm:px-8">
          <h2 className="text-display-md text-ink">Common questions</h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:hidden">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-lg text-muted transition-transform duration-220 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{faq.answer}</p>
              </details>
            ))}
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
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 backdrop-blur",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-220 ease-out-expo lg:hidden",
          showBuyBar ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        aria-hidden={!showBuyBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="break-words font-sans text-sm font-medium leading-snug text-ink">
              {family.name}
            </p>
            <p className="break-words text-xs leading-snug text-muted">
              {selected.displayStrength} · {priceLabel(selected.product)}
              {eligible &&
                (site.freeShippingThreshold - selected.product.price * qty > 0
                  ? ` · ${money(
                      site.freeShippingThreshold - selected.product.price * qty
                    )} to free shipping`
                  : " · Free shipping")}
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

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-4 py-3 text-sm sm:grid-cols-[7.5rem_1fr] sm:gap-3 sm:py-2.5">
      <dt className="font-sans text-[0.7rem] uppercase tracking-wider text-muted">{label}</dt>
      <dd className="leading-relaxed text-ink-2">{value}</dd>
    </div>
  );
}
