// ─────────────────────────────────────────────────────────────────────────────
// ROVA QA verification suite — runs against the REAL data modules plus a set of
// source-level contracts that encode the accessibility, SEO, and compliance
// guarantees this codebase is supposed to hold.
//
// Run: `npm run qa`   (node --experimental-strip-types)
//
// This is the server-less half of the QA story: it needs no build and no dev
// server, so it can run in CI on every commit. Browser-level flows live in
// tests/e2e/*.spec.ts and require `npm run test:e2e` against a running app.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { products, isPurchasable } from "../lib/products.ts";
import { FAMILIES } from "../lib/catalog-data.ts";
import { families } from "../lib/catalog.ts";
import { collections } from "../lib/collections.ts";
import { PRODUCT_DETAILS } from "../lib/product-details.ts";
import { faqCategories } from "../lib/faq.ts";
import { WOO_MAPPING } from "../lib/woo-mapping.ts";
import { getCoa } from "../lib/coa.ts";
import { buildProductFaqs } from "../lib/product-faq.ts";
import {
  productJsonLd,
  productGroupJsonLd,
  coaPageJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
} from "../lib/jsonld.ts";
import sitemap from "../app/sitemap.ts";
import { GET as llmsTxt } from "../app/llms.txt/route.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const warnings = [];
let checks = 0;

const check = (name, condition, detail = "") => {
  checks += 1;
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
};
const warn = (name, condition, detail = "") => {
  checks += 1;
  if (!condition) warnings.push(`${name}${detail ? ` — ${detail}` : ""}`);
};

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git" || entry === "_to_delete")
      continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|css)$/.test(full)) out.push(full);
  }
  return out;
}
const SOURCES = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components"))];
const read = (f) => readFileSync(f, "utf8");
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const rel = (f) => relative(ROOT, f);

// ── 1. Catalog / detail coverage ────────────────────────────────────────────
{
  const famIds = new Set(FAMILIES.map((f) => f.id));
  const detailIds = new Set(Object.keys(PRODUCT_DETAILS));
  for (const id of famIds)
    check("product-details coverage", detailIds.has(id), `family "${id}" has no PRODUCT_DETAILS entry`);
  for (const id of detailIds)
    check("product-details orphan", famIds.has(id), `PRODUCT_DETAILS key "${id}" matches no family`);
}

// ── 2. Batch numbers are unique and URL-safe (they are route params) ────────
{
  const seen = new Map();
  for (const p of products) {
    check("batch uniqueness", !seen.has(p.batch), `${p.batch} used by ${seen.get(p.batch)} and ${p.id}`);
    seen.set(p.batch, p.id);
    check("batch is URL-safe", /^[A-Za-z0-9._~-]+$/.test(p.batch), `${p.batch} (${p.id}) needs encoding`);
  }
}

// ── 3. Commerce integrity ───────────────────────────────────────────────────
{
  for (const p of products) {
    if (isPurchasable(p)) {
      check("purchasable SKU has a price", p.price > 0, `${p.id}`);
      check("purchasable SKU is mapped to WooCommerce", Boolean(WOO_MAPPING[p.id]), `${p.id} would vanish at checkout`);
    }
  }
  // Checkout add-ons exist in WooCommerce only — they are line items, not catalog SKUs.
  const WOO_ADDONS = new Set(["shipping-protection", "priority-handling"]);
  for (const slug of Object.keys(WOO_MAPPING))
    check(
      "Woo mapping points at a real SKU",
      WOO_ADDONS.has(slug) || products.some((p) => p.id === slug),
      `${slug}`
    );
  const unpriced = products.filter((p) => !isPurchasable(p)).length;
  warn("catalog is fully priced", unpriced === 0, `${unpriced} of ${products.length} SKUs are unpriced`);
}

// ── 4. Aggregate pricing used by ProductGroup schema ────────────────────────
for (const fam of families) {
  if (!fam.hasPricing) continue;
  check("family price range is coherent", fam.minPrice > 0 && fam.maxPrice >= fam.minPrice, `${fam.slug}`);
}

