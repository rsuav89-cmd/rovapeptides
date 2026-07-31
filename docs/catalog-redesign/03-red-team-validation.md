# 03 — Red-Team Validation

Adversarial review of the collection-first rebuild, scored 0–5. Verification here is
**static** — `tsc --noEmit` (0 errors), `npm run validate:catalog` (PASS on real data),
and code review. Live-browser screenshot testing at the six viewports is an **external
limitation** of this environment (the cloud bridge cannot drive a persistent dev server
or capture the screen); those checks are delegated to `npm run dev` / the Vercel preview.

## Scores

| # | Category | Score | Notes |
|---|---|---|---|
| 1 | Inventory integrity | 5 | Validator proves 40/40 SKUs, each in exactly one of 33 families; zero loss/dupes. |
| 2 | Variant correctness | 5 | Variant selector submits the exact `selected.product` (immutable `sourceId`); summaries never flatten blends. |
| 3 | Cart & checkout safety | 5 | `getPurchaseEligibility` gates card, detail, `CartContext.add()`, and `lib/wc.ts` pre-redirect. Validator asserts no unpriced SKU is purchasable. |
| 4 | Information architecture | 5 | `/shop` (collections) → collection page → family page → variant → cart. |
| 5 | Visual differentiation | 4 | Per-collection tokens (glow/accent/border), larger cards, contained image stage. Not screenshot-verified (see limitation). |
| 6 | Desktop usability | 4 | `max-w-[1360px]`, 4-col family grid, editorial mosaic, mega-menu. Not screenshot-verified. |
| 7 | Mobile usability | 4 | 1-col cards, bottom-sheet filter drawer, mobile collections list. Not device-verified. |
| 8 | Accessibility | 4 | Card fixed to single overlay-link + raised action (no nested interactives); labeled search/sort; drawer has Escape + scroll-lock + focus restore; mega-menu Escape + outside-close + `aria-expanded`. **Gap:** drawer/menu do not implement a full Tab focus-cycle trap. |
| 9 | Route & Vercel reliability | 4 | Family slugs via `generateStaticParams`; legacy SKU URLs 301→`?strength=`; no catch-all rewrites; `/api` + checkout untouched. `next build` not run (45s cap). |
| 10 | Performance | 4 | Static data, `object-contain`, minimal client state, CSS transitions. `ProductImage` handling inherited (not converted to `next/image` in this pass). |
| 11 | SEO & legacy URL safety | 5 | **Fixed this pass:** `sitemap.ts` now emits canonical family + collection URLs; legacy per-SKU URLs 301 and are dropped from the sitemap. Per-page canonical + OG metadata. |
| 12 | Compliance & content accuracy | 5 | Neutral organizational copy; no dosing/claims; "Related Research Products" (not "Frequently Bought Together"); disclaimers preserved. |
| 13 | Maintainability | 5 | Centralized `lib/collections.ts` + `lib/catalog-data.ts`; validator; five design docs + maintenance guide. |
| 14 | Future scalability | 4.5 | New product = one `products.ts` entry + one `FAMILIES` line; validator catches omissions. |

## Weaknesses found → action

- **[High] Sitemap pointed at soon-to-redirect per-SKU URLs.** → **Fixed:** `sitemap.ts` rewritten to canonical family + collection URLs.
- **[Medium] Partial focus trap** in the mobile filter drawer and mega-menu (Escape + restore implemented; full Tab cycle not). → Documented; acceptable for launch, flagged for a follow-up focus-trap utility. Not Critical (both are dismissible, keyboard-openable, and restore focus).
- **[Medium] No screenshot/e2e evidence** for viewport behavior. → Environment limitation; `npm run dev` + Vercel preview cover it. All layout uses tested Tailwind responsive patterns already present in the codebase.
- **[Low] `components/catalog/ProductDetail.tsx` is now orphaned** (the family page uses `FamilyDetail`). Left in place (not deleted) pending confirmation; `/shop/all` still uses the original `ProductCard`/`Catalog` grid intentionally.

## Critical / High checklist (must be clean before launch)
- Wrong product to cart — **none** (exact sourceId). ✓
- Wrong/zero price to checkout — **blocked** at 4 layers. ✓
- Lost/duplicated product — **none** (validator). ✓
- Broken direct route / runtime crash — family + collection routes type-check; legacy redirects handled; branded `notFound()`. (Live refresh not screenshot-tested — env limit.)
- Broken images — **none** (validator asserts all 40 resolve). ✓

No unresolved Critical or High code issues remain. The two genuine external blockers are the **WooCommerce checkout URL** (Gate 5) and **27 pending prices** — both owner inputs, not code defects.
