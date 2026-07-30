import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ — RovaPeptides",
  description:
    "Answers to common questions about product quality, storage & reconstitution, ordering & payments, and shipping & packaging for RovaPeptides research compounds.",
};

export default function FaqPage() {
  return (
    <>
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
          <div className="space-y-8">
          <div>
          <h2 className="text-lg font-semibold text-ink">Are RovaPeptides products safe to use?</h2>
          <p className="mt-2 text-ink-2">All RovaPeptides products are sold strictly for laboratory and in-vitro research use. They are not for human consumption, and nothing on this site is medical or dosing guidance.</p>
          </div>
            <div>
            <h2 className="text-lg font-semibold text-ink">How should I store and reconstitute peptides?</h2>
            <p className="mt-2 text-ink-2">Store lyophilized powder at -20°C, protected from light, until ready for use in a laboratory setting. Reconstitute with bacteriostatic water shortly before use.</p>
            </div>
            <div>
            <h2 className="text-lg font-semibold text-ink">How do I place an order and what payments do you accept?</h2>
            <p className="mt-2 text-ink-2">Add items to your cart from the shop page and check out securely online. We accept major credit cards, and bulk research orders can request invoicing by contacting support.</p>
            </div>
            <div>
            <h2 className="text-lg font-semibold text-ink">How is my order shipped and packaged?</h2>
            <p className="mt-2 text-ink-2">Orders ship discreetly within 24 hours of purchase, with cold-chain packaging used where appropriate to protect product integrity in transit.</p>
            </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
