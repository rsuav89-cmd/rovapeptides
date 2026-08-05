"use client";

import { motion } from "framer-motion";

export type FilterOption = { id: string; label: string; count: number };

/**
 * Horizontal collection filter. Replaces the dark card mosaic: type and a
 * sliding copper underline carry the active state instead of a container box,
 * so the bar reads as navigation rather than as a wall of content.
 */
export function CollectionFilterBar({
  options,
  active,
  onChange,
}: {
  options: FilterOption[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter by research collection"
      className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const isActive = option.id === active;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={[
              "relative inline-flex min-h-[44px] shrink-0 items-baseline gap-1.5 px-3 py-2.5",
              "font-sans text-sm font-medium transition-colors duration-200 ease-snap",
              isActive ? "text-ink-dark" : "text-muted-dark hover:text-ink-dark",
            ].join(" ")}
          >
            <span>{option.label}</span>
            <span className="font-mono text-[0.7rem] tabular-nums opacity-70">
              {option.count}
            </span>
            {isActive && (
              <motion.span
                layoutId="collection-underline"
                aria-hidden
                className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-brand-cta"
                transition={{ type: "spring", stiffness: 520, damping: 40, mass: 0.7 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
