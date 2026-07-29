"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { primaryNav, utilityNav, site } from "@/lib/site";
import { Logo } from "./Logo";

// Spring-physics slide-in panel. Backdrop fades (opacity), panel springs (transform).
// Both are GPU-accelerated; nav links stagger in under 300ms.
export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] lg:hidden"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Backdrop */}
          <motion.button
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-white/45 backdrop-blur-[2px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Panel */}
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-paper-2 shadow-drawer"
            variants={{
              open: { x: 0 },
              closed: { x: "100%" },
            }}
            transition={{ type: "spring", stiffness: 520, damping: 44, mass: 0.8 }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-transform duration-160 ease-out-expo active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {primaryNav.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.06 + i * 0.045,
                      duration: 0.28,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-xl px-3 py-3 font-display text-2xl tracking-tight transition-colors duration-160 hover:bg-white/[0.04]"
                    >
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full bg-brand-cta px-2 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-widest text-white">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="my-6 hairline" />

              <ul className="space-y-1">
                {utilityNav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={onClose}
                      className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-line px-5 py-5">
              <a href="#catalog" onClick={onClose} className="btn-signal w-full">
                Shop All Peptides
              </a>
              <p className="mt-3 text-center font-mono text-[0.62rem] uppercase tracking-widest text-muted">
                {site.compliance}
              </p>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
