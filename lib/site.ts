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

export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
};

export const primaryNav: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "All Peptides", href: "/shop" },
  { label: "Research Peptides", href: "/shop?category=Research+Peptides" },
  { label: "Longevity", href: "/shop?category=Longevity" },
  { label: "New Arrivals", href: "/shop?category=New+Arrivals", badge: "New" },
  { label: "COA Lookup", href: "/coas" },
  { label: "Order Tracking", href: "/track-order" },
];

export const utilityNav: NavItem[] = [
  { label: "Account / Login", href: WC_ACCOUNT_URL, external: true },
  { label: "Order Tracking", href: "/track-order" },
  { label: "Testing & COAs", href: "/coas" },
  { label: "Quality", href: "/#quality" },
  { label: "FAQ", href: "/faq" },
];

export const headerUtilityLinks: NavItem[] = [
  { label: "Account", href: WC_ACCOUNT_URL, external: true },
  { label: "Track Order", href: "/track-order" },
];
