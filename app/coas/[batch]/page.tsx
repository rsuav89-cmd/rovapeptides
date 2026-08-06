import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Download, FileCheck2 } from "lucide-react";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { activeCoas, getCOAByBatch, isActiveCoa } from "@/lib/coa";
import { products } from "@/lib/products";
import { familySlugForSku } from "@/lib/catalog";
import { breadcrumbJsonLd, coaPageJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

// One statically generated page per certificate ON FILE. A pending SKU gets no
// page at all — a URL that resolves is itself a claim that a document exists.
export function generateStaticParams() {
  return activeCoas().map((coa) => ({ batch: coa.batchNumber }));
}
export const dynamicParams = true;

function productPathFor(slug: string): string {
  const sku = products.find((p) => p.id === slug);
  const fam = sku ? familySlugForSku(sku.id) : undefined;
  return fam ? `/shop/${fam}` : "/shop/all";
}

export function generateMetadata({ params }: { params: { batch: string } }): Metadata {
  const coa = getCOAByBatch(decodeURIComponent(params.batch));
  if (!isActiveCoa(coa)) return { title: "Certificate Not Found — RovaPeptides" };
  const url = `${site.siteUrl}/coas/${coa.batchNumber}`;
  const purity = coa.purityPercentage !== null ? `${coa.purityPercentage}% purity, ` : "";
  const description = `Third-party Certificate of Analysis for ${coa.productName} batch ${coa.batchNumber}: ${purity}tested ${coa.testDate} by ${coa.testingLab}.`;
  return {
    title: `COA — ${coa.productName} Batch ${coa.batchNumber} — RovaPeptides`,
    description,
    alternates: { canonical: `/coas/${coa.batchNumber}` },
    openGraph: {
      title: `Certificate of Analysis — ${coa.productName} (${coa.batchNumber})`,
      description,
      url,
      type: "article",
    },
  };
}

export default function CoaBatchPage({ params }: { params: { batch: string } }) {
  const coa = getCOAByBatch(decodeURIComponent(params.batch));
  if (!isActiveCoa(coa)) notFound();

  const batchUrl = `${site.siteUrl}/coas/${coa.batchNumber}`;
  const productPath = productPathFor(coa.productSlug);
  const ld = coaPageJsonLd(coa, batchUrl, `${site.siteUrl}${productPath}`);
  const crumbs = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "COA Lookup", url: `${site.siteUrl}/coas` },
    { name: `Batch ${coa.batchNumber}`, url: batchUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <NoticeBar />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "COA Lookup", href: "/coas" },
          { label: `Batch ${coa.batchNumber}` },
        ]}
      />

      <main id="main-content" tabIndex={-1} className="container-page section-tight">
        <span className="kicker">Certificate of Analysis</span>

        <h1 className="mt-3 text-display-md text-ink">
          {coa.productName} — Batch {coa.batchNumber}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">
          Tested on {coa.testDate} by {coa.testingLab}. Every specification below was met.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="data-tag inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
            All specifications met
          </span>
          {coa.purityPercentage !== null && (
            <span className="data-tag">{coa.purityPercentage}% purity</span>
          )}
          <span className="data-tag">Independent third-party lab</span>
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold uppercase text-ink">
          Analytical results
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-paper-2/40">
          <table className="w-full min-w-[440px] border-collapse text-sm">
            <caption className="sr-only">
              Analytical results for {coa.productName} batch {coa.batchNumber}
            </caption>
            <thead>
              <tr className="border-b border-line text-left">
                {["Analyte", "Specification", "Result", "Verdict"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 font-sans text-label-sm uppercase text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coa.labResults.map((row) => (
                <tr key={row.analyte} className="border-b border-line/60 last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-ink">
                    {row.analyte}
                  </th>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{row.specification}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink">{row.result}</td>
                  <td className="px-4 py-3 font-mono text-xs text-assay">
                    {row.passed ? "PASS" : "FAIL"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted sm:hidden">Swipe the table to see all columns.</p>

        <dl className="mt-6 grid gap-3 rounded-xl border border-line bg-paper-2/40 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Testing laboratory</dt>
            <dd className="mt-0.5 text-ink-2">{coa.testingLab}</dd>
          </div>
          <div>
            <dt className="text-muted">Test date</dt>
            <dd className="mt-0.5 text-ink-2">{coa.testDate}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={productPath} className="btn-signal">
            <FileCheck2 className="h-4 w-4" strokeWidth={2} />
            View {coa.productName}
          </Link>
          {coa.pdfUrl && (
            <a href={coa.pdfUrl} className="btn-ghost" download>
              <Download className="h-4 w-4" strokeWidth={2} />
              Download the signed PDF
            </a>
          )}
          <Link href="/coas" className="btn-ghost">
            Look up another batch
          </Link>
        </div>

        <p className="mt-8 font-mono text-label-sm uppercase text-muted">{site.compliance}</p>
      </main>
      <Footer />
    </>
  );
}
