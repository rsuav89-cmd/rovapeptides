import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export const metadata: Metadata = {
  alternates: { canonical: "/track-order" },
  robots: { index: false, follow: true },
  title: "Order Tracking — RovaPeptides",
  description:
    "Look up the status of your RovaPeptides order using your order number and checkout email.",
};

export default function TrackOrderPage() {
  return (
    <>
      <NoticeBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <span className="kicker inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
          Orders
        </span>
        <h1 className="mt-3 text-display-lg text-ink">Track your order</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          Enter the order number from your confirmation email and the email address used at checkout.
        </p>

        <div className="mt-10 rounded-xl2 border border-line bg-paper-2/40 p-6 sm:p-8">
          <TrackOrderForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
