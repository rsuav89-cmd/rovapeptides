"use client";

import { useState } from "react";
import { FlaskConical, Truck, ShieldCheck, Pause, Play } from "lucide-react";
import { site } from "@/lib/site";

const items = [
  { icon: FlaskConical, text: "For Research Use Only — Not for Human Consumption" },
  { icon: Truck, text: `Free discreet shipping on orders over $${site.freeShippingThreshold}` },
  { icon: ShieldCheck, text: "Third-party COA available on every batch" },
];

// Infinite marquee — the row is duplicated so the -50% keyframe loops seamlessly.
// WCAG 2.2.2 (Pause, Stop, Hide) is Level A and applies to any automatic motion
// lasting more than five seconds, so the animation carries an explicit control
// rather than relying on prefers-reduced-motion alone.
export function NoticeBar() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative z-50 h-[var(--notice-h)] overflow-hidden bg-brand-deep text-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-brand-deep to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-brand-deep to-transparent sm:w-16" />
      <div className="flex h-full items-center">
        <div
          className={[
            "flex shrink-0 animate-marquee items-center whitespace-nowrap will-change-transform motion-reduce:animate-none",
            paused ? "[animation-play-state:paused]" : "",
          ].join(" ")}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {items.map((it, i) => (
                <span key={i} className="flex items-center gap-2 px-7 text-[0.74rem] tracking-wide">
                  <it.icon className="h-3.5 w-3.5 text-signal" strokeWidth={2} />
                  <span className="text-white/85">{it.text}</span>
                  <span className="ml-7 h-1 w-1 rounded-full bg-brand-cta/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Resume scrolling announcements" : "Pause scrolling announcements"}
        className="absolute right-0 top-1/2 z-20 grid h-full w-8 -translate-y-1/2 place-items-center text-white/70 transition-colors hover:text-white"
      >
        {paused ? (
          <Play className="h-3 w-3" strokeWidth={2.4} />
        ) : (
          <Pause className="h-3 w-3" strokeWidth={2.4} />
        )}
      </button>
    </div>
  );
}
