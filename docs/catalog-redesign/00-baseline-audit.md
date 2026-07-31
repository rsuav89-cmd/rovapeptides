# 00 — Baseline Forensic Audit

_Repository: `rsuav89-cmd/rovapeptides` · branch `main` · audited against the live working tree._

## A. Application architecture

| Aspect | Finding |
|---|---|
| Framework | Next.js **14.2.5**, **App Router** |
| Language | TypeScript, **strict: true**, path alias `@/* → ./*` |
| Rendering | Server components + client islands (`"use client"`); `/shop/[slug]` is SSG via `generateStaticParams` (one static page per SKU) |
| Styling | Tailwind CSS 3.4 + custom design tokens (obsidian/copper), `@layer` utilities (`.btn-signal`, `.data-tag`, `.product-frame`) |
| Animation | framer-motion ^11 |
| Icons | lucide-react ^0.427 |
| State | React Context (`CartProvider` / `useCart`), no external state lib |
| Package manager | npm |
| Build | `next build` (not run here — local bridge caps bash at 45s; verified with `tsc --noEmit` instead) |
| Deployment | Vercel. **No `vercel.json`** (no custom rewrites/redirects — nothing captures `/api`, checkout, or static assets) |
| Env usage | `NEXT_PUBLIC_WC_CHECKOUT_URL` (checkout base, `lib/wc.ts`), `WC_API_URL` + Woo keys (server-only, `.env.example`) |
| Scripts | `dev`, `build`, `start`, `lint`. No test script; no ESLint config installed (so `next build` skips lint) |

## B. Routing

Existing public routes: `/`, `/shop`, `/shop/[slug]`, `/about`, `/coas`, `/contact`, `/faq`, `/privacy`, `/shipping`, `/terms`, `/track-order`, `/wholesale`, plus `robots.ts` + `sitemap.ts`. `/shop/[slug]` renders a product page per **SKU id** (e.g. `/shop/retatrutide-10mg`) — a per-strength URL pattern. `generateMetadata` + `notFound()` are already wired. No catch-all rewrites exist, so adding collection routes is safe.

**Decision:** extend the existing `/shop` architecture with collection-first routes rather than fork a parallel `/collections` tree — preserves existing conventions, SEO, and the SSG product pages. Legacy `/shop/[sku]` URLs will be preserved (redirect to canonical family page with a `?strength=` param).

## C. Product source

The catalog is a **static TypeScript module**, `lib/products.ts` — the authoritative source for display. It is **not** WooCommerce-backed for browsing; WooCommerce is the external **checkout** target only (cart drawer redirects to `WC_CHECKOUT_URL`). **40 active SKUs.** Each has `id` (immutable, used as cart key + `/shop/[slug]`), `name`, `subtitle`, `description`, `categories` (`Research Peptides | Longevity | Skin & Beauty`), `mass`, `purity`, `price`, `batch`, `image`/`photo` (`/products/<slug>.jpg`), `featured?`, `isNew?`.

## D. Cart & checkout

`CartProvider` (React Context) persists to `localStorage` (`rova-cart-lines`, `rova-cart-insurance`), rehydrates on mount, and stores `product.id` (re-resolved against `products` on load — so a removed SKU drops cleanly). Cart survives navigation and refresh. `add/remove/setQty/clear/setInsurance` + shipping-insurance line items + `total`. Checkout = **external WooCommerce redirect** via `lib/wc.ts` `WC_CHECKOUT_URL`. **Invariant to preserve:** the exact `product.id` is what reaches the cart; catalog restructuring must not change ids.

## E. Images

40 renders in `/public/products/<slug>.jpg`, square obsidian/copper vials, consistent composition. Card uses `object-cover` (crops cap/label — to be corrected to a contained image stage). Detail uses `object-contain`. All 40 image paths resolve (verified by `validate:catalog`).

## F. Current visual baseline (from the original problem screenshot + code)

