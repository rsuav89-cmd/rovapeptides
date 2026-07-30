import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { faqCategories } from "@/lib/faq";
import { faqPageJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "FAQ — RovaPeptides",
  description:
    "Answers to common questions about product quality, storage & reconstitution, ordering & payments, and shipping & packaging for RovaPeptides research compounds.",
};

export default function FaqPage() {
  const allFaqs = faqCategories.flatMap((c) => c.items);
  const faqLd = faqPageJsonLd(allFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <NoticeBar />
      <Header />
      <main className="mx-auto max-w-[880px] px-5 py-16 sm:px-8">
        <span className="kicker inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
          Support
        </span>
        <h1 className="mt-3 text-display-lg text-ink">Frequently Asked Questions</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
          Everything researchers ask us most about product quality, storage, ordering, and shipping.
        </p>

        <div className="mt-12">
          <FaqAccordion categories={faqCategories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
