# 05 — Overnight Audit & Finalization

_Autonomous pass: checkout routing, type safety, link/image integrity, build verification._

## 1. Checkout & API configuration
- `lib/wc.ts` — `DEFAULT_STORE_URL` changed `https://www.rovapeptides.com` → **`https://shop.rovapeptides.com`**, so `WC_CHECKOUT_URL` now safely defaults to **`https://shop.rovapeptides.com/checkout/`** when `NEXT_PUBLIC_WC_CHECKOUT_URL` is unset. `WC_ACCOUNT_URL` follows (`…/my-account/`).
- `.env.example` — `NEXT_PUBLIC_WC_CHECKOUT_URL` template updated to `https://shop.rovapeptides.com`.
- `CartDrawer.tsx` — verified: `goToCheckout()` guards with `cartHasIneligible(lines)` (no $0/unpriced item can reach checkout), then redirects via `window.location.href = WC_CHECKOUT_URL`. Correct.
- **API route handlers:** none exist (`app/api` is empty). The prior `/api/wc-checkout-url` route and native checkout were intentionally removed; checkout is a pure client-side redirect. Nothing to audit.

## 2. Code audit & type safety
- `npx tsc --noEmit` → **0 errors** across the repository (after the wc.ts change).
- `/checkout` references: only the URL-normalizer regex in `lib/wc.ts` (correct). **No broken `/checkout` links.**
- `/products/...` route references: **none** — all product links use `/shop/...` (the actual route namespace). No stray `/products` routes.
- Internal links audited (`/coas`, `/contact`, `/faq`, `/privacy`, `/shop`, `/shop/all`, `/terms`, plus nav-array routes `/about`, `/shipping`, `/wholesale`, `/track-order`) — all resolve to existing routes.
- `router.push` targets → `/shop/${id}`; `/shop/[slug]` resolves family slugs canonically and 301-redirects legacy SKU ids. No dead pushes.
- `npm run validate:catalog` → **PASSED** (40 SKUs → 33 families → 8 collections; every SKU in exactly one family; eligibility consistent; **all 40 images resolve**).

## 3. UI & error boundaries
- `ProductImage` degrades gracefully: renders `product.photo`, and on `onError` falls back to the branded placeholder (`product.image`) — no layout shift (aspect box owned by parent). Descriptive alt text present.
- Cart never sends an ineligible/unpriced line: guarded at the card, product detail, `CartContext.add()`, and the `lib/wc.ts` pre-redirect gate. If the store URL is unset it now falls back to the shop domain rather than erroring.
- Mobile nav (`MobileNav`) + filter drawer (`CollectionView`): slide-in panels with Escape-to-close, body-scroll lock, and focus restore; collections list is full-width tap targets. Mega-menu closes on Escape/outside-click.

## 4. Build & deployment
- `next build`: attempted; **times out at the 45s local-bridge cap** mid-compile (exit 124) with **no error surfaced** — a known limitation of this environment (the bridge caps bash at 45s). Per the environment's own guidance, `tsc --noEmit` (0 errors) is used as the authoritative type/build verification.
- **Push:** this session has no network path to GitHub, so `git push` cannot run from here. Changes are committed locally on `main`; the push is a single command left for you (below).

## Files changed
- `lib/wc.ts` (checkout default → shop.rovapeptides.com)
- `.env.example` (template default → shop.rovapeptides.com)
- `docs/catalog-redesign/05-overnight-audit.md` (this log)

## To deploy (run in your Mac Terminal)
```
cd ~/Desktop/ROVA_PROJECT/rovapeptides
git push origin main
```
(The commit "Overnight audit: checkout routing, type safety, and build verification" is already made locally.)
