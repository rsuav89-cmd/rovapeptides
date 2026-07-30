import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wholesale — RovaPeptides",
  description:
    "Bulk research pricing and wholesale inquiries for laboratories and institutions ordering RovaPeptides in volume.",
};

export default function WholesalePage() {
  return (
    <>
    <NoticeBar />
    <Header />
    <main className="mx-auto max-w-[760px] px-5 py-16 sm:px-8">
    <span className="kicker">Wholesale</span>
      <h1 className="mt-3 text-display-lg text-ink">Bulk & Wholesale Inquiries</h1>
    <p className="mt-4 max-w-[600px] text-lg leading-relaxed text-ink-2">
    Labs and institutions ordering in volume can access discounted research pricing. Tell us what you need and our team will follow up with a custom quote.
    </p>
      <div className="mt-10 space-y-8 text-ink-2">
      <div>
      <h2 className="text-lg font-semibold text-ink">Who qualifies</h2>
      <p className="mt-2">Wholesale pricing is available to universities, research institutions, and laboratories placing recurring or large-volume orders.</p>
      </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">Minimum order</h2>
        <p className="mt-2">Wholesale accounts typically start at 10 units per SKU or a total order value of $1,000, though we are happy to discuss smaller pilot orders.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">How to request a quote</h2>
        <p className="mt-2">Email our team with your institution name, the products and quantities you are interested in, and your expected order cadence.</p>
        </div>
      </div>
      <div className="mt-10 rounded-xl2 border border-line bg-paper-2 p-6">
      <p className="font-medium text-ink">Get in touch</p>
        <a href={`mailto:${site.contactEmail}`} className="mt-2 inline-block text-sm text-ink-2 underline">
          {site.contactEmail}
        </a>
      </div>
    </main>
      <Footer />
    </>
    );
}
