import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { site } from "@/lib/site";
import { collectionsInOrder } from "@/lib/collections";
import { primaryFamilyCount, featuredFamilies, families } from "@/lib/catalog";
import { CollectionCard } from "@/components/catalog/CollectionCard";
import { FamilyGrid } from "@/components/catalog/FamilyGrid";

export function CatalogLanding() {
  const totalFamilies = families.length;
  const totalSkus = families.reduce((a, f) => a + f.variants.length, 0);
  const featured = featuredFamilies(8);

  return (
    <>
      {/* HERO — strategic dark brand moment */}
      <section className="relative overflow-hidden border-b border-line/70">
        <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-24">
          <p className="kicker inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
            ROVA Research Catalog
          </p>
          <h1 className="mt-5 max-w-4xl text-display-lg text-ink">
            Explore by Research Collection
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
            Browse the catalog by research area, product family, strength, and format —
            {" "}
            {totalFamilies} research products across {totalSkus} available strengths and formats.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#collections" className="btn-signal">
              Browse Collections
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
            <Link href="/shop/all" className="btn-ghost">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* COLLECTION MOSAIC — dark technical grid */}
      <section id="collections" className="scroll-mt-24 border-b border-line/70">
        <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-lg">
            <h2 className="text-display-md text-ink">Research Collections</h2>
            <p className="mt-3 text-ink-2">
              Eight curated research areas. Choose a collection to see its product families.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collectionsInOrder.map((c, i) => (
              <CollectionCard
                key={c.id}
                collection={c}
                familyCount={primaryFamilyCount(c.id)}
                className={`min-h-[200px] ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED FAMILIES — warm light product surface (light cards sit here) */}
      <section className="surface-warm on-light border-b" style={{ borderColor: "var(--line-warm-strong)" }}>
        <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker-dark">Featured</p>
              <h2 className="mt-3 text-display-md text-ink-dark">Selected research families</h2>
            </div>
            <Link
              href="/shop/all"
              className="inline-flex items-center gap-2 text-sm font-semibold text-copper-muted transition-colors hover:text-copper-deep"
            >
              View all products
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
          <div className="mt-10">
            <FamilyGrid families={featured} />
          </div>
        </div>
      </section>

      {/* RESEARCH POSITIONING — strategic dark close */}
      <section>
        <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex max-w-2xl flex-col gap-4">
            <FlaskConical className="h-6 w-6 text-signal-ink" strokeWidth={1.8} />
            <h2 className="text-display-md text-ink">Organized for research</h2>
            <p className="text-ink-2">
              Every item is a laboratory research material, grouped into research collections and
              product families with lot-specific Certificates of Analysis. Catalog copy is
              organizational only.
            </p>
            <p className="font-sans text-[0.62rem] uppercase tracking-widest text-muted">
              {site.compliance}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