Single dense grid, small cards, `object-cover` crops, product name in ~18px but competing with copper batch text, category shown only as a tiny mono label, whole-card is one clickable target. Desktop container `max-w-[1280px]` but grid feels narrow. No collection context / no journey. Browser screenshots at the 6 baseline viewports are **pending** — the cloud bridge cannot drive a persistent dev server + capture the user's screen; visual review will use the live Vercel site and post-build inspection (documented as an external limitation in the red-team doc).

## G. Baseline commands

- `tsc --noEmit`: **0 errors** (verified this session, after prior catalog/modal type fixes).
- `next build`: not run (45s bridge cap). No lint config → build skips ESLint.
- Tests: none exist. Added a lightweight `validate:catalog` integrity check in lieu of a heavy framework.

## Root-cause findings (the two visible bugs)

1. **`$0` on cards — ROOT CAUSE: data, not mapping.** 27 of 40 SKUs carry `price: 0` (the newly-added products, prices pending from the owner). `money(0)` renders "$0", and quick-add would place a $0 line in the cart. **Fix applied:** a single pricing policy in `lib/products.ts` — `isPurchasable()` (price > 0 unless allow-listed; allow-list intentionally empty), `priceLabel()` (shows "Pricing coming soon", never "$0"). The card/detail now show the fallback and **disable add-to-cart**; `CartContext.add()` hard-guards against ever inserting a $0 SKU. No price was invented.
2. **`NEW` badge is meaningless — ROOT CAUSE: over-broad flag.** `isNew` is set on ~28 SKUs. **Fix applied:** `showNewBadge()` gated to a curated `NEW_BADGE_IDS` set (marquee launches only).

## Main implementation risks

- **27 unpriced SKUs** — until the owner sets prices, those families show "Pricing coming soon" and cannot be added to cart. This is the safe behavior; it is not a code defect.
- **External checkout URL** — `WC_CHECKOUT_URL` still defaults to the frontend domain (`www.rovapeptides.com`), which 404s; the real WooCommerce host is an outstanding input from the owner. Out of scope for the catalog rebuild but noted.
- **Per-SKU `/shop/[slug]` pages** — moving to family pages requires legacy redirects to avoid 404s/SEO loss.
- **Accessibility** — current `ProductCard` is a clickable `<article>` containing buttons (nested interactive elements); the redesigned card will use a single link + separate action controls.

## Files likely to be modified / added

Added: `lib/collections.ts`, `lib/catalog.ts`, `scripts/validate-catalog.mjs`, collection + family pages, catalog UI components, `docs/catalog-redesign/*`.
Modified (safety, this phase): `lib/products.ts`, `components/catalog/ProductCard.tsx`, `components/catalog/ProductDetail.tsx`, `components/cart/CartContext.tsx`, `package.json`.

---

## Gate 1 — Repository safety & baseline (addendum)

- **Branch:** work moved to `feature/collection-catalog` (created from `main` HEAD; uncommitted work carried over). **No commits were made to `main`** by this rebuild.
- **Last commit on `main`:** `058b953` ("Simplify checkout: redirect via lib/wc.ts…") — a *prior, user-authorized* push, not part of this catalog rebuild.
- **True baseline = `058b953`.** Because every catalog change is uncommitted, the committed baseline is simply current HEAD; no worktree "reconstruction" was required.
- **Baseline vs current type-check:**
  - Baseline `058b953` (clean export via `git archive` → `/tmp`, isolated from the no-delete mount): `tsc --noEmit` → **0 errors**.
  - Current working tree (catalog changes applied): `tsc --noEmit` → **0 errors**.
  - **No new type errors introduced.**
- **On `next build`:** not run — per this environment's own override (the local bridge caps bash at 45s and `next build` times out). `tsc --noEmit` is used for full type verification, as instructed. Lint: no ESLint config is installed, so `next build` performs no lint step regardless.
- **Worktree note:** a full baseline `next build` inside a `git worktree` is not performed here — `next build` exceeds the 45s cap, and worktree metadata cannot be cleaned on the no-delete mount. The `git archive` approach above gives an equivalent isolated baseline without those side effects.
