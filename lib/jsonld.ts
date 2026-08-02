import { isPurchasable, type Product } from "@/lib/products";
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
