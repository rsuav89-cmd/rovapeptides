import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";
import { NoticeBar } from "@/components/NoticeBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — RovaPeptides",
  description:
    "Get in touch with RovaPeptides support for order questions, COA lookups, and bulk research pricing.",
};

export default function ContactPage() {
  return (
    <>
    <NoticeBar />
    <Header />
      <main className="mx-auto grid max-w-[1080px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
      <span className="kicker inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
      Support
      </span>
      <h1 className="mt-3 text-display-lg text-ink">Contact us</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-2">
      Questions about an order, a batch COA, or bulk research pricing? Send us a message and our
      support team will follow up.
      </p>

        <ul className="mt-10 space-y-5">
        <li className="flex items-start gap-3">
        <Mail className="mt-0.5 h-5 w-5 text-signal-ink" strokeWidth={1.9} />
          <div>
          <p className="font-medium text-ink">Email</p>
          <a href={`mailto:${site.contactEmail}`} className="text-sm text-ink-2 underline">
            {site.contactEmail}
          </a>
          </div>
        </li>
          <li className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 text-signal-ink" strokeWidth={1.9} />
          <div>
          <p className="font-medium text-ink">Support hours</p>
          <p className="text-sm text-ink-2">Monday–Friday, 9am–6pm ET</p>
          </div>
          </li>
          <li className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 text-signal-ink" strokeWidth={1.9} />
          <div>
          <p className="font-medium text-ink">Shipping from</p>
          <p className="text-sm text-ink-2">United States</p>
          </div>
          </li>
        </ul>
      </div>

        <div className="rounded-xl2 border border-line bg-paper-2/40 p-6 sm:p-8">
        <ContactForm />
        </div>
      </main>
      <Footer />
      
    </>
    );
}