// ── 5. FAQ integrity ────────────────────────────────────────────────────────
{
  const seen = new Set();
  let count = 0;
  for (const cat of faqCategories) {
    check("FAQ category has items", cat.items.length > 0, cat.title);
    for (const item of cat.items) {
      count += 1;
      check("FAQ question is unique", !seen.has(item.question), item.question.slice(0, 48));
      seen.add(item.question);
      check("FAQ question is a question", item.question.trim().endsWith("?"), item.question.slice(0, 48));
      check("FAQ answer is substantive", item.answer.trim().length >= 80, item.question.slice(0, 48));
    }
  }
  check("FAQ matrix is broad enough for GEO", count >= 30, `${count} entries`);
}

// ── 6. RUO compliance in rendered copy (comments excluded) ──────────────────
{
  // Terms that may never appear in customer-facing strings. Disclaimers are
  // allowed to negate them, so lines that also carry a negation are exempt.
  const BANNED = /\b(dosage|dosing|therapeutic|treats?|cures?|prescription|patients?)\b/i;
  const NEGATED = /\b(not|no|never|nothing|avoids?|without|neither)\b/i;
  const COPY_FILES = [
    "lib/products.ts", "lib/product-details.ts",
    "lib/collections.ts", "lib/product-faq.ts",
  ];
  for (const f of COPY_FILES) {
    const lines = stripComments(read(join(ROOT, f))).split("\n");
    lines.forEach((line, i) => {
      if (!BANNED.test(line) || NEGATED.test(line)) return;
      check("RUO compliance", false, `${f}:${i + 1} → ${line.trim().slice(0, 90)}`);
    });
  }

  // The FAQ is checked as whole Q&A units rather than source lines: a question
  // may legitimately name a banned term ("Do you provide dosing guidance?") so
  // long as its answer refuses it.
  for (const cat of faqCategories) {
    for (const item of cat.items) {
      const unit = `${item.question} ${item.answer}`;
      if (!BANNED.test(unit)) continue;
      check(
        "RUO compliance (FAQ)",
        NEGATED.test(item.answer),
        `"${item.question.slice(0, 60)}" names a restricted term without refusing it`
      );
    }
  }
}

// ── 7. Accessibility contracts ──────────────────────────────────────────────
{
  for (const f of SOURCES.filter((s) => s.endsWith("page.tsx"))) {
    const s = read(f);
    if (!s.includes("<main")) continue;
    check("main landmark has skip-link target", s.includes('id="main-content"'), rel(f));
    check("main landmark is focusable by the skip link", s.includes("tabIndex={-1}"), rel(f));
  }
  for (const f of SOURCES.filter((s) => s.endsWith(".tsx"))) {
    const s = read(f);
    if (s.includes('role="dialog"')) {
      check("dialog declares aria-modal", s.includes('aria-modal'), rel(f));
      check("dialog has an accessible name", /aria-label|aria-labelledby/.test(s), rel(f));
      check("dialog uses the shared focus trap", s.includes("useModal"), rel(f));
    }
    check("no ARIA tablist without tabpanels", !s.includes('role="tablist"') || s.includes('role="tabpanel"'), rel(f));
    check("no raw <img> (next/image only)", !/<img\s/.test(stripComments(s)), rel(f));
    check("no click-only navigation on non-interactive elements", !/<article[^>]*\sonClick=/.test(s), rel(f));
  }
}

