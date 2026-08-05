import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { site } from "@/lib/site";
import { families } from "@/lib/catalog";
import { ShopBrowser } from "@/components/catalog/ShopBrowser";

export function CatalogLanding() {
  const totalFamilies = families.length;
  const totalSkus = families.reduce((a, f) => a + f.variants.length, 0);

  return (
    <>
      {/* Hero — kept dark, but it now fades into the catalog instead of butting
          against a second dark block of collection cards. */}
      <section className="relative overflow-hidden">
        <div className="container-page section-tight">
          <p className="kicker">ROVA Research Catalog</p>
          <h1 className="mt-5 max-w-4xl text-display-lg text-ink">
            Every compound, one shelf.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2">
            {totalFamilies} research products across {totalSkus} strengths and formats — filter by
            category below, or open the full grid. Every lot ships with its own Certificate of
            Analysis.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#browse" className="btn-signal">
              Filter the catalog
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
            <Link href="/shop/all" className="btn-ghost">
              View All Products
            </Link>
          </div>
        </div>
        <div aria-hidden className="seam-to-warm" style={{ backgroundImage: "linear-gradient(to bottom, transparent, #E7E0D6)" }} />
      </section>

      {/* Category filter + live catalog grid (replaces the collection mosaic). */}
      <Suspense
        fallback={
          <div className="surface-bone on-light grain">
            <div className="container-page section" aria-hidden />
          </div>
        }
      >
        <ShopBrowser />
      </Suspense>

      {/* Research positioning — strategic dark close */}
      <section>
        <div className="container-page section-tight">
          <div className="flex max-w-2xl flex-col gap-4">
            <FlaskConical className="h-6 w-6 text-signal-ink" strokeWidth={1.8} />
            <h2 className="text-display-md text-ink">Organized for research</h2>
            <p className="text-ink-2">
              Every item is a laboratory research material, grouped into research collections and
              product families with lot-specific Certificates of Analysis. Catalog copy is
              organizational only.
            </p>
            <p className="font-mono text-label-sm uppercase text-muted">{site.compliance}</p>
          </div>
        </div>
      </section>
    </>
  );
}
