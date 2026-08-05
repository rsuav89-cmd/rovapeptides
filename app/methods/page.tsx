import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AnalyticalAuthority } from "@/components/AnalyticalAuthority";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { faqCategories } from "@/lib/faq";
import { sampleBatches } from "@/lib/coa";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

const METHOD_CATEGORY = "Analytical Methods";

export const metadata: Metadata = {
  title: "Analytical Methods — How Every Batch Is Tested — RovaPeptides",
  description:
    "How RovaPeptides verifies every lot: RP-HPLC purity at 220 nm, LC-MS identity confirmation, endotoxin, peptide content, water and acetate analysis, and a publicly retrievable Certificate of Analysis per batch.",
  alternates: { canonical: "/methods" },
  openGraph: {
    title: "Analytical Methods — RovaPeptides",
    description:
      "RP-HPLC purity, LC-MS identity, and five further analytes on every lot, with a batch-specific Certificate of Analysis.",
    url: `${site.siteUrl}/methods`,
    type: "article",
  },
};

export default function MethodsPage() {
  const methods = faqCategories.find((c) => c.title === METHOD_CATEGORY);
  const crumbs = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "Analytical Methods", url: `${site.siteUrl}/methods` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      {methods && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(methods.items)) }}
        />
      )}
      <NoticeBar />
      <Header />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Analytical Methods" }]} />

      <main id="main-content" tabIndex={-1}>
        <section>
          <div className="container-page section-tight">
            <p className="kicker">Analytical Methods</p>
            <h1 className="mt-4 max-w-3xl text-display-lg text-ink">
              How every batch is tested before it is listed.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              Purity and identity are separate measurements answering separate questions. We run
              both on every lot, publish the measured result rather than an average, and put the
              certificate behind a batch number anyone can look up.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/coas" className="btn-signal">
                <FileCheck2 className="h-4 w-4" strokeWidth={2} />
                Search a batch certificate
              </Link>
              <Link href="/shop" className="btn-ghost">
                Browse the catalog
              </Link>
            </div>
          </div>
        </section>

        <AnalyticalAuthority batch={sampleBatches[0]} />

        {methods && (
          <section>
            <div className="container-page section-tight">
              <h2 className="text-display-md text-ink">Method questions, answered</h2>
              <div className="mt-8 max-w-3xl">
                <FaqAccordion categories={[methods]} />
              </div>
              <p className="mt-10 font-mono text-label-sm uppercase text-muted">{site.compliance}</p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
