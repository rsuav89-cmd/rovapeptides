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
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { products, isPurchasable, PENDING_PRODUCT_RENDERS } from "../lib/products.ts";
import { FAMILIES } from "../lib/catalog-data.ts";
import { families, familiesInCollection } from "../lib/catalog.ts";
import { collections } from "../lib/collections.ts";
import { PRODUCT_DETAILS } from "../lib/product-details.ts";
import { faqCategories } from "../lib/faq.ts";
import { WOO_MAPPING, PENDING_WOO_IDS } from "../lib/woo-mapping.ts";
import * as siteNav from "../lib/site.ts";
import { COA_DATABASE, activeCoas, activeCoaForSlug, getCOAByBatch, getCOAsBySlug, isActiveCoa } from "../lib/coa.ts";
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
  const pending = new Set(PENDING_WOO_IDS);
  for (const p of products) {
    if (isPurchasable(p)) {
      check("purchasable SKU has a price", p.price > 0, `${p.id}`);
      // A SKU may be unmapped only if it is DECLARED unmapped. An undeclared
      // gap is a hard failure, because checkout would silently drop the line.
      check(
        "purchasable SKU is mapped to WooCommerce or declared pending",
        Boolean(WOO_MAPPING[p.id]) || pending.has(p.id),
        `${p.id} would vanish at checkout`
      );
    }
  }
  for (const slug of PENDING_WOO_IDS) {
    check("pending SKU still exists in the catalog", products.some((p) => p.id === slug), slug);
    check("pending SKU is not also mapped", !WOO_MAPPING[slug], slug);
  }
  const seenWooIds = new Map();
  for (const [slug, ref] of Object.entries(WOO_MAPPING)) {
    const key = `${ref.productId}:${ref.variationId ?? 0}`;
    check(
      "no two SKUs share a WooCommerce ID",
      !seenWooIds.has(key),
      `${slug} collides with ${seenWooIds.get(key)} on ${key}`
    );
    seenWooIds.set(key, slug);
    check("Woo product ID is a positive integer", Number.isInteger(ref.productId) && ref.productId > 0, slug);
  }

  const blocked = products.filter((p) => isPurchasable(p) && pending.has(p.id));
  warn(
    "every active SKU can reach WooCommerce",
    blocked.length === 0,
    `${blocked.length} priced SKU(s) awaiting a Woo product ID: ${blocked.map((p) => p.id).join(", ")}`
  );
  // Checkout add-ons exist in WooCommerce only — they are line items, not catalog SKUs.
  const WOO_ADDONS = new Set(["shipping-protection", "priority-handling"]);
  for (const slug of Object.keys(WOO_MAPPING))
    check(
      "Woo mapping points at a real SKU",
      WOO_ADDONS.has(slug) || products.some((p) => p.id === slug),
      `${slug}`
    );
  const unpriced = products.filter((p) => !isPurchasable(p)).length;
  check("no active SKU shows a pricing placeholder", unpriced === 0, `${unpriced} of ${products.length} SKUs are unpriced or out of stock`);
  for (const p of products) check("active SKU is flagged in stock", p.inStock === true, p.id);
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

