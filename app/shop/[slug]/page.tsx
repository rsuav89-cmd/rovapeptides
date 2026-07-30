import { notFound } from "next/navigation";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.id === params.slug);
  if (!product) {
    return { title: "Product Not Found — RovaPeptides" };
  }
  return {
    title: `${product.name} — RovaPeptides`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.id === params.slug);
  if (!product) {
    notFound();
  }

return (
  <>
  <NoticeBar />
  <Header />
  <main>
    <ProductDetail product={product} />
  </main>
    <Footer />
  </>
  );
}
