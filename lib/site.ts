// Central brand + navigation config.

import { WC_ACCOUNT_URL } from "@/lib/wc";

export const site = {
  name: "RovaPeptides",
  tagline: "Research-grade peptides, verified to the batch.",
  freeShippingThreshold: 200,
  compliance: "For Research Use Only — Not for Human Consumption.",
  contactEmail: "support@rovapeptides.com",
  siteUrl: "https://rovapeptides.com",
};

/** Accepted payment methods — rendered in the footer and at the checkout step. */
export const paymentMethods = [
  { label: "Visa", className: "bg-white/10 text-white font-bold italic tracking-tight" },
  { label: "Mastercard", className: "bg-white/10 text-white font-semibold" },
  { label: "Cash App", className: "bg-[#00D632]/20 text-[#00D632] font-bold" },
  { label: "Zelle", className: "bg-[#6D1ED4]/20 text-[#B794F4] font-semibold" },
];

export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
};

// Four primary destinations. Secondary links (order tracking, wholesale,
// shipping, contact) live in the footer.
export const primaryNav: NavItem[] = [
  { label: "Shop All", href: "/shop" },
  { label: "COA Search", href: "/coas" },
  { label: "Analytical Methods", href: "/methods" },
  { label: "About", href: "/about" },
];

export const utilityNav: NavItem[] = [
  { label: "Account / Login", href: WC_ACCOUNT_URL, external: true },
  { label: "Order Tracking", href: "/track-order" },
  { label: "Testing & COAs", href: "/coas" },
  { label: "Analytical Methods", href: "/methods" },
  { label: "FAQ", href: "/faq" },
];

export const headerUtilityLinks: NavItem[] = [
  { label: "Account", href: WC_ACCOUNT_URL, external: true },
];
