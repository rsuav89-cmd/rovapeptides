import { isPurchasable, type Product } from "@/lib/products";
import type { CatalogProductFamily, CatalogVariant } from "@/lib/catalog";
import type { Coa } from "@/lib/coa";
import { site } from "@/lib/site";

export function productJsonLd(
  product: Product,
  opts?: {
    /** Canonical family URL. Defaults to the legacy per-SKU path. */
    url?: string;
    /** Longer laboratory overview, when one exists for the family. */
    description?: string;
    /** Rendered spec rows, mirrored into schema.org additionalProperty. */
    specs?: { name: string; value: string }[];
  }
) {
  const url = opts?.url ?? `${site.siteUrl}/shop/${product.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: opts?.description ?? product.description,
    sku: product.id,
    mpn: product.id,
    url,
    image: `${site.siteUrl}${product.photo}`,
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Batch number",
        value: product.batch,
      },
      {
        "@type": "PropertyValue",
        name: "Purity",
        value: product.purity,
        measurementTechnique: "RP-HPLC with mass-spectrometry identity confirmation",
      },
      ...(opts?.specs ?? []).map((spec) => ({
        "@type": "PropertyValue",
        name: spec.name,
        value: spec.value,
      })),
    ],
    // Unpriced SKUs emit no Offer at all: a price of 0 alongside InStock is a
    // structured-data mismatch against the visible "Pricing coming soon" state.
    ...(isPurchasable(product)
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "USD",
            price: product.price,
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              "@id": `${site.siteUrl}#organization`,
              name: site.name,
            },
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function faqPageJsonLd(
  entries: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Multi-strength families: ProductGroup + hasVariant.
// A single Product node can only describe one variant, so a family page with a
// strength selector was advertising variant 0's price for every strength. A
// ProductGroup carries the real price range and one node per strength.
// ─────────────────────────────────────────────────────────────────────────────
export function productGroupJsonLd(
  fam: CatalogProductFamily,
  opts: {
    url: string;
    description: string;
    specs?: { name: string; value: string }[];
  }
) {
  const priced = fam.variants.filter((v) => isPurchasable(v.product));
  const variantOffer = (v: CatalogVariant) => ({
    "@type": "Offer",
    url: opts.url,
    priceCurrency: "USD",
    price: v.price,
    itemCondition: "https://schema.org/NewCondition",
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", "@id": `${site.siteUrl}#organization` },
  });

  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${opts.url}#product`,
    name: fam.name,
    description: opts.description,
    url: opts.url,
    image: `${site.siteUrl}${fam.representativeImage}`,
    productGroupID: fam.id,
    variesBy: ["https://schema.org/size"],
    brand: { "@type": "Brand", name: site.name },
    category: "Laboratory research chemicals",
    ...(opts.specs?.length
      ? {
          additionalProperty: opts.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.name,
            value: spec.value,
          })),
        }
      : {}),
    hasVariant: fam.variants.map((v) => ({
      "@type": "Product",
      "@id": `${opts.url}#${v.sourceId}`,
      name: `${fam.name} ${v.displayStrength}`,
      sku: v.sourceId,
      mpn: v.sourceId,
      size: v.displayStrength,
      image: `${site.siteUrl}${v.image}`,
      hasCertification: { "@id": `${site.siteUrl}/coas/${v.product.batch}#coa` },
      additionalProperty: [
        { "@type": "PropertyValue", name: "Batch number", value: v.product.batch },
        {
          "@type": "PropertyValue",
          name: "Purity",
          value: v.product.purity,
          measurementTechnique: "RP-HPLC with mass-spectrometry identity confirmation",
        },
      ],
      ...(isPurchasable(v.product) ? { offers: variantOffer(v) } : {}),
    })),
    ...(priced.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: Math.min(...priced.map((v) => v.price)),
            highPrice: Math.max(...priced.map((v) => v.price)),
            offerCount: priced.length,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificate of Analysis. The analytical data is the site's strongest E-E-A-T
// signal and was previously reachable only through a client-side search box —
// invisible to crawlers and to AI answer engines.
// ─────────────────────────────────────────────────────────────────────────────
export function certificationJsonLd(coa: Coa, batchUrl: string) {
  return {
    "@type": "Certification",
    "@id": `${batchUrl}#coa`,
    name: `Certificate of Analysis — ${coa.productName} batch ${coa.batch}`,
    certificationIdentification: coa.batch,
    certificationStatus: "https://schema.org/CertificationActive",
    issuedBy: { "@type": "Organization", name: coa.lab },
    auditDate: coa.testDate,
    datePublished: coa.releaseDate,
    url: batchUrl,
    about: { "@type": "Product", name: coa.productName },
  };
}

export function coaPageJsonLd(coa: Coa, batchUrl: string, productUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": batchUrl,
        url: batchUrl,
        name: `Certificate of Analysis — ${coa.productName} (Batch ${coa.batch})`,
        datePublished: coa.releaseDate,
        dateModified: coa.releaseDate,
        isPartOf: { "@id": `${site.siteUrl}#website` },
        publisher: { "@id": `${site.siteUrl}#organization` },
        mainEntity: { "@id": `${batchUrl}#coa` },
      },
      certificationJsonLd(coa, batchUrl),
      {
        "@type": "Product",
        "@id": `${batchUrl}#batch`,
        name: `${coa.productName} ${coa.mass} — Batch ${coa.batch}`,
        url: productUrl,
        brand: { "@type": "Brand", name: site.name },
        hasCertification: { "@id": `${batchUrl}#coa` },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Batch number", value: coa.batch },
          { "@type": "PropertyValue", name: "Appearance", value: coa.appearance },
          { "@type": "PropertyValue", name: "Testing laboratory", value: coa.lab },
          { "@type": "PropertyValue", name: "Test date", value: coa.testDate },
          ...coa.rows.map((r) => ({
            "@type": "PropertyValue",
            name: r.analyte,
            value: r.result,
            measurementTechnique: r.method,
            description: `Specification: ${r.spec} — ${r.pass ? "PASS" : "FAIL"}`,
          })),
        ],
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalog surfaces. ItemList is what makes a category page retrievable for
// "best/list of X" fan-out queries in AI search.
// ─────────────────────────────────────────────────────────────────────────────
export function collectionPageJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  families: { name: string; slug: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": opts.url,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${site.siteUrl}#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.families.length,
      itemListElement: opts.families.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: f.name,
        url: `${site.siteUrl}/shop/${f.slug}`,
      })),
    },
  };
}
