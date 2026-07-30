export type FaqItem = { question: string; answer: string };
export type FaqCategory = { title: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    title: "Product Quality",
    items: [
      {
        question: "What purity standard do your research compounds meet?",
        answer: "Every batch is manufactured to a minimum of 99% purity and verified by third-party HPLC / mass-spectrometry testing before it ships.",
      },
      {
        question: "Do you provide a Certificate of Analysis (COA)?",
        answer: "Yes. Each batch number listed on a product page corresponds to a COA you can look up on our COA Lookup page.",
      },
      {
        question: "How should these compounds be stored prior to use?",
        answer: "Store lyophilized powders at -20 degrees C, protected from light, until they are needed for laboratory research use.",
      },
      {
        question: "Are your products intended for human or veterinary use?",
        answer: "No. All items are sold strictly for laboratory research use only and are not intended for human or veterinary consumption, diagnostic use, or therapeutic use.",
      },
      ],
  },
  {
    title: "Storage & Reconstitution",
    items: [
      {
        question: "What is bacteriostatic water used for?",
        answer: "It is sterile water containing 0.9% benzyl alcohol, commonly used in laboratory settings to reconstitute lyophilized powders for research applications.",
      },
      {
        question: "How long is a reconstituted research compound stable?",
        answer: "Stability varies by compound. As a general laboratory guideline, reconstituted solutions should be refrigerated and used within your institution's protocol window.",
      },
      {
        question: "Can unopened vials be shipped at room temperature?",
        answer: "Lyophilized (freeze-dried) research powders are generally stable at room temperature in transit, but should be moved to -20 degree C storage promptly upon arrival.",
      },
      {
        question: "Do you offer bulk laboratory quantities?",
        answer: "Yes. Contact our support team with your research institution details for bulk pricing.",
      },
      ],
  },
  {
    title: "Ordering & Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit and debit cards along with other secure checkout methods available at checkout.",
      },
      {
        question: "Can I modify or cancel an order after placing it?",
        answer: "Contact our support team as soon as possible. Orders that have not yet shipped can usually be adjusted or canceled.",
      },
      {
        question: "Do you require a research or institutional affiliation to order?",
        answer: "Products are sold to qualified researchers and institutions for laboratory use only. By ordering, you confirm the products will be used accordingly.",
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes. All transactions are processed over an encrypted, secure checkout connection.",
      },
      ],
  },
  {
    title: "Shipping & Packaging",
    items: [
      {
        question: "How is my order packaged?",
        answer: "Orders ship in discreet, unmarked packaging with cold-chain materials included whenever a compound benefits from temperature protection in transit.",
      },
      {
        question: "How long does shipping take?",
        answer: "Most orders ship within 1-2 business days and arrive within the timeframe shown at checkout for your selected shipping method.",
      },
      {
        question: "Do you offer shipping protection?",
        answer: "Yes. You can add Shipping Protection or Priority Handling to your order at checkout for added peace of mind.",
      },
      {
        question: "Do you ship internationally?",
        answer: "Availability depends on destination regulations for laboratory research materials. Please contact support to confirm availability for your region.",
      },
      ],
  },
  ];
