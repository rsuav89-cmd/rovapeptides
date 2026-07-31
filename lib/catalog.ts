// ─────────────────────────────────────────────────────────────────────────────
// ROVA catalog adapter — NON-DESTRUCTIVE presentation layer over lib/products.ts.
//
// It groups the authoritative source SKUs (products[]) into canonical product
// families + variants and assigns research collections, WITHOUT mutating,
// duplicating, or renaming any commerce record. Source `product.id` remains the
// single grouping key and the exact value submitted to the cart.
//
// Grouping is DECLARED by immutable source IDs (FAMILIES below), never inferred
// from display names. Blends are kept as their own families (never merged into a
// component compound). If a SKU is not listed here, validate:catalog fails.
// ─────────────────────────────────────────────────────────────────────────────

import { products, isPurchasable, type Product } from "./products";
import type { CollectionId } from "./collections";
import { collections } from "./collections";

// Zero-price policy lives in lib/products.ts (leaf). Re-exported for convenience.
export { isPurchasable, ALLOW_ZERO_PRICE_IDS, priceLabel } from "./products";

import { FAMILIES, type FamilyDef } from "./catalog-data";

// ── Derived, resolved catalog model ──────────────────────────────────────────
export type StructuredAmount = { value: number; unit: string };

export type CatalogVariant = {
  product: Product; // the authoritative source record (unchanged)
  sourceId: string; // === product.id, submitted to cart verbatim
  slug: string;
  displayStrength: string;
  amounts: StructuredAmount[];
  unit: string | null;
  price: number;
  currency: "USD";
  image: string;
  available: boolean; // purchasable (non-zero price / allow-listed)
};

export type CatalogProductFamily = {
  id: string;
  name: string;
  slug: string;
  primaryCollectionId: CollectionId;
  secondaryCollectionIds: CollectionId[];
  variants: CatalogVariant[];
  isBlend: boolean;
  featured: boolean;
  confidence: "high" | "medium";
  subtitle: string;
  description: string;
  representativeImage: string;
  aliases: string[];
  searchText: string;
  // pricing (over PURCHASABLE variants only)
  minPrice: number | null;
  maxPrice: number | null;
  hasPricing: boolean;
  // strength summary
  strengthSummary: string;
};

const UNIT_RE = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|iu|ml)\b/gi;

function parseAmounts(mass: string): { amounts: StructuredAmount[]; unit: string | null } {
  const amounts: StructuredAmount[] = [];
  let m: RegExpExecArray | null;
  UNIT_RE.lastIndex = 0;
  while ((m = UNIT_RE.exec(mass)) !== null) {
    amounts.push({ value: Number(m[1].replace(",", "")), unit: normalizeUnit(m[2]) });
  }
  const unit = amounts.length > 0 ? amounts[0].unit : null;
  return { amounts, unit };
}

function normalizeUnit(u: string): string {
  const lower = u.toLowerCase();
  if (lower === "iu") return "IU";
  if (lower === "ml") return "mL";
  return lower; // mg, mcg
}

/** Search normalization: lowercase, strip punctuation to spaces, collapse. */
export function normalizeSearch(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function buildVariant(product: Product): CatalogVariant {
  const { amounts, unit } = parseAmounts(product.mass);
  return {
    product,
    sourceId: product.id,
    slug: product.id,
    displayStrength: product.mass,
    amounts,
    unit,
    price: product.price,
    currency: "USD",
    image: product.photo,
    available: isPurchasable(product),
  };
}

function strengthSummary(variants: CatalogVariant[]): string {
  if (variants.length === 1) return variants[0].displayStrength;
  if (variants.length <= 3) return variants.map((v) => v.displayStrength).join(" · ");
  return `${variants.length} strengths available`;
}

function buildFamily(def: FamilyDef): CatalogProductFamily {
  const variants = def.skus.map((id) => {
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error(`FAMILIES["${def.id}"] references missing SKU: ${id}`);
    return buildVariant(product);
  });

  const purchasable = variants.filter((v) => v.available);
  const prices = purchasable.map((v) => v.price);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;

  const first = variants[0].product;
  const aliases = def.aliases ?? [];
  const searchText = normalizeSearch(
    [def.name, ...def.skus, ...aliases, first.subtitle].join(" ")
  );

  return {
    id: def.id,
    name: def.name,
    slug: def.id,
    primaryCollectionId: def.primary,
    secondaryCollectionIds: def.secondary ?? [],
    variants,
    isBlend: Boolean(def.blend),
    featured: Boolean(def.featured),
    confidence: def.confidence ?? "high",
    subtitle: first.subtitle,
    description: first.description,
    representativeImage: first.photo,
    aliases,
    searchText,
    minPrice,
    maxPrice,
    hasPricing: prices.length > 0,
    strengthSummary: strengthSummary(variants),
  };
}

export const families: CatalogProductFamily[] = FAMILIES.map(buildFamily);

const familyBySlug = new Map(families.map((f) => [f.slug, f]));

export function getFamily(slug: string): CatalogProductFamily | undefined {
  return familyBySlug.get(slug);
}

/** Family slug that owns a given source SKU id (for legacy /shop/[sku] redirects). */
export function familySlugForSku(sourceId: string): string | undefined {
  const def = FAMILIES.find((f) => f.skus.includes(sourceId));
  return def?.id;
}

export function familiesInCollection(id: CollectionId): CatalogProductFamily[] {
  return families.filter(
    (f) => f.primaryCollectionId === id || f.secondaryCollectionIds.includes(id)
  );
}

/** Count that a collection page shows (primary families only, per taxonomy rule). */
export function primaryFamilyCount(id: CollectionId): number {
  return families.filter((f) => f.primaryCollectionId === id).length;
}

export function featuredFamilies(limit = 8): CatalogProductFamily[] {
  return families.filter((f) => f.featured).slice(0, limit);
}

export function searchFamilies(query: string): CatalogProductFamily[] {
  const q = normalizeSearch(query);
  if (!q) return [];
  const terms = q.split(" ");
  return families.filter((f) => {
    const hay = `${f.searchText} ${normalizeSearch(
      collections.find((c) => c.id === f.primaryCollectionId)?.name ?? ""
    )}`;
    return terms.every((t) => hay.includes(t));
  });
}

// ── Sorting ──────────────────────────────────────────────────────────────────
export type SortKey = "featured" | "name-asc" | "name-desc" | "price-asc" | "price-desc";

export function sortFamilies(list: CatalogProductFamily[], key: SortKey): CatalogProductFamily[] {
  const copy = [...list];
  switch (key) {
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      // unpriced families sort last
      return copy.sort((a, b) => priceKey(a) - priceKey(b));
    case "price-desc":
      return copy.sort((a, b) => priceKeyDesc(b) - priceKeyDesc(a));
    case "featured":
    default:
      return copy.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
      );
  }
}

function priceKey(f: CatalogProductFamily): number {
  return f.minPrice ?? Number.POSITIVE_INFINITY;
}
function priceKeyDesc(f: CatalogProductFamily): number {
  return f.maxPrice ?? Number.NEGATIVE_INFINITY;
}
