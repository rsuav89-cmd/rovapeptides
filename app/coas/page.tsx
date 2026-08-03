import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { CoaViewer } from "@/components/CoaViewer";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Certificate of Analysis Lookup — RovaPeptides",
  description:
    "Look up the third-party Certificate of Analysis for any RovaPeptides batch by entering the batch number printed on your vial.",
  alternates: { canonical: "/coas" },
  openGraph: {
    title: "Certificate of Analysis Lookup — RovaPeptides",
    description:
      "Enter any RovaPeptides batch number to open its third-party COA: HPLC purity, LC-MS identity, endotoxin, and water content.",
    url: `${site.siteUrl}/coas`,
    type: "website",
  },
};

export default function CoasPage({
  searchParams,
}: {
  searchParams?: { batch?: string };
}) {
  return (
    <>
      <NoticeBar />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className="mx-auto max-w-[1280px] px-5 pt-12 sm:px-8">
          <h1 className="text-display-md text-ink">Certificate of Analysis lookup</h1>
          <p className="mt-3 max-w-xl text-ink-2">
            Every batch we release is tested by an independent laboratory before it ships. Enter the
            batch number printed on your vial to open its full report.
          </p>
        </div>
        <CoaViewer initialBatch={searchParams?.batch} />
      </main>
      <Footer />
    </>
  );
}
