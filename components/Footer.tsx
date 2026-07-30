import { Lock, ShieldCheck, Truck, BadgeCheck, FlaskConical } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { site } from "@/lib/site";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
        title: "Shop",
        links: [
          { label: "All Peptides", href: "/shop" },
          { label: "Research Peptides", href: "/shop" },
          { label: "Skin & Beauty", href: "/shop" },
          { label: "Longevity", href: "/shop" },
              ],
  },
  {
        title: "Testing",
        links: [
          { label: "COA Lookup", href: "/coas" },
          { label: "Quality & Assurance", href: "/#quality" },
          { label: "Third-Party Labs", href: "/#quality" },
          { label: "Purity Standards", href: "/#quality" },
              ],
  },
  {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Shipping & Returns", href: "/shipping" },
          { label: "FAQ", href: "/faq" },
          { label: "Contact", href: "/contact" },
          { label: "Wholesale", href: "/wholesale" },
              ],
  },
  ];

const badges = [
  { icon: Lock, label: "SSL Secured" },
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: Truck, label: "Discreet Shipping" },
  { icon: BadgeCheck, label: "Verified Merchant" },
];

export function Footer() {
  return (
    <footer className="bg-brand-deep text-white">
      {/* Compliance band */}
      <div className="border-b border-paper/10">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-5 py-4 sm:px-8">
          <FlaskConical className="h-5 w-5 shrink-0 text-signal" strokeWidth={1.9} />
          <p className="text-sm text-white/75">
            <span className="font-semibold text-white">For Research Use Only.</span> Not for human
            or veterinary use, not for diagnostic or therapeutic use, and not for food or cosmetic
            use. Products are sold to qualified researchers and institutions only.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.3fr_2fr] lg:py-16">
        {/* Brand + newsletter */}
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {site.tagline} Batch-specific Certificates of Analysis on every research compound we ship.
          </p>
          <p className="mt-6 font-mono text-[0.65rem] uppercase tracking-widest text-signal">
            Get new batch drops &amp; COA updates
          </p>
          <div className="mt-3 max-w-sm">
            <NewsletterForm />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-white/50">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center text-sm text-white/80 transition-colors duration-160 hover:text-white"
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brand-cta transition-transform duration-220 ease-out-expo group-hover:scale-x-100" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-5 sm:px-8">
          {badges.map((b) => (
            <span key={b.label} className="inline-flex items-center gap-2 text-xs text-white/70">
              <b.icon className="h-4 w-4 text-signal" strokeWidth={1.9} />
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-2 px-5 py-5 sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-white/55">
            © 2026 {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-white/45">
            {site.compliance}
          </p>
          <div className="flex items-center gap-4">
          <a href="/privacy" className="text-xs text-white/55 transition-colors hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-xs text-white/55 transition-colors hover:text-white"></a>
          </div>
      </div>
    </footer>
  );
}
