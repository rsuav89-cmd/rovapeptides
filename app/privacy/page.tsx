import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — RovaPeptides",
  description:
    "Privacy Policy describing how RovaPeptides collects, uses, and protects information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <>
    <NoticeBar />
    <Header />
    <main className="mx-auto max-w-[760px] px-5 py-16 sm:px-8">
    <span className="kicker">Legal</span>
      <h1 className="mt-3 text-display-lg text-ink">Privacy Policy</h1>
    <p className="mt-4 text-sm text-ink-2">Last updated: July 2026</p>
      <div className="mt-10 space-y-8 text-ink-2">
      <div>
      <h2 className="text-lg font-semibold text-ink">1. Information We Collect</h2>
      <p className="mt-2">We collect information you provide directly, such as your name, shipping address, email, and order details, when you place an order or contact support.</p>
      </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">2. How We Use Your Information</h2>
        <p className="mt-2">We use your information to process orders, provide customer support, and communicate updates about your purchase. We do not sell your personal information.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">3. Payment Information</h2>
        <p className="mt-2">Payments are processed securely by third-party payment providers. RovaPeptides does not store your full credit card number on our servers.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">4. Cookies</h2>
        <p className="mt-2">We use cookies to keep your cart working and to understand how visitors use our site, so we can improve it over time.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">5. Third-Party Sharing</h2>
        <p className="mt-2">We share information only with service providers who help us operate our business, such as payment processors and shipping carriers, under confidentiality obligations.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">6. Your Rights</h2>
        <p className="mt-2">You may request access to, correction of, or deletion of your personal information at any time by contacting our support team.</p>
        </div>
      </div>
    </main>
      <Footer />
    </>
    );
}

  
