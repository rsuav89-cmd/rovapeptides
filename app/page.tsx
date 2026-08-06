import { ArrowUpRight, FileCheck2, ShieldCheck, Microscope } from "lucide-react";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { HeroShowcase } from "@/components/HeroShowcase";
import { Catalog } from "@/components/catalog/Catalog";
import dynamic from "next/dynamic";

// Below-the-fold and framer-motion-heavy: server-rendered as usual, but their
// client bundles are fetched as separate chunks instead of blocking hydration.
const TrustQuality = dynamic(() =>
  import("@/components/TrustQuality").then((m) => m.TrustQuality)
);
const CoaViewer = dynamic(() =>
  import("@/components/CoaViewer").then((m) => m.CoaViewer)
);
const FaqPreview = dynamic(() =>
  import("@/components/faq/FaqPreview").then((m) => m.FaqPreview)
);
import { Footer } from "@/components/Footer";
import { AnalyticalAuthority } from "@/components/AnalyticalAuthority";

import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    "Research-grade peptides with third-party HPLC verification and a certificate of analysis for every batch. Discreet shipping, transparent purity data, and COA lookup by batch number.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      "Third-party HPLC-verified research peptides. Every batch ships with a certificate of analysis.",
    url: site.siteUrl,
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <NoticeBar />
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* HERO — dark editorial brand moment that resolves into the warm catalog */}
        <section className="relative overflow-hidden">
          <div className="relative mx-auto grid max-w-[1280px] items-end gap-10 px-5 pb-28 pt-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pb-32 lg:pt-20">
            <div className="animate-fade-up">
              <span className="kicker inline-flex items-center gap-2">
                USA Third-Party Tested · Per-Batch COA
              </span>
              <h1 className="mt-5 text-display-xl text-ink">
                Research peptides,
                <br />
                <span className="text-brand">verified to the batch.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
                {site.name} delivers laboratory-grade research compounds with
                third-party Certificates of Analysis on every lot — traceable,
                transparent, and shipped fast.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="/shop/all" className="btn-signal">
                  Browse All Peptides
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </a>
                <a href="/coas" className="btn-ghost">
                  <FileCheck2 className="h-4 w-4 text-signal-ink" strokeWidth={2} />
                  View Testing / COAs
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
                {[
                  { icon: ShieldCheck, label: "99%+ verified purity" },
                  { icon: Microscope, label: "3rd-party verified" },
                  { icon: FileCheck2, label: "COA per batch" },
                ].map((t) => (
                  <span key={t.label} className="flex items-center gap-2 text-sm text-muted">
                    <t.icon className="h-4 w-4 text-signal-ink" strokeWidth={1.9} />
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            <HeroShowcase />
          </div>

          {/* tonal transition — dark hero resolves into the warm ivory catalog */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-bone"
          />
        </section>

        {/* CATALOG — M2 (warm ivory surface, M1) */}
        {/* Home shows a curated 12 with a view-all CTA; /shop/all renders the full grid. */}
        <Catalog limit={12} />

        {/* TRUST & QUALITY — M4 */}
        <TrustQuality />

        {/* COA VIEWER — M4 */}
        <AnalyticalAuthority />

        <CoaViewer />

        {/* FAQ PREVIEW */}
        <FaqPreview />
      </main>

      {/* FOOTER — M5 */}
      <Footer />
    </>
  );
}
