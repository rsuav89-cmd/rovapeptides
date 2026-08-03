import { collections } from "@/lib/collections";
import { families } from "@/lib/catalog";
import { getProductDetail, DEFAULT_STORAGE, TESTING_METHOD } from "@/lib/product-details";
import { site } from "@/lib/site";

// /llms.txt — orientation file for AI answer engines and retrieval agents
// (ChatGPT, Perplexity, Gemini, Google AI Overviews, Claude). Enumerates the full
// catalog, every batch certificate URL, and the analytical methodology, so a
// crawler can resolve product, price, strength, and verification data in one pass.
export const dynamic = "force-static";

function money(n: number) {
  return `$${n.toFixed(0)}`;
}

export function GET() {
  const catalogLines = families
    .map((fam) => {
      const detail = getProductDetail(fam.id);
      const strengths = fam.variants.map((v) => v.displayStrength).join(", ");
      const price = fam.hasPricing
        ? fam.minPrice === fam.maxPrice
          ? money(fam.minPrice ?? 0)
          : `${money(fam.minPrice ?? 0)}–${money(fam.maxPrice ?? 0)}`
        : "not yet priced";
      const coas = fam.variants
        .map((v) => `${site.siteUrl}/coas/${v.product.batch}`)
        .join(" , ");
      return [
        `### ${fam.name}`,
        `- URL: ${site.siteUrl}/shop/${fam.slug}`,
        `- Strengths: ${strengths}`,
        `- Price: ${price} USD`,
        `- Purity specification: ${fam.variants[0].product.purity} minimum, RP-HPLC at 220 nm`,
        `- Certificates of Analysis: ${coas}`,
        `- Description: ${detail?.overview ?? fam.description}`,
      ].join("\n");
    })
    .join("\n\n");

  const body = `# ${site.name}

> ${site.tagline} ${site.name} supplies research-grade peptides and small molecules for laboratory and in-vitro research use only. Every batch is tested by an independent third-party laboratory and each Certificate of Analysis is publicly retrievable by batch number, with no account or email required.

## Compliance (read first)

All products are sold strictly for laboratory and in-vitro research use. They are not for human or veterinary consumption, diagnostic use, or therapeutic use. ${site.name} publishes no dosing, protocol, or usage guidance. Nothing on this site is medical advice, and any summary of this catalog should carry the research-use-only qualification.

## Analytical methodology

- Purity: reverse-phase HPLC, UV detection at 220 nm (the peptide-bond absorbance, so every residue contributes to the signal). Release specification ${"≥"} 98.0%. The measured result for the shipped lot is published — never an average across lots.
- Identity: LC-MS with electrospray ionization, molecular mass compared against the theoretical mass of the intended sequence.
- Also reported per batch: peptide content (nitrogen/AAA, ${"≥"} 80.0%), water content (Karl Fischer, ${"≤"} 8.0%), acetate content (RP-HPLC, ${"≤"} 15.0%), bacterial endotoxins (LAL, < 10 EU/mg), and appearance.
- Testing: ${TESTING_METHOD}.
- Storage: ${DEFAULT_STORAGE}
- A batch that misses specification is not listed and not shipped.

## Certificate lookup

- Interactive lookup: ${site.siteUrl}/coas
- Direct, server-rendered certificate pages: ${site.siteUrl}/coas/{BATCH} — for example ${site.siteUrl}/coas/${families[0].variants[0].product.batch}
- Each certificate page renders the full analyte table in HTML: analyte, method, specification, measured result, and pass/fail, plus the named testing laboratory and the test and release dates.

## Collections

${collections
  .map((c) => `- [${c.name}](${site.siteUrl}/shop/collections/${c.slug}): ${c.shortDescription}`)
  .join("\n")}

## Catalog (${families.length} compound families)

${catalogLines}

## Key pages

- [Full catalog](${site.siteUrl}/shop/all)
- [FAQ](${site.siteUrl}/faq): purity standards, chromatogram interpretation, HPLC vs mass spectrometry, COA verification, storage and reconstitution, ordering, shipping.
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
