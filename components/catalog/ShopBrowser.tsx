"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { collectionsInOrder, getCollectionBySlug } from "@/lib/collections";
import { families, familiesInCollection } from "@/lib/catalog";
import { CollectionFilterBar, type FilterOption } from "@/components/catalog/CollectionFilterBar";
import { FamilyGrid } from "@/components/catalog/FamilyGrid";

const ALL = "all";

/**
 * /shop is now a browsable catalog rather than an interstitial: choosing a
 * collection filters the grid in place instead of costing a page load. The
 * per-collection routes still exist for deep links, sitemap and SEO — the
 * active filter links straight to its own page.
 */
export function ShopBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the single source of truth. Reading it on every render (rather
  // than seeding state once on mount) is what makes a header link like
  // /shop?collection=weight-metabolic filter the grid when the shopper is
  // already on /shop — the bug a mount-only effect cannot see.
  const requested = searchParams.get("collection");
  const active = requested && getCollectionBySlug(requested) ? requested : ALL;

  function select(id: string) {
    router.replace(id === ALL ? pathname : `${pathname}?collection=${id}`, {
      scroll: false,
    });
  }

  const options: FilterOption[] = useMemo(
    () => [
      { id: ALL, label: "All", count: families.length },
      ...collectionsInOrder.map((c) => ({
        id: c.slug,
        label: c.shortName,
        count: familiesInCollection(c.id).length,
      })),
    ],
    []
  );

  const collection = active === ALL ? undefined : getCollectionBySlug(active);
  const shown = collection ? familiesInCollection(collection.id) : families;

  return (
    <section id="browse" className="surface-bone on-light grain scroll-mt-24">
      <div className="container-page section">
        <div className="reveal max-w-2xl">
          <p className="kicker-dark">Filter by category</p>
          <h2 className="mt-3 text-display-md text-ink-dark">The full research catalog</h2>
          <p className="mt-3 text-ink-dark-2">
            Choose a category to narrow the grid. Nothing reloads, and every product keeps its
            lot-specific Certificate of Analysis.
          </p>
        </div>

        <div
          className="mt-8 border-b"
          style={{ borderColor: "var(--line-warm-strong)" }}
        >
          <CollectionFilterBar options={options} active={active} onChange={select} />
        </div>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
          <p role="status" aria-live="polite" className="text-sm text-muted-dark">
            {shown.length} {shown.length === 1 ? "product" : "products"}
            {collection ? ` in ${collection.shortName}` : " across every category"}
          </p>
          {collection && (
            <Link
              href={`/shop/collections/${collection.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-copper-muted transition-colors hover:text-copper-deep"
            >
              Open the {collection.shortName} collection
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          )}
        </div>

        {collection && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-dark-2">
            {collection.shortDescription}
          </p>
        )}

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <FamilyGrid families={shown} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
