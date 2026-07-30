import type { Product } from "@/lib/products";
import { site } from "@/lib/site";

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.batch,
    image: `${site.siteUrl}${product.photo}`,
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    offers: {
      "@type": "Offer",
      url: `${site.siteUrl}/shop/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: site.name,
      },
    },
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
