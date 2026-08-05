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
import { breadcrumbJsonLd, faqPageJsonLd, productGroupJsonLd, productJsonLd } from "@/lib/jsonld";
import { buildProductFaqs } from "@/lib/product-faq";
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

  const schemaOpts = {
    url: productUrl,
    description: getProductDetail(fam.id)?.overview ?? fam.description,
    specs: [
      { name: "Format", value: getProductDetail(fam.id)?.form ?? DEFAULT_FORM },
      { name: "Purity", value: `${fam.variants[0].product.purity} measured · ≥ 98.0% release specification` },
      { name: "Testing", value: TESTING_METHOD },
      { name: "Storage", value: DEFAULT_STORAGE },
      {
        name: "Intended use",
        value: "Laboratory and in-vitro research use only. Not for human or veterinary consumption.",
      },
    ],
  };

  // One Product node cannot describe several strengths: multi-variant families
  // emit a ProductGroup so the price range and every SKU are advertised.
  const productLd =
    fam.variants.length > 1
      ? productGroupJsonLd(fam, schemaOpts)
      : {
          ...productJsonLd(fam.variants[0].product, schemaOpts),
          hasCertification: {
            "@id": `${site.siteUrl}/coas/${fam.variants[0].product.batch}#coa`,
          },
        };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(buildProductFaqs(fam))),
        }}
      />
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
      <main id="main-content" tabIndex={-1}>
        <FamilyDetail family={fam} initialStrength={searchParams?.strength} />
      </main>
      <Footer />
    </>
  );
}
