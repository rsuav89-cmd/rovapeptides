import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { CatalogLanding } from "@/components/catalog/CatalogLanding";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata = {
  title: "Research Catalog — Explore by Collection — RovaPeptides",
  description:
    "Browse the RovaPeptides research catalog by collection, product family, strength, and format. For research use only.",
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
      <main id="main-content">
        <CatalogLanding />
      </main>
      <Footer />
    </>
  );
}
