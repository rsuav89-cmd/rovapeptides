import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionView } from "@/components/catalog/CollectionView";
import { collections, getCollectionBySlug } from "@/lib/collections";
import { familiesInCollection, primaryFamilyCount } from "@/lib/catalog";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCollectionBySlug(params.slug);
  if (!c) return { title: "Collection Not Found — RovaPeptides" };
  const url = `${site.siteUrl}/shop/collections/${c.slug}`;
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: c.seoTitle, description: c.seoDescription, url, type: "website" },
  };
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const c = getCollectionBySlug(params.slug);
  if (!c) notFound();

  const families = familiesInCollection(c.id);
  const count = primaryFamilyCount(c.id);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "Shop", url: `${site.siteUrl}/shop` },
    { name: c.name, url: `${site.siteUrl}/shop/collections/${c.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageJsonLd({
              url: `${site.siteUrl}/shop/collections/${c.slug}`,
              name: c.name,
              description: c.seoDescription,
              families: families.map((f) => ({ name: f.name, slug: f.slug })),
            })
          ),
        }}
      />
      <NoticeBar />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: c.name },
        ]}
      />
      <main id="main-content">
        <section
          className="image-stage relative overflow-hidden border-b border-line/70"
          style={{ ["--c-glow" as string]: c.tokens.glow, ["--c-accent" as string]: c.tokens.accent } as React.CSSProperties}
        >
          <div className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 lg:py-20">
            <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] collection-accent">
              {c.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-display-lg text-ink">{c.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{c.longDescription}</p>
            <p className="mt-5 font-sans text-xs uppercase tracking-widest text-muted">
              {count} research {count === 1 ? "product" : "products"}
            </p>
          </div>
        </section>
        <CollectionView families={families} collectionName={c.shortName} />
      </main>
      <Footer />
    </>
  );
}
