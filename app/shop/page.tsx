import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Catalog } from "@/components/catalog/Catalog";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Shop All Peptides — RovaPeptides",
  description:
    "Browse the full RovaPeptides catalog of research-grade peptides, filter by category, and view batch-specific Certificates of Analysis.",
};

export default function ShopPage() {
  return (
    <>
      <NoticeBar />
      <Header />
      <main>
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
