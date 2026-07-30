import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Catalog } from "@/components/catalog/Catalog";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata = {
  title: "Shop All Peptides — RovaPeptides",
  description:
    "Browse the full RovaPeptides catalog of research-grade peptides, filter by category, and view batch-specific Certificates of Analysis.",
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
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
      />
      <main>
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
