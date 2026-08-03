// ─────────────────────────────────────────────────────────────────────────────
// Per-family Q&A. Rendered visibly on the product page AND emitted as FAQPage
// JSON-LD from the same source, so the structured data can never describe
// content a visitor cannot see.
//
// COMPLIANCE: every answer is drawn from analytical, handling, or logistics
// facts. No therapeutic, human-use, dosing, or outcome language.
// ─────────────────────────────────────────────────────────────────────────────
import type { CatalogProductFamily } from "@/lib/catalog";
import type { FaqItem } from "@/lib/faq";
import { getProductDetail, DEFAULT_FORM, DEFAULT_STORAGE, TESTING_METHOD } from "@/lib/product-details";
import { site } from "@/lib/site";

export function buildProductFaqs(fam: CatalogProductFamily): FaqItem[] {
  const detail = getProductDetail(fam.id);
  const first = fam.variants[0];
  const strengths = fam.variants.map((v) => v.displayStrength);
  const strengthList =
    strengths.length > 1
      ? `${strengths.slice(0, -1).join(", ")} and ${strengths[strengths.length - 1]}`
      : strengths[0];

  const faqs: FaqItem[] = [
    {
      question: `What is ${fam.name}?`,
      answer: detail?.overview ?? fam.description,
    },
    {
      question: `How is ${fam.name} purity verified?`,
      answer: `Every lot is assayed by ${TESTING_METHOD.toLowerCase()}: RP-HPLC at 220 nm establishes chromatographic purity against a ${first.product.purity} release specification, and LC-MS confirms molecular identity against the reference mass. The batch currently shipping is ${first.product.batch}, and its full certificate — including methods, specifications, measured results, and the testing laboratory — is published at ${site.siteUrl}/coas/${first.product.batch}.`,
    },
    {
      question: `How should ${fam.name} be stored and handled?`,
      answer: `${detail?.form ?? DEFAULT_FORM}. ${DEFAULT_STORAGE} ${
        detail?.handling ??
        "Reconstitute with bacteriostatic water in a controlled laboratory setting; swirl gently rather than shaking to preserve peptide structure."
      }`,
    },
    {
      question: `What strengths of ${fam.name} are available?`,
      answer: `${fam.name} is supplied in ${strengthList}. Each presentation is filled from a tested lot and ships with its own batch number, so the certificate you retrieve always corresponds to the vial in your hand.`,
    },
    {
      question: `Is ${fam.name} intended for human use?`,
      answer: `No. ${fam.name} is supplied strictly for laboratory and in-vitro research use. It is not intended for human or veterinary consumption, diagnostic use, or therapeutic use, and RovaPeptides provides no dosing, protocol, or usage guidance.`,
    },
  ];

  return faqs;
}
