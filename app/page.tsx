import { ArrowUpRight, FileCheck2, ShieldCheck, Microscope } from "lucide-react";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { HeroShowcase } from "@/components/HeroShowcase";
import { Catalog } from "@/components/catalog/Catalog";
import { TrustQuality } from "@/components/TrustQuality";
import { CoaViewer } from "@/components/CoaViewer";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <NoticeBar />
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-[1280px] items-end gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24 lg:pt-20">
            <div className="animate-fade-up">
              <span className="kicker inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
                USA Laboratory Tested · 99%+ Purity
              </span>
              <h1 className="mt-5 text-display-lg text-ink">
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
                <a href="#catalog" className="btn-signal">
                  Shop All Peptides
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </a>
                <a href="#coa" className="btn-ghost">
                  <FileCheck2 className="h-4 w-4 text-signal-ink" strokeWidth={2} />
                  View Testing / COAs
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  { icon: ShieldCheck, label: "99.4% avg. purity" },
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
        </section>

        {/* CATALOG — M2 */}
        <Catalog />

        {/* TRUST & QUALITY — M4 */}
        <TrustQuality />

        {/* COA VIEWER — M4 */}
        <CoaViewer />
      </main>

      {/* FOOTER — M5 */}
      <Footer />
    </>
  );
}
