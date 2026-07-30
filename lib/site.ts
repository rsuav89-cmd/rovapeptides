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
  { label: "Shop", href: "/shop" },
  { label: "All Peptides", href: "/shop" },
  { label: "Research Peptides", href: "/shop" },
  { label: "Longevity", href: "/shop" },
  { label: "New Arrivals", href: "/shop", badge: "New" },
  { label: "COA Lookup", href: "/coas" },
  ];

export const utilityNav: NavItem[] = [
  { label: "Testing & COAs", href: "/coas" },
  { label: "Quality", href: "/#quality" },
  { label: "FAQ", href: "/faq" },
  ];
