import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, FileCheck2 } from "lucide-react";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCoa } from "@/lib/coa";
import { products } from "@/lib/products";
import { familySlugForSku } from "@/lib/catalog";
import { breadcrumbJsonLd, coaPageJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

// One statically generated page per batch. The analyte table is server-rendered
// HTML — the client-side CoaViewer on /coas stays as the fast interactive lookup,
// but the underlying data is now crawlable and citable.
export function generateStaticParams() {
  return products.map((p) => ({ batch: p.batch }));
}
export const dynamicParams = true;

function productUrlFor(batch: string): string {
  const sku = products.find((p) => p.batch.toUpperCase() === batch.toUpperCase());
  const fam = sku ? familySlugForSku(sku.id) : undefined;
  return fam ? `/shop/${fam}` : "/shop/all";
}

export function generateMetadata({ params }: { params: { batch: string } }): Metadata {
  const coa = getCoa(decodeURIComponent(params.batch));
  if (!coa) return { title: "Batch Not Found — RovaPeptides" };
  const url = `${site.siteUrl}/coas/${coa.batch}`;
  const description = `Third-party Certificate of Analysis for ${coa.productName} batch ${coa.batch}: ${coa.purity} purity by RP-HPLC, identity confirmed by LC-MS, tested ${coa.testDate} by an independent laboratory.`;
  return {
    title: `COA — ${coa.productName} Batch ${coa.batch} — RovaPeptides`,
    description,
    alternates: { canonical: `/coas/${coa.batch}` },
    openGraph: { title: `Certificate of Analysis — ${coa.productName} (${coa.batch})`, description, url, type: "article" },
  };
}

export default function CoaBatchPage({ params }: { params: { batch: string } }) {
  const coa = getCoa(decodeURIComponent(params.batch));
  if (!coa) notFound();

  const batchUrl = `${site.siteUrl}/coas/${coa.batch}`;
  const productPath = productUrlFor(coa.batch);
  const ld = coaPageJsonLd(coa, batchUrl, `${site.siteUrl}${productPath}`);
  const crumbs = breadcrumbJsonLd([
    { name: "Home", url: site.siteUrl },
    { name: "COA Lookup", url: `${site.siteUrl}/coas` },
    { name: `Batch ${coa.batch}`, url: batchUrl },
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
          { label: `Batch ${coa.batch}` },
        ]}
      />

      <main id="main-content" className="mx-auto max-w-[880px] px-5 py-12 sm:px-8">
        <span className="kicker inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
          Certificate of Analysis
        </span>

        <h1 className="mt-3 text-display-md text-ink">
          {coa.productName} — Batch {coa.batch}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">
          {coa.productName} ({coa.subtitle}), {coa.mass}. Tested on {coa.testDate} by {coa.lab} and
          released on {coa.releaseDate}. All specifications passed.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="data-tag inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
            Overall result: {coa.overall}
          </span>
          <span className="data-tag">{coa.purity} purity</span>
          <span className="data-tag">Independent third-party lab</span>
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold uppercase text-ink">
          Analytical results
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-paper-2/40">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <caption className="sr-only">
              Analytical results for {coa.productName} batch {coa.batch}
            </caption>
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="px-4 py-3 font-sans text-[0.62rem] uppercase tracking-widest text-muted">Analyte</th>
                <th scope="col" className="px-4 py-3 font-sans text-[0.62rem] uppercase tracking-widest text-muted">Method</th>
                <th scope="col" className="px-4 py-3 font-sans text-[0.62rem] uppercase tracking-widest text-muted">Specification</th>
                <th scope="col" className="px-4 py-3 font-sans text-[0.62rem] uppercase tracking-widest text-muted">Result</th>
                <th scope="col" className="px-4 py-3 font-sans text-[0.62rem] uppercase tracking-widest text-muted">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {coa.rows.map((row) => (
                <tr key={row.analyte} className="border-b border-line/60 last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-ink">{row.analyte}</th>
                  <td className="px-4 py-3 font-mono text-xs text-ink-2">{row.method}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{row.spec}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink">{row.result}</td>
                  <td className="px-4 py-3 font-mono text-xs text-signal-ink">{row.pass ? "PASS" : "FAIL"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="mt-6 grid gap-3 rounded-xl border border-line bg-paper-2/40 p-4 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Appearance</dt><dd className="mt-0.5 text-ink-2">{coa.appearance}</dd></div>
          <div><dt className="text-muted">Testing laboratory</dt><dd className="mt-0.5 text-ink-2">{coa.lab}</dd></div>
          <div><dt className="text-muted">Test date</dt><dd className="mt-0.5 text-ink-2">{coa.testDate}</dd></div>
          <div><dt className="text-muted">Release date</dt><dd className="mt-0.5 text-ink-2">{coa.releaseDate}</dd></div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={productPath} className="btn-signal">
            <FileCheck2 className="h-4 w-4" strokeWidth={2} />
            View {coa.productName}
          </Link>
          <Link href="/coas" className="btn-ghost">Look up another batch</Link>
        </div>

        <p className="mt-8 font-mono text-[0.62rem] uppercase tracking-widest text-muted">
          {site.compliance}
        </p>
      </main>
      <Footer />
    </>
  );
}
