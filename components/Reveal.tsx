"use client";

import { useReveal } from "@/lib/useReveal";

/**
 * Mount once per page (in Providers) to activate every `.reveal` element.
 * Renders nothing.
 */
export function RevealController() {
  useReveal();
  return null;
}