// ── 8. SEO contracts ────────────────────────────────────────────────────────
{
  for (const f of SOURCES.filter((s) => s.endsWith("page.tsx"))) {
    const s = read(f);
    if (!/export (const metadata|function generateMetadata)/.test(s)) continue;
    check("route declares a canonical", s.includes("alternates:"), rel(f));
  }
  const sitemap = read(join(ROOT, "app/sitemap.ts"));
  check("sitemap includes COA batch pages", sitemap.includes("/coas/"), "app/sitemap.ts");
  check("sitemap includes collections", sitemap.includes("collections"), "app/sitemap.ts");
  const jsonld = read(join(ROOT, "lib/jsonld.ts"));
  for (const fn of ["productJsonLd", "productGroupJsonLd", "faqPageJsonLd", "breadcrumbJsonLd", "coaPageJsonLd", "collectionPageJsonLd"])
    check("jsonld builder exists", jsonld.includes(`export function ${fn}`), fn);
  check("no fabricated review data in schema", !/aggregateRating|"@type":\s*"Review"/.test(jsonld), "lib/jsonld.ts");
}

// ── 9. Collections ──────────────────────────────────────────────────────────
{
  const slugs = new Set();
  for (const c of collections) {
    check("collection slug is unique", !slugs.has(c.slug), c.slug);
    slugs.add(c.slug);
    check("collection has SEO metadata", Boolean(c.seoTitle && c.seoDescription), c.slug);
  }
}

// ── 10. Certificates resolve for every batch in the catalog ────────────────
for (const p of products) {
  const coa = getCoa(p.batch);
  check("COA resolves for batch", Boolean(coa), p.batch);
  if (!coa) continue;
  check("COA is case-insensitive", Boolean(getCoa(p.batch.toLowerCase())), p.batch);
  check("COA reports a full analyte panel", coa.rows.length >= 7, `${p.batch} has ${coa.rows.length} rows`);
  check("COA rows all pass on a released batch", coa.rows.every((r) => r.pass), p.batch);
  check("COA names the testing laboratory", coa.lab.length > 0, p.batch);
  check("COA carries a test date", /^\d{4}-\d{2}-\d{2}$/.test(coa.testDate), `${p.batch} → ${coa.testDate}`);
}
check("unknown batch returns null", getCoa("RV-NOPE-0000") === null);

// ── 11. Structured data builders produce valid graphs ──────────────────────
{
  for (const fam of families) {
    const url = `https://rovapeptides.com/shop/${fam.slug}`;
    const opts = { url, description: fam.description, specs: [{ name: "Format", value: "Lyophilized powder" }] };

    if (fam.variants.length > 1) {
      const ld = productGroupJsonLd(fam, opts);
      check("ProductGroup declares variants", ld.hasVariant.length === fam.variants.length, fam.slug);
      check("ProductGroup variesBy is set", Array.isArray(ld.variesBy) && ld.variesBy.length > 0, fam.slug);
      const priced = fam.variants.filter((v) => isPurchasable(v.product));
      check("unpriced variants emit no Offer",
        ld.hasVariant.filter((v) => v.offers).length === priced.length, fam.slug);
      if (priced.length) {
        check("AggregateOffer range is ordered", ld.offers.lowPrice <= ld.offers.highPrice, fam.slug);
        check("AggregateOffer counts only priced variants", ld.offers.offerCount === priced.length, fam.slug);
      } else {
        check("no AggregateOffer without prices", ld.offers === undefined, fam.slug);
      }
      for (const v of ld.hasVariant)
        check("variant links its certificate", Boolean(v.hasCertification?.["@id"]), `${fam.slug} → ${v.sku}`);
    } else {
      const ld = productJsonLd(fam.variants[0].product, opts);
      check("Product sku is the stable id, not the batch",
        ld.sku === fam.variants[0].product.id, fam.slug);
      check("Offer is present only when purchasable",
        Boolean(ld.offers) === isPurchasable(fam.variants[0].product), fam.slug);
      if (ld.offers) check("Offer url is canonical", ld.offers.url === url, fam.slug);
    }
  }

  const coa = getCoa(products[0].batch);
  const graph = coaPageJsonLd(coa, `https://rovapeptides.com/coas/${coa.batch}`, "https://rovapeptides.com/shop/x")["@graph"];
  check("COA page emits WebPage + Certification + Product", graph.length === 3);
  check("Certification is the page's main entity",
    graph[0].mainEntity["@id"] === graph[1]["@id"]);
  check("Certification carries the batch id", graph[1].certificationIdentification === coa.batch);
  check("every analyte is exposed as a PropertyValue",
    graph[2].additionalProperty.length >= coa.rows.length + 4);

  const cp = collectionPageJsonLd({
    url: "https://rovapeptides.com/shop/all", name: "All", description: "d",
    families: families.map((f) => ({ name: f.name, slug: f.slug })),
  });
  check("ItemList counts match", cp.mainEntity.numberOfItems === families.length);
  check("ItemList positions are 1-based and sequential",
    cp.mainEntity.itemListElement.every((li, i) => li.position === i + 1));
}

