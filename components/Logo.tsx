import { site } from "@/lib/site";

export function Logo({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  // Dark theme throughout — copper mark, white wordmark. `inverted` kept for API compat.
  void inverted;
  const mark = "#B76E59"; // Pure Copper
  const node = "#FFFFFF";

  return (
    <a
      href="#top"
      aria-label={`${site.name} — home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
          <path
            d="M20 3 L33.9 11 V27 L20 35 L6.1 27 V11 Z"
            fill="none"
            stroke={mark}
            strokeWidth="2"
            className="origin-center transition-transform duration-280 ease-spring-soft will-change-transform group-hover:rotate-[30deg]"
          />
          <circle cx="14" cy="17" r="2.4" fill={mark} />
          <circle cx="20" cy="23" r="2.4" fill={node} />
          <circle cx="26" cy="17" r="2.4" fill={mark} />
          <path d="M14 17 L20 23 L26 17" fill="none" stroke={mark} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-[1.15rem] font-bold uppercase tracking-tight text-white">
        Rova<span className="text-brand">Peptides</span>
      </span>
    </a>
  );
}
