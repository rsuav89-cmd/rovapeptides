import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FamilyDetail } from "@/components/catalog/FamilyDetail";
import { products } from "@/lib/products";
import { getFamily, familySlugForSku, families } from "@/lib/catalog";
import { getCollection } from "@/lib/collections";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/jsonld";
import { DEFAULT_FORM, DEFAULT_STORAGE, TESTING_METHOD, getProductDetail } from "@/lib/product-details";
import { site } from "@/lib/site";

// Canonical params are FAMILY slugs; legacy SKU slugs are handled at runtime.
export function generateStaticParams() {
  return families.map((f) => ({ slug: f.slug }));
}
export const dynamicParams = true;

const strengthKey = (s: string) => s.replace(/\s+/g, "").toLowerCase();

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const fam =
    getFamily(params.slug) ??
    (() => {
      const sku = products.find((p) => p.id === params.slug);
      const fs = sku ? familySlugForSku(sku.id) : undefined;
      return fs ? getFamily(fs) : undefined;
    })();
  if (!fam) return { title: "Product Not Found — RovaPeptides" };
  const url = `${site.siteUrl}/shop/${fam.slug}`;
  return {
    title: `${fam.name} — RovaPeptides`,
    description: fam.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${fam.name} — RovaPeptides`,
      description: fam.description,
      url,
      type: "website",
      images: [{ url: fam.representativeImage, alt: fam.name }],
    },
  };
}

export default function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { strength?: string };
}) {
  const fam = getFamily(params.slug);

  // Legacy per-SKU URL → 301 to canonical family page with the variant preselected.
  if (!fam) {
    const sku = products.find((p) => p.id === params.slug);
    if (sku) {
      const fs = familySlugForSku(sku.id);
      if (fs) permanentRedirect(`/shop/${fs}?strength=${strengthKey(sku.mass)}`);
    }
    notFound();
  }

  const collection = getCollection(fam.primaryCollectionId);
  const productUrl = `${site.siteUrl}/shop/${fam.slug}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "Shop", url: `${site.siteUrl}/shop` },
    { name: collection.name, url: `${site.siteUrl}/shop/collections/${collection.slug}` },
    { name: fam.name, url: productUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(fam.variants[0].product, {
              url: `${site.siteUrl}/shop/${fam.slug}`,
              description: getProductDetail(fam.id)?.overview ?? fam.description,
              specs: [
                { name: "Format", value: getProductDetail(fam.id)?.form ?? DEFAULT_FORM },
                { name: "Purity", value: `${fam.variants[0].product.purity} minimum, third-party verified` },
                { name: "Testing", value: TESTING_METHOD },
                { name: "Storage", value: DEFAULT_STORAGE },
                {
                  name: "Intended use",
                  value: "Laboratory and in-vitro research use only. Not for human or veterinary consumption.",
                },
              ],
            })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <NoticeBar />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: collection.shortName, href: `/shop/collections/${collection.slug}` },
          { label: fam.name },
        ]}
      />
      <main id="main-content">
        <FamilyDetail family={fam} initialStrength={searchParams?.strength} />
      </main>
      <Footer />
    </>
  );
}
