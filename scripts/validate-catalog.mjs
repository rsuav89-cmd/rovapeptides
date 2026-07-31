// ─────────────────────────────────────────────────────────────────────────────
// ROVA catalog integrity validator — operates on REAL imported data structures.
// Run: `npm run validate:catalog`  (node --experimental-strip-types)
//
// This is plain JS (kept out of the tsc graph) that imports the actual TypeScript
// source modules; Node strips their types at load. No regex/text parsing — every
// check runs against the same objects the app renders.
// ─────────────────────────────────────────────────────────────────────────────
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { products, getPurchaseEligibility } from "../lib/products.ts";
import { FAMILIES } from "../lib/catalog-data.ts";
import { collections } from "../lib/collections.ts";

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const skuIds = new Set(products.map((p) => p.id));
const collIds = new Set(collections.map((c) => c.id));

// unique slugs
{
  const seen = new Set();
  for (const f of FAMILIES) {
    if (seen.has(f.id)) fail(`Duplicate family slug: ${f.id}`);
    seen.add(f.id);
  }
}
{
  const seen = new Set();
  for (const c of collections) {
    if (seen.has(c.slug)) fail(`Duplicate collection slug: ${c.slug}`);
    seen.add(c.slug);
  }
}

// SKU ↔ family: every SKU in exactly one family; families reference real SKUs
const skuToFamily = new Map();
for (const f of FAMILIES) {
  if (!f.skus?.length) fail(`Family "${f.id}" has no variants.`);
  if (!collIds.has(f.primary)) fail(`Family "${f.id}" has invalid primary collection: ${f.primary}`);
  for (const s of f.secondary ?? []) {
    if (!collIds.has(s)) fail(`Family "${f.id}" has invalid secondary collection: ${s}`);
  }
  for (const s of f.skus) {
    if (!skuIds.has(s)) fail(`Family "${f.id}" references non-existent SKU: ${s}`);
    if (skuToFamily.has(s)) fail(`SKU "${s}" is claimed by two families: ${skuToFamily.get(s)} and ${f.id}`);
    skuToFamily.set(s, f.id);
  }
}
for (const id of skuIds) {
  if (!skuToFamily.has(id)) fail(`SKU "${id}" is not assigned to any family (LOST PRODUCT).`);
}

// pricing eligibility consistency + image resolution (real getPurchaseEligibility)
let unpriced = 0;
for (const p of products) {
  const elig = getPurchaseEligibility(p);
  if (p.price <= 0) {
    unpriced++;
    if (elig.purchasable) fail(`Unpriced SKU "${p.id}" reports purchasable — would send $0 to checkout.`);
  }
  if (p.price > 0 && !elig.purchasable) fail(`Priced SKU "${p.id}" reports NOT purchasable.`);
  const imgPath = resolve(process.cwd(), "public" + p.image);
  if (!existsSync(imgPath)) fail(`SKU "${p.id}" image missing: public${p.image}`);
}
if (unpriced > 0) {
  warn(`${unpriced} SKU(s) unpriced ($0) → shown as "Pricing coming soon" and guarded from cart/checkout. Set real prices before selling.`);
}

console.log(`\nROVA catalog validation (real imported data)`);
console.log(`  SKUs (source):    ${products.length}`);
console.log(`  Product families: ${FAMILIES.length}`);
console.log(`  Collections:      ${collections.length}`);
console.log(`  Unpriced SKUs:    ${unpriced}`);
for (const w of warnings) console.log(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`\n✗ FAILED with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`\n✓ PASSED — every SKU maps to exactly one family; eligibility is consistent; all images resolve.\n`);
