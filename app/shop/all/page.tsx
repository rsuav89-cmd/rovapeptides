import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Catalog } from "@/components/catalog/Catalog";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export const metadata = {
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
      <NoticeBar />
      <Header />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "All Products" }]}
      />
      <main>
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
