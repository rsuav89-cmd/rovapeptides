import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { CatalogLanding } from "@/components/catalog/CatalogLanding";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/shop" },
  title: "Research Peptide Catalog — Filter by Category — RovaPeptides",
  description:
    "Filter the full RovaPeptides research catalog by category, product family, strength and format. Every lot ships with a batch-specific Certificate of Analysis. For research use only.",
};

export default function ShopPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "Shop", url: `${site.siteUrl}/shop` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <NoticeBar />
      <Header />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <main id="main-content" tabIndex={-1}>
        <CatalogLanding />
      </main>
      <Footer />
    </>
  );
}
