import { FlaskConical, Truck, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

const items = [
  { icon: FlaskConical, text: "For Research Use Only — Not for Human Consumption" },
  { icon: Truck, text: `Free discreet shipping on orders over $${site.freeShippingThreshold}` },
  { icon: ShieldCheck, text: "Third-party COA available on every batch" },
];

// Infinite marquee — the row is duplicated so the -50% keyframe loops seamlessly.
export function NoticeBar() {
  return (
    <div className="relative z-50 h-[var(--notice-h)] overflow-hidden bg-brand-deep text-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-deep to-transparent" />
      <div className="flex h-full items-center">
        <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap will-change-transform motion-reduce:animate-none">
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
    </div>
  );
}