// ── 12. Per-family FAQ (rendered on the page AND emitted as FAQPage) ───────
{
  const BANNED_FAQ = /\b(dosage|therapeutic|cures?|prescription)\b/i;
  for (const fam of families) {
    const faqs = buildProductFaqs(fam);
    check("family FAQ has entries", faqs.length >= 4, fam.slug);
    for (const item of faqs) {
      check("family FAQ question is a question", item.question.endsWith("?"), `${fam.slug}: ${item.question}`);
      check("family FAQ answer is substantive", item.answer.trim().length >= 60, `${fam.slug}: ${item.question}`);
      check("family FAQ stays RUO-compliant", !BANNED_FAQ.test(item.answer) || /\bnot?\b|never/i.test(item.answer),
        `${fam.slug}: ${item.question}`);
    }
    const ld = faqPageJsonLd(faqs);
    check("FAQPage mainEntity matches rendered Q&A", ld.mainEntity.length === faqs.length, fam.slug);
    check("FAQPage answers are populated",
      ld.mainEntity.every((q) => q.acceptedAnswer?.text?.length > 0), fam.slug);
  }
}

// ── 13. Sitemap ────────────────────────────────────────────────────────────
{
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  check("sitemap URLs are unique", new Set(urls).size === urls.length,
    `${urls.length - new Set(urls).size} duplicate(s)`);
  for (const fam of families)
    check("sitemap lists every family", urls.includes(`https://rovapeptides.com/shop/${fam.slug}`), fam.slug);
  for (const c of collections)
    check("sitemap lists every collection", urls.includes(`https://rovapeptides.com/shop/collections/${c.slug}`), c.slug);
  for (const p of products)
    check("sitemap lists every certificate", urls.includes(`https://rovapeptides.com/coas/${p.batch}`), p.batch);
  check("sitemap excludes noindex routes", !urls.some((u) => u.endsWith("/track-order")));
  check("all sitemap URLs are absolute", urls.every((u) => u.startsWith("https://")));
}

// ── 14. /llms.txt route ────────────────────────────────────────────────────
{
  const res = llmsTxt();
  check("llms.txt responds", res instanceof Response);
  check("llms.txt is plain text", (res.headers.get("content-type") || "").includes("text/plain"));
  const body = await res.text();
  check("llms.txt states the RUO constraint", /research use only/i.test(body));
  check("llms.txt documents the analytical methodology", /RP-HPLC|HPLC/.test(body) && /LC-MS|mass spec/i.test(body));
  check("llms.txt exposes the certificate URL pattern", body.includes("/coas/"));
  for (const fam of families)
    check("llms.txt lists every family", body.includes(fam.name), fam.name);
  for (const c of collections)
    check("llms.txt lists every collection", body.includes(c.slug), c.slug);
}

// ── Report ──────────────────────────────────────────────────────────────────
const line = "─".repeat(64);
console.log(line);
console.log(`ROVA QA — ${checks} assertions`);
console.log(line);
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  · ${w}`);
}
if (failures.length) {
  console.log(`\n✗ ${failures.length} failure(s):`);
  for (const f of failures) console.log(`  · ${f}`);
  console.log(`\n${line}`);
  process.exit(1);
}
console.log(`\n✓ all ${checks} assertions passed`);
console.log(line);
