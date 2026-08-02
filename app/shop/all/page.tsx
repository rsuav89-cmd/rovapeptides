import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Catalog } from "@/components/catalog/Catalog";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/jsonld";
import { families } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/shop/all" },
  title: "All Products — RovaPeptides",
  description:
    "The complete RovaPeptides research catalog. Browse every research product and view batch-specific Certificates of Analysis.",
};

export default function ShopAllPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "Shop", url: `${site.siteUrl}/shop` },
    { name: "All Products", url: `${site.siteUrl}/shop/all` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageJsonLd({
              url: `${site.siteUrl}/shop/all`,
              name: "All Research Peptides",
              description:
                "Every research compound in the RovaPeptides catalog, each batch third-party verified by RP-HPLC and LC-MS with a publicly retrievable Certificate of Analysis.",
              families: families.map((f) => ({ name: f.name, slug: f.slug })),
            })
          ),
        }}
      />
      <NoticeBar />
      <Header />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "All Products" }]}
      />
      <main id="main-content">
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
