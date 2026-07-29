"use client";

import { motion } from "framer-motion";
import { FlaskConical, MapPin, Truck } from "lucide-react";

const pillars = [
  {
    index: "01",
    icon: FlaskConical,
    stat: "99%+",
    title: "Verified Batch Purity",
    body: "Every lot is assayed by RP-HPLC and confirmed by LC-MS. We publish the exact purity for the batch you receive — never a marketing average.",
  },
  {
    index: "02",
    icon: MapPin,
    stat: "USA",
    title: "Laboratory Batch Testing",
    body: "Synthesized to spec and independently third-party tested in United States laboratories, with ISO-standard analytical methods and full chain of custody.",
  },
  {
    index: "03",
    icon: Truck,
    stat: "24h",
    title: "Fast Domestic Shipping",
    body: "Discreet, cold-pack fulfillment within 24 hours. Tracked domestic delivery, and free on every order over $200.",
  },
];

export function TrustQuality() {
  return (
    <section id="quality" className="scroll-mt-24 border-t border-line/70 bg-paper-2/30">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
        {/* Left: editorial statement (sticky on desktop for asymmetric rhythm) */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="kicker inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
            Quality &amp; Assurance
          </span>
          <h2 className="mt-4 text-display-md text-ink">
            Quality you can <span className="text-brand">verify</span>, not just trust.
          </h2>
          <p className="mt-4 max-w-md text-ink-2">
            Purity claims mean nothing without proof. Each RovaPeptides lot ships with a
            batch-specific Certificate of Analysis you can pull up below — the same document
            our own release process runs on.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#coa" className="btn-primary">Look up a batch COA</a>
            <a href="#catalog" className="btn-ghost">Browse catalog</a>
          </div>
        </div>

        {/* Right: pillars as an editorial spec list (not a flat card grid) */}
        <div>
          {pillars.map((p, i) => (
            <motion.div
              key={p.index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.28, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7 first:border-t-0 first:pt-0 sm:gap-7"
            >
              <div className="flex flex-col items-start gap-3">
                <span className="font-mono text-[0.7rem] text-muted">{p.index}</span>
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-paper-2 text-brand transition-[transform,border-color] duration-280 ease-out-expo group-hover:-translate-y-0.5 group-hover:border-line-strong">
                  <p.icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-semibold text-ink sm:text-5xl">
                    {p.stat}
                  </span>
                  <span className="h-px flex-1 origin-left scale-x-0 bg-line transition-transform duration-280 ease-out-expo group-hover:scale-x-100" />
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 max-w-md text-ink-2">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
