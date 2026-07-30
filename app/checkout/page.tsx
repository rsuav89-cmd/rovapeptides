import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout — RovaPeptides",
  description: "Complete your RovaPeptides order. For Research Use Only.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <NoticeBar />
      <Header />

      <main>
        <section className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:py-16">
          <h1 className="text-display-md text-ink">Checkout</h1>
          <p className="mt-2 text-sm text-muted">Review your order and enter your shipping details.</p>

          <div className="mt-10">
            <CheckoutClient />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
