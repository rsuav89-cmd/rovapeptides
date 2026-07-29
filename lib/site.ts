// Central brand + navigation config.
// Swap these values (and the /public assets) to rebrand or update copy in one place.

export const site = {
  name: "RovaPeptides",
  tagline: "Research-grade peptides, verified to the batch.",
  freeShippingThreshold: 200, // USD
  compliance: "For Research Use Only — Not for Human Consumption.",
  contactEmail: "support@rovapeptides.com",
};

export type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

export const primaryNav: NavItem[] = [
  { label: "All Peptides", href: "#catalog" },
  { label: "Research Peptides", href: "#catalog" },
  { label: "Longevity", href: "#catalog" },
  { label: "New Arrivals", href: "#catalog", badge: "New" },
  { label: "COA Lookup", href: "#coa" },
];

export const utilityNav: NavItem[] = [
  { label: "Testing & COAs", href: "#coa" },
  { label: "Quality", href: "#quality" },
  { label: "FAQ", href: "#faq" },
];
