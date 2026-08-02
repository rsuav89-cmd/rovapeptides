import Link from "next/link";
import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found — RovaPeptides",
  description:
    "The page you're looking for moved or never existed. Browse the RovaPeptides research catalog instead.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <NoticeBar />
      <Header />
      <main id="main-content" className="grid min-h-[60vh] place-items-center px-6 py-20 text-center">
        <div className="max-w-lg">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Error 404
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold uppercase leading-tight text-ink">
            Page not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            The page you&apos;re looking for moved or never existed. Explore the research
            catalog instead — every batch ships with a Certificate of Analysis.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/shop" className="btn-signal">
              Shop all peptides
            </Link>
            <Link href="/" className="btn-ghost">
              Back home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
