import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { products } from "@/lib/products";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = products.find((p) => p.id === params.slug);
  if (!product) {
    return { title: "Product Not Found — RovaPeptides" };
  }
  const url = `${site.siteUrl}/shop/${product.id}`;
  return {
    title: `${product.name} — RovaPeptides`,
    description: product.description,
    openGraph: {
      title: `${product.name} — RovaPeptides`,
      description: product.description,
      url,
      type: "website",
      images: [{ url: product.photo, alt: product.name }],
    },
    alternates: { canonical: url },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.id === params.slug);
  if (!product) {
    notFound();
  }

  const productUrl = `${site.siteUrl}/shop/${product.id}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "Shop", url: `${site.siteUrl}/shop` },
    { name: product.name, url: productUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <NoticeBar />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
