import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service — RovaPeptides",
  description:
    "Terms of Service governing use of the RovaPeptides website and purchase of research products.",
};

export default function TermsPage() {
  return (
    <>
    <NoticeBar />
    <Header />
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-[760px] px-5 py-16 sm:px-8">
    <span className="kicker">Legal</span>
      <h1 className="mt-3 text-display-lg text-ink">Terms of Service</h1>
    <p className="mt-4 text-sm text-ink-2">Last updated: July 2026</p>
      <div className="mt-10 space-y-8 text-ink-2">
      <div>
      <h2 className="text-lg font-semibold text-ink">1. Research Use Only</h2>
      <p className="mt-2">All products sold by RovaPeptides are intended strictly for laboratory and in-vitro research use by qualified professionals. They are not drugs, dietary supplements, or cosmetics, and are not for human or veterinary consumption.</p>
      </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">2. Eligibility</h2>
        <p className="mt-2">By placing an order, you represent that you are purchasing on behalf of a research institution, laboratory, or similarly qualified entity, and that you are at least 18 years old.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">3. Orders & Payment</h2>
        <p className="mt-2">All prices are listed in U.S. dollars. We reserve the right to refuse or cancel any order at our discretion, including for suspected misuse of our products.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">4. Shipping</h2>
        <p className="mt-2">Orders are shipped discreetly. Estimated delivery times are provided for convenience and are not guaranteed. Risk of loss passes to the buyer upon delivery to the carrier.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">5. Limitation of Liability</h2>
        <p className="mt-2">RovaPeptides is not liable for any damages arising from misuse of its products, including any use outside of laboratory research settings.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">6. Changes to These Terms</h2>
        <p className="mt-2">We may update these Terms of Service from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">7. Contact</h2>
        <p className="mt-2">Questions about these terms can be sent to our support team via the Contact page.</p>
        </div>
      </div>
    </main>
      <Footer />
    </>
    );
}

  