// ── 9b. Mobile typography regressions (reported by users, Aug 2026) ────────
{
  // Product names must wrap, never clip: "TESAMORELI" / "BACTERIOST" were being
  // cut off inside 2-up cards on iPhone-width viewports.
  const TITLE_FILES = [
    ["components/catalog/ProductCard.tsx", "<h3"],
    ["components/catalog/FamilyCard.tsx", "<h3"],
    ["components/catalog/FamilyDetail.tsx", "<h1"],
  ];
  for (const [file, tag] of TITLE_FILES) {
    const src = read(join(ROOT, file));
    const start = src.indexOf(tag);
    const heading = src.slice(start, src.indexOf(">", start));
    check("product name wraps", /break-words/.test(heading), `${file} ${tag}`);
    check("product name is not clipped", !/truncate|line-clamp|whitespace-nowrap|text-ellipsis/.test(heading), `${file} ${tag}`);
  }

  // No element may clip a product name anywhere it is rendered.
  for (const file of ["components/cart/CartDrawer.tsx", "components/SearchOverlay.tsx", "components/catalog/FamilyDetail.tsx"]) {
    const src = read(join(ROOT, file));
    for (const line of src.split("\n")) {
      if (!/truncate/.test(line)) continue;
      check("no truncation on a product name", !/\{p\.name\}|\{family\.name\}|\{product\.name\}|line\.product\.name/.test(line), `${file} → ${line.trim().slice(0, 70)}`);
    }
  }

  // The decorative full-height column rules read as debug artifacts on mobile.
  const home = read(join(ROOT, "app/page.tsx"));
  check("no full-bleed column-rule overlay on the home page",
    !/last:border-r/.test(home), "app/page.tsx");

  // The home page renders a capped, curated grid; /shop/all stays complete.
  const homeSrc = read(join(ROOT, "app/page.tsx"));
  const allSrc = read(join(ROOT, "app/shop/all/page.tsx"));
  check("home catalog is capped", /<Catalog limit=\{\d+\}/.test(homeSrc), "app/page.tsx");
  check("full catalog page is uncapped", /<Catalog \/>/.test(allSrc), "app/shop/all/page.tsx");
  const catalogSrc = read(join(ROOT, "components/catalog/Catalog.tsx"));
  check("capped grid offers a view-all route", /href="\/shop/.test(catalogSrc), "components/catalog/Catalog.tsx");

  // Card grids must not go 2-up until a card is wide enough for a compound name.
  const catalog = read(join(ROOT, "components/catalog/Catalog.tsx"));
  const twoUp = catalog.match(/min-\[(\d+)px\]:grid-cols-2/);
  check("catalog grid stays single-column on phone widths",
    Boolean(twoUp) && Number(twoUp[1]) >= 480, twoUp ? `${twoUp[1]}px` : "no breakpoint found");
}

// ── 9c. Active catalog shape (locked to the 18-product realignment) ───────
{
  const EXPECTED_FAMILIES = 18;
  const EXPECTED_SKUS = 22;
  check("family count matches the active catalog", families.length === EXPECTED_FAMILIES, `${families.length}`);
  check("SKU count matches the active catalog", products.length === EXPECTED_SKUS, `${products.length}`);

  const PURGED = ["bpc-157-5mg", "tb-500", "semaglutide", "cjc-1295-5mg", "ipamorelin-5mg", "sermorelin-5mg"];
  for (const slug of PURGED)
    check("purged SKU is absent", !products.some((p) => p.id === slug), slug);
  for (const name of ["Tirzepatide", "Retatrutide", "Semaglutide", "Sermorelin"])
    check("renamed/purged compound is not a product name", !products.some((p) => p.name === name), name);

  const multi = families.find((f) => f.id === "glp-3");
  check("GLP-3 exposes three strengths", multi?.variants.length === 3, `${multi?.variants.length}`);
  check("GLP-3 strengths are 10/20/30 mg",
    multi?.variants.map((v) => v.displayStrength).join(",") === "10 mg,20 mg,30 mg",
    multi?.variants.map((v) => v.displayStrength).join(","));
  check("GLP-3 prices are 148/228/298",
    multi?.variants.map((v) => v.price).join(",") === "148,228,298",
    multi?.variants.map((v) => v.price).join(","));

  for (const col of collections)
    check("no collection is left empty", familiesInCollection(col.id).length > 0, col.slug);
}

// ── 9d. Shop browse experience (collection mosaic replaced by a filter bar) ─
{
  const landing = read(join(ROOT, "components/catalog/CatalogLanding.tsx"));
  check("shop landing renders the filter browser", landing.includes("<ShopBrowser"), "CatalogLanding.tsx");
  check("shop landing no longer renders the card mosaic", !landing.includes("CollectionCard"), "CatalogLanding.tsx");

  const browser = read(join(ROOT, "components/catalog/ShopBrowser.tsx"));
  check("browser filters in place rather than routing away", browser.includes("familiesInCollection"), "ShopBrowser.tsx");
  check("browser keeps a deep link to each collection route", browser.includes("/shop/collections/"), "ShopBrowser.tsx");
  check("browser announces the filtered count", browser.includes('aria-live="polite"'), "ShopBrowser.tsx");

  const bar = read(join(ROOT, "components/catalog/CollectionFilterBar.tsx"));
  check("filter pills expose pressed state", bar.includes("aria-pressed"), "CollectionFilterBar.tsx");
  check("filter pills show product counts", bar.includes("option.count"), "CollectionFilterBar.tsx");
  check("filter bar is a labelled group", bar.includes('aria-label="Filter by research collection"'), "CollectionFilterBar.tsx");

  // Category labels must stay short enough to sit on one line in a pill.
  for (const c of collections) {
    check("collection short name is at most three words",
      c.shortName.replace(/&/g, "").split(/\s+/).filter(Boolean).length <= 3,
      `${c.slug} → "${c.shortName}"`);
    check("collection short name is concise", c.shortName.length <= 28, `${c.slug} → "${c.shortName}"`);
  }
}

// ── 9e. Routes, navigation and assets (static half of the site audit) ──────
{
  // Build the real route table from the filesystem.
  const routes = new Set(["/"]);
  const dynamic = [];
  for (const file of walk(join(ROOT, "app"))) {
    const m = /app\/(.*)\/(page|route)\.tsx?$/.exec(file.replace(/\\/g, "/"));
    if (!m) continue;
    const path = "/" + m[1].replace(/\/\(.*?\)/g, "");
    if (path.includes("[")) dynamic.push(new RegExp("^" + path.replace(/\[[^\]]+\]/g, "[^/]+") + "$"));
    else routes.add(path === "/page" ? "/" : path);
  }
  const nextConfig = read(join(ROOT, "next.config.mjs"));
  const redirected = [...nextConfig.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1].split("/:")[0]);

  const resolves = (href) => {
    if (!href.startsWith("/")) return true; // external / mailto / anchors handled below
    const path = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
    return (
      routes.has(path) ||
      dynamic.some((re) => re.test(path)) ||
      redirected.some((r) => path === r || path.startsWith(r + "/"))
    );
  };

  const { primaryNav, utilityNav, headerUtilityLinks } = siteNav;
  check("primary navigation is consolidated to four links", primaryNav.length === 4, `${primaryNav.length} links`);
  check("primary navigation has no duplicate destinations",
    new Set(primaryNav.map((n) => n.href)).size === primaryNav.length,
    primaryNav.map((n) => n.href).join(", "));
  for (const item of [...primaryNav, ...utilityNav, ...headerUtilityLinks])
    check("nav link resolves to a real route", resolves(item.href), `${item.label} → ${item.href}`);

  // Footer link table is a literal in the component; extract and verify it.
  const footer = read(join(ROOT, "components/Footer.tsx"));
  for (const href of [...footer.matchAll(/href:\s*"(\/[^"]*)"/g)].map((m) => m[1]))
    check("footer link resolves to a real route", resolves(href), href);

  // Any ?collection= link must name a collection that exists.
  for (const href of [...footer.matchAll(/\/shop\?collection=([a-z0-9-]+)/g)].map((m) => m[1]))
    check("footer collection filter targets a real collection",
      collections.some((c) => c.slug === href), href);

  // Product renders must exist on disk, or the card shows a broken image.
  const pendingRenders = new Set(PENDING_PRODUCT_RENDERS);
  const missingRenders = [];
  for (const p of products) {
    for (const src of new Set([p.image, p.photo])) {
      const onDisk = existsSync(join(ROOT, "public", src));
      if (!onDisk) missingRenders.push(`${p.id} → ${src}`);
      check(
        "product image exists or is declared pending",
        onDisk || pendingRenders.has(p.id),
        `${p.id} → ${src}`
      );
    }
  }
  warn("every product has a render", missingRenders.length === 0, missingRenders.join(", "));
  for (const id of PENDING_PRODUCT_RENDERS)
    check("pending render still refers to a live SKU", products.some((p) => p.id === id), id);

  // useSearchParams outside a Suspense boundary de-opts the route to CSR and
  // fails a production build.
  for (const file of SOURCES.filter((x) => x.endsWith(".tsx"))) {
    if (!read(file).includes("useSearchParams")) continue;
    const name = file.split("/").pop().replace(".tsx", "");
    const consumers = SOURCES.filter((x) => read(x).includes(`<${name}`) && x !== file);
    check("useSearchParams consumer is wrapped in Suspense",
      consumers.length === 0 || consumers.some((x) => read(x).includes("Suspense")),
      rel(file));
  }

  // Every mapped JSX list needs a key or React logs a console error.
  for (const file of SOURCES.filter((x) => x.endsWith(".tsx"))) {
    const src = read(file);
    const maps = [...src.matchAll(/\.map\(\([^)]*\)\s*=>\s*\(?\s*<([A-Za-z][\w.]*)/g)];
    for (const m of maps) {
      const tail = src.slice(m.index, m.index + 600);
      check("mapped JSX element declares a key", /key=/.test(tail), `${rel(file)} → <${m[1]}>`);
    }
  }
}

// ── 9f. Checkout architecture (Order Pay migration) ────────────────────────
{
  const route = read(join(ROOT, "app/api/checkout/route.ts"));
  const drawer = read(join(ROOT, "components/cart/CartDrawer.tsx"));

  check("checkout creates a pending order", /status:\s*"pending"/.test(route), "route.ts");
  check("checkout does not mark the order paid", /set_paid:\s*false/.test(route), "route.ts");
  check("checkout returns the order payment URL", route.includes("payment_url") && route.includes("checkoutUrl"), "route.ts");
  check("checkout posts to the WooCommerce orders endpoint", /\/orders/.test(route), "route.ts");

  // Prices must come from WooCommerce, never from the browser.
  check("checkout never accepts a client-supplied price",
    !/\bprice\b|\btotal\b|subtotal/i.test(route.split("line_items")[0] ?? route), "route.ts");

  // Credentials belong in the Authorization header, not in a logged URL.
  check("basic auth is the default transport", route.includes("Authorization"), "route.ts");

  // Production is configured with WOOCOMMERCE_* names. Dropping either alias
  // silently 500s live checkout, so both are pinned by assertion.
  for (const name of [
    "WC_CONSUMER_KEY", "WOOCOMMERCE_CONSUMER_KEY",
    "WC_CONSUMER_SECRET", "WOOCOMMERCE_CONSUMER_SECRET",
    "WC_API_URL", "NEXT_PUBLIC_WORDPRESS_URL",
  ]) {
    check("checkout accepts env alias", route.includes(`process.env.${name}`), name);
    check("env alias is documented", read(join(ROOT, ".env.example")).includes(name), name);
  }
  check("a bare site root is normalised to a REST base",
    route.includes("wp-json/wc/v3") && route.includes("toRestBase"), "route.ts");
  check("query-string auth is opt-in only",
    !route.includes("consumer_key") || route.includes("WC_AUTH_IN_QUERY"), "route.ts");

  // POST /orders is not idempotent — a retry can create duplicate orders.
  check("order creation is not retried", !/for\s*\(.*attempt|retries?\s*[<>]/i.test(route), "route.ts");
  check("order creation has a timeout", route.includes("AbortController"), "route.ts");

  // The store's raw error must not reach the browser.
  check("store errors are not forwarded verbatim",
    !/error:\s*payload\?\.message/.test(route), "route.ts");

  // The drawer must consume JSON, not submit a cross-domain form.
  check("drawer calls the checkout API with fetch", drawer.includes('fetch("/api/checkout"'), "CartDrawer.tsx");
  check("drawer redirects to the returned URL", drawer.includes("window.location.href = data.checkoutUrl"), "CartDrawer.tsx");
  check("drawer no longer builds a form POST",
    !drawer.includes('document.createElement("form")'), "CartDrawer.tsx");
  check("drawer surfaces checkout failures", drawer.includes("setRedirecting(false)"), "CartDrawer.tsx");
}

// ── 10. Certificate database integrity ─────────────────────────────────────
{
  // Every SKU must resolve to a record — active or explicitly pending. Silence
  // is the failure mode this replaces.
  for (const p of products) {
    const records = getCOAsBySlug(p.id);
    check("SKU has a COA record", records.length > 0, p.id);
    for (const r of records) {
      check("record points back at its SKU", r.productSlug === p.id, `${p.id} → ${r.productSlug}`);
      check("record has a batch number", r.batchNumber.trim().length > 0, p.id);
      check("record names a laboratory", r.testingLab.trim().length > 0, p.id);
    }
  }

  const active = activeCoas();
  for (const coa of active) {
    check("active COA has results", coa.labResults.length > 0, coa.batchNumber);
    check("active COA is not flagged pending", coa.isPending !== true, coa.batchNumber);
    check("active COA has a real test date", /^\d{4}-\d{2}-\d{2}$/.test(coa.testDate), `${coa.batchNumber} → ${coa.testDate}`);
    check("active COA reports a purity figure", typeof coa.purityPercentage === "number", coa.batchNumber);
    check("active COA batch is URL-safe", /^[A-Za-z0-9._~-]+$/.test(coa.batchNumber), coa.batchNumber);
    check("lookup by batch resolves", getCOAByBatch(coa.batchNumber)?.batchNumber === coa.batchNumber, coa.batchNumber);
    check("lookup is case-insensitive", Boolean(getCOAByBatch(coa.batchNumber.toLowerCase())), coa.batchNumber);
    for (const row of coa.labResults) {
      check("result row is complete",
        Boolean(row.analyte && row.specification && row.result), `${coa.batchNumber} → ${row.analyte}`);
      check("published certificate has no failing analyte", row.passed === true, `${coa.batchNumber} → ${row.analyte}`);
    }
  }

  // A pending record must never look like evidence.
  for (const records of Object.values(COA_DATABASE)) {
    for (const r of records) {
      if (isActiveCoa(r)) continue;
      check("pending record publishes no results", r.labResults.length === 0, r.batchNumber);
      check("pending record publishes no purity figure", r.purityPercentage === null, r.batchNumber);
      check("pending record publishes no PDF", r.pdfUrl === null, r.batchNumber);
      check("pending record is flagged", r.isPending === true, r.batchNumber);
      check("pending batch earns no certificate page",
        !activeCoas().some((a) => a.batchNumber === r.batchNumber), r.batchNumber);
    }
  }

  check("unknown batch returns undefined", getCOAByBatch("NOPE-0000") === undefined);
  check("at least one certificate is on file", active.length > 0);
  warn(
    "every SKU has a certificate on file",
    products.every((p) => activeCoaForSlug(p.id)),
    `${products.filter((p) => !activeCoaForSlug(p.id)).length} of ${products.length} SKUs are awaiting a certificate`
  );
}

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
        check("variant node is well formed", Boolean(v.sku && v.name), `${fam.slug} → ${v.sku}`);
    } else {
      const ld = productJsonLd(fam.variants[0].product, opts);
      check("Product sku is the stable id, not the batch",
        ld.sku === fam.variants[0].product.id, fam.slug);
      check("Offer is present only when purchasable",
        Boolean(ld.offers) === isPurchasable(fam.variants[0].product), fam.slug);
      if (ld.offers) check("Offer url is canonical", ld.offers.url === url, fam.slug);
    }
  }

  const coa = activeCoas()[0];
  const graph = coaPageJsonLd(coa, `https://rovapeptides.com/coas/${coa.batchNumber}`, "https://rovapeptides.com/shop/x")["@graph"];
  check("COA page emits WebPage + Certification + Product", graph.length === 3);
  check("Certification is the page's main entity",
    graph[0].mainEntity["@id"] === graph[1]["@id"]);
  check("Certification carries the batch id", graph[1].certificationIdentification === coa.batchNumber);
  check("every analyte is exposed as a PropertyValue",
    graph[2].additionalProperty.length >= coa.labResults.length + 3);

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
  for (const coa of activeCoas())
    check("sitemap lists every certificate on file", urls.includes(`https://rovapeptides.com/coas/${coa.batchNumber}`), coa.batchNumber);
  for (const records of Object.values(COA_DATABASE))
    for (const r of records)
      if (!isActiveCoa(r))
        check("sitemap omits pending certificates",
          !urls.some((u) => u.endsWith(`/coas/${r.batchNumber}`)), r.batchNumber);
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
