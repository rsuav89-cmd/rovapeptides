# 04 — Route Plan (extend `/shop`, no duplication)

## Existing routes (preserved)
- `/` — marketing home
- `/shop` — catalog (currently a flat grid)
- `/shop/[slug]` — product page, `slug === product.id` (per-SKU), SSG via `generateStaticParams`
- `/about`, `/coas`, `/contact`, `/faq`, `/privacy`, `/shipping`, `/terms`, `/track-order`, `/wholesale`, `robots.ts`, `sitemap.ts`

## Target structure (extends `/shop`, does NOT fork `/products/*`)
| Route | Purpose | Status |
|---|---|---|
| `/shop` | **Collection-first catalog landing** (hero + collection mosaic + featured families + browse-all) | rebuild in place |
| `/shop/collections/[collectionSlug]` | One reusable collection page (hero, family grid, search/sort/filters) | new |
| `/shop/all` | Full catalog — every family, search + filter + sort | new |
| `/shop/[slug]` | Product page. `slug` = **family slug** (canonical) OR legacy **SKU id** | evolve + preserve |

## `/shop/[slug]` — family + legacy SKU handling (no broken links)
`[slug]` will resolve in this order:
1. **Family slug** (e.g. `/shop/retatrutide`) → family product page with variant selector; optional `?strength=` deep-links a variant.
2. **Legacy SKU id** (e.g. `/shop/retatrutide-20mg`) → **redirect** to the canonical family page with the matching variant preselected: `/shop/retatrutide?strength=20mg`. Mapping via `familySlugForSku(sourceId)` (already in `lib/catalog.ts`).
3. Neither → `notFound()` (branded 404).

`generateStaticParams` will emit **family slugs** as canonical params; legacy SKU slugs are handled by the redirect branch so **every existing `/shop/<sku>` URL keeps working** (301 → canonical family + variant). This preserves SEO, existing links, and checkout deep-links while removing ~40 near-duplicate indexable per-strength pages in favor of ~33 canonical family pages.

## Safety
- No `/products/[slug]` route is created (no duplication).
- No catch-all rewrite; `/api`, static assets, and the WooCommerce checkout redirect are untouched. There is no `vercel.json` and none will be added that could capture those paths.
- `sitemap.ts` will be updated to list canonical family + collection URLs; legacy SKU URLs stay reachable via redirect but drop out of the sitemap.

## Metadata / SEO
- Collection pages: unique title/description from `lib/collections.ts` (`seoTitle`/`seoDescription`), canonical `/shop/collections/<slug>`.
- Family pages: title/description from family; canonical `/shop/<family>`; existing product JSON-LD (`lib/jsonld.ts`) reused (only real fields — no fake ratings).
- Filter/search query URLs canonicalize to the base collection / `/shop/all`.
