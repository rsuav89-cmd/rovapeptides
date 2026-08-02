import { collections } from "@/lib/collections";
import { families } from "@/lib/catalog";
import { site } from "@/lib/site";

// /llms.txt — a plain-text orientation file for AI answer engines and agents.
// Static content, generated at build time.
export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

> ${site.tagline} ${site.name} supplies research-grade peptides and small molecules for laboratory and in-vitro research use only. Every batch is tested by an independent third-party laboratory by RP-HPLC (purity) and LC-MS (identity), and each Certificate of Analysis is publicly retrievable by batch number with no account required.

## Compliance

All products are sold strictly for laboratory and in-vitro research use. They are not for human or veterinary consumption, diagnostic use, or therapeutic use. ${site.name} publishes no dosing, protocol, or usage guidance, and nothing on the site should be read as medical guidance.

## Verification

- Purity: RP-HPLC at 220 nm, ${"≥"} 98.0% release specification; the measured result for the batch shipped is published, not an average.
- Identity: LC-MS (ESI), confirms molecular mass against reference.
- Additional analytes per batch: peptide content, water content (Karl Fischer), acetate content, bacterial endotoxins (LAL), appearance.
- Certificates: ${site.siteUrl}/coas — enter any batch number, or open ${site.siteUrl}/coas/{BATCH} directly.
- A batch that misses specification is not listed and not shipped.

## Catalog

${families.length} research compound families across ${collections.length} collections. Canonical product URLs are ${site.siteUrl}/shop/{family-slug}.

${collections
  .map((c) => `- [${c.name}](${site.siteUrl}/shop/collections/${c.slug}): ${c.shortDescription}`)
  .join("\n")}

## Key pages

- [Full catalog](${site.siteUrl}/shop/all)
- [COA lookup](${site.siteUrl}/coas)
- [FAQ](${site.siteUrl}/faq): purity standards, HPLC and mass-spectrometry methodology, COA verification, storage and reconstitution, ordering, shipping.
- [Shipping & returns](${site.siteUrl}/shipping): free US shipping over $${site.freeShippingThreshold}, discreet unmarked packaging, dispatch within 24 hours.
- [Wholesale](${site.siteUrl}/wholesale)
- [Contact](${site.siteUrl}/contact): ${site.contactEmail}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
