"use client";

import { useEffect } from "react";

/**
 * Scroll-entry reveals for `.reveal` elements. A `.stagger` parent gives each
 * child an index-scaled transition-delay (capped, so a 12-card grid never
 * leads in for more than ~315ms).
 *
 * The hidden state lives behind `@media (scripting: enabled)` in globals.css,
 * so a no-JS render shows everything; if IntersectionObserver is unavailable
 * this reveals immediately rather than leaving content invisible.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
    );
    if (nodes.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );

    nodes.forEach((el) => {
      const siblings = el.parentElement?.children;
      const index = siblings ? Array.prototype.indexOf.call(siblings, el) : 0;
      el.style.setProperty("--i", String(Math.min(Math.max(index, 0), 7)));
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);
}
