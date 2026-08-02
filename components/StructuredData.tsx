import { site } from "@/lib/site";

// Sitewide Organization + WebSite structured data. Rendered once in the root
// layout so every page carries it. Data is static/developer-authored (no user
// input), so the JSON-LD injection is safe.
export function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    "@id": `${site.siteUrl}#organization`,
    name: site.name,
    url: site.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${site.siteUrl}/apple-icon`,
      width: 180,
      height: 180,
    },
    email: site.contactEmail,
    description:
      "Research-grade peptides with 99%+ verified purity and third-party Certificates of Analysis on every batch. For Research Use Only.",
    contactPoint: {
      "@type": "ContactPoint",
      email: site.contactEmail,
      contactType: "customer support",
      areaServed: "US",
      availableLanguage: "English",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.siteUrl,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
