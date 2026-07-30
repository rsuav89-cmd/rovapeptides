import type { Metadata } from "next";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shipping & Returns — RovaPeptides",
  description:
    "Shipping timelines, packaging, tracking, and returns information for RovaPeptides research orders.",
};

export default function ShippingPage() {
  return (
    <>
    <NoticeBar />
    <Header />
    <main className="mx-auto max-w-[760px] px-5 py-16 sm:px-8">
    <span className="kicker">Support</span>
      <h1 className="mt-3 text-display-lg text-ink">Shipping & Returns</h1>
    <p className="mt-4 text-sm text-ink-2">Last updated: July 2026</p>
      <div className="mt-10 space-y-8 text-ink-2">
      <div>
      <h2 className="text-lg font-semibold text-ink">1. Processing Time</h2>
      <p className="mt-2">Orders are processed and shipped within 24 hours of purchase, Monday through Friday. Orders placed on weekends or holidays ship the next business day.</p>
      </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">2. Shipping Rates & Delivery</h2>
        <p className="mt-2">Standard shipping is free on orders over $200 and flat-rate for smaller orders. Estimated delivery is 2–5 business days within the continental United States.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">3. Packaging</h2>
        <p className="mt-2">All orders ship in discreet, unmarked packaging. Temperature-sensitive items are shipped with cold-chain packaging to protect product integrity in transit.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">4. Tracking</h2>
        <p className="mt-2">You will receive a tracking number by email as soon as your order ships, so you can follow its progress to your door.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">5. Returns & Refunds</h2>
        <p className="mt-2">Unopened items in original packaging may be returned within 14 days of delivery for a refund. Contact support to start a return before shipping anything back.</p>
        </div>
        <div>
        <h2 className="text-lg font-semibold text-ink">6. Damaged or Lost Shipments</h2>
        <p className="mt-2">If your order arrives damaged or does not arrive, contact support within 7 days so we can arrange a replacement or refund.</p>
        </div>
      </div>
    </main>
      <Footer />
    </>
      );
      }
  
