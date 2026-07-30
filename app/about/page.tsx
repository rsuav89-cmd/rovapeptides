import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "About Us — RovaPeptides",
  description:
    "RovaPeptides supplies high-purity, third-party-tested peptides for laboratory research. Learn about our mission and quality standards.",

};

export default function AboutPage() {
  return (
    <>
    <NoticeBar />
    <Header />
    <main className="border-t border-line/70">
    <div className="mx-auto max-w-[860px] px-5 py-16 sm:px-8 lg:py-24">
    <span className="kicker">About RovaPeptides</span>
      <h1 className="mt-4 text-display-md text-ink">
      Research-grade peptides, backed by real lab data.
      </h1>
      <div className="mt-6 max-w-[640px] space-y-4 text-ink-2">
      <p>
      RovaPeptides was founded to give researchers a dependable source of laboratory peptides — accurately dosed, independently verified, and shipped fast. Every batch we sell carries its own third-party Certificate of Analysis, so you can confirm identity and purity before it ever reaches the bench.
      </p>
        <p>
        We work only with peptides manufactured and tested to strict laboratory-grade standards, and we publish every result — not just the ones that look good. If a batch doesn’t meet spec, it doesn’t ship.
        </p>
        <div className="mt-10 max-w-[640px] rounded-xl2 border border-line bg-paper-2/40 p-6">
        <p className="text-sm text-ink-2">
        COMPLIANCE: All RovaPeptides products are sold strictly for laboratory and in-vitro research use. They are not for human consumption, and no material on this site should be read as medical or dosing guidance.
        </p>
        </div>
      </div>
    </div>
    </main>
      <Footer />
    </>
    );
}
