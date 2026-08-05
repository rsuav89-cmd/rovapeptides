# Full Site Audit — RovaPeptides

Run: August 2026. Branch state: uncommitted work on top of `da6435d`.

---

## Read this before the findings: what could and could not be executed

**Executed, results are real:**
- `npx tsc --noEmit` → **0 errors**
- `npm run qa` → **1,357 assertions pass**, 2 declared warnings
- 96 new static assertions written specifically for this audit (route resolution, nav
  integrity, image paths, `key` props, Suspense boundaries) — these now run on every commit

**Not executed — and I want to be plain about why rather than imply coverage I don't have:**

Playwright viewport testing at `http://localhost:3000` is **impossible from this session**. The
bridge to your Mac caps every command at 45 seconds and reaps background processes between
calls, so a dev server cannot stay alive long enough to be visited — `nohup`, `disown` and
`setsid --fork` were all tried across previous sessions and the process is killed each time.
`@playwright/test` is also not installed, and the device has no network access to install it.
The cloud container cannot reach your machine's localhost and its npm registry access is
blocked (HTTP 403).

**So nothing below is a rendered-pixel observation.** Every finding is either (a) proven by an
executed assertion, or (b) derived from reading the code. Items in category (b) are labelled
**[static]**. The genuinely visual checks you asked for — text overlap, wrapping, contrast in
situ, layout shift on drawer open, console errors, hydration mismatches — require the browser
run below.

```bash
npm i -D @playwright/test && npx playwright install chromium
npm run dev                     # in one terminal
npm run test:e2e                # 18 specs, Desktop Chrome + iPhone 13 projects
```

`playwright.config.ts` already defines both viewport projects and will start the dev server
itself if one is not running.

---

## Scope correction: four of the seven routes you listed do not exist

| You asked for | Reality |
|---|---|
| `/product/[slug]` | Route is `/shop/[slug]`. **Fixed this session** — added a permanent redirect `/product/:slug → /shop/:slug`. |
| `/coa-lookup` | Route is `/coas`. **Fixed** — `/coa-lookup` and `/coa-lookup/:batch` now redirect permanently. |
| `/cart` | **No such route by design.** The cart is a slide-out drawer (`components/cart/CartDrawer.tsx`) rendered globally from `Providers`. There is nothing to audit at a URL. |
| `/checkout` | **No such route by design.** `/api/checkout` signs the cart and hands off to `shop.rovapeptides.com`. Checkout UI is WooCommerce's, off this codebase. |

Live routes: `/`, `/about`, `/coas`, `/coas/[batch]`, `/contact`, `/faq`, `/methods` (new),
`/privacy`, `/shipping`, `/shop`, `/shop/all`, `/shop/[slug]`, `/shop/collections/[slug]`,
`/terms`, `/track-order`, `/wholesale`, plus `/llms.txt` and `/api/checkout`.

---

## 🚨 Critical / functional

**C1 — 12 priced SKUs cannot reach WooCommerce.** `bpc-157-tb-500-combo`, all three GLP-2
strengths, GLP-3 20 mg and 30 mg, the CJC/Ipamorelin blend, MOTS-c 10 mg, Epithalon 10 mg,
KPV 5 mg, Glutathione 200 mg, Bacteriostatic Water 30 mL. Declared in `PENDING_WOO_IDS`.
Checkout returns 409 and the cart drawer blocks with a named message, so nothing fails
silently — but **more than half the catalog cannot be bought**. This is the launch blocker.
*Verified by assertion.*

**C2 — Stale `.next/types` broke `tsc` and would have broken yours.** Interrupted builds left
`.next/types/app` empty while `tsconfig.json` still included `.next/types/**/*.ts`, producing
two TS6053 errors unrelated to any source file. Moved to `_to_delete/`; `next build` regenerates
it. **Fixed this session.** *Reproduced and resolved.*

**C3 — `/shop` filter did not respond to header or external links.** `ShopBrowser` seeded its
filter from `window.location.search` in a mount-only effect, so arriving at
`/shop?collection=…` while already on `/shop` left the grid showing all 18 products. Rewritten
to derive state from `useSearchParams()` with the URL as the single source of truth, and wrapped
in `<Suspense>` — without that boundary a production build fails on this exact pattern.
**Fixed this session.** *A new assertion now fails the suite if any `useSearchParams` consumer
loses its Suspense wrapper.*

**C4 — Header carried duplicate and dead links.** `primaryNav` had seven entries including two
pointing at `/shop` and three `?category=` filters that `/shop` never read (only `/shop/all`
did), so three nav links silently did nothing. Consolidated to four — Shop All, COA Search,
Analytical Methods, About — with order tracking moved to the footer. **Fixed this session.**
*Assertions now verify the four-link shape, no duplicate hrefs, and that every nav and footer
link resolves to a real route or a declared redirect.*

**C5 — KPV has no product render.** `/products/kpv.jpg` does not exist. Declared in
`PENDING_PRODUCT_RENDERS` rather than pointed at another compound's vial, because a
mislabelled photograph on a research product is worse than a missing one. *Verified by
assertion; reported as a warning on every run.*

---

## 📱 Mobile responsive **[static]**

**M1 — Header at 320–390px is the highest-risk surface.** With the mega menu removed the row is
now Logo + three icon buttons, well inside the viewport. Previously it needed ~406px of
min-content. Worth confirming visually since the wordmark still hides below 400px.

**M2 — Filter pills scroll horizontally below `sm`.** `CollectionFilterBar` is a scroll
container with hidden scrollbars and no visible affordance that more categories exist to the
right. Eight pills at ~150px each is roughly 1,200px of track. Consider a fade mask on the
right edge. *Not a bug; a discoverability risk.*

**M3 — The sliding underline animates between pills of very different widths** ("Supplies" to
"Reconstitution & Supplies" was the worst case; now "Supplies" to "Dermal & Antioxidants").
Spring-driven `layoutId` handles it, but it is the single most likely place for visible jank.

**M4 — Mobile buy bar reserves 6.5rem plus the safe-area inset.** The product name now wraps
instead of truncating, so a long name at 320px could take two lines. Arithmetic says it fits;
the browser is the arbiter.

**M5 — COA analyte table** at `min-w-[440px]` inside `overflow-x-auto` with a "swipe the table"
hint. Correct pattern, but the hint only renders below `sm`.

---

## 🎨 Visual & polish **[static]**

**V1 — Three components are now dead code.** `CollectionsMegaMenu.tsx` (0 importers after the
header consolidation), `CollectionCard.tsx` (0 after the `/shop` redesign), and
`ProductDetail.tsx` (0 — the two matches a grep reports are `getProductDetail`, a different
symbol). None ship to the client
— Next tree-shakes unreferenced modules — but they will drift from the components that replaced
them. Recommend deletion.

**V2 — Collection slugs no longer match their display names.** `vitamins-preparation-supplies`
now renders as "Supplies", `mitochondrial-cellular-energy` as "Cellular Energy",
`longevity-healthy-aging` as "Longevity & Aging". Slugs were deliberately frozen so no URL,
sitemap entry or canonical moved. Cosmetic inconsistency only, visible in the address bar.

**V3 — `/#quality` anchor is valid.** `TrustQuality` carries `id="quality"` with
`scroll-mt-24`. Footer and `utilityNav` links to it resolve. *Verified by assertion.*

**V4 — GLP-2 and GLP-3 renders are the old Tirzepatide and Retatrutide files.** If those vial
labels carry the previous compound names, every GLP-2/GLP-3 card contradicts its own title.
GLP-2 15 mg additionally reuses the 30 mg render. **Highest-priority visual item.**

**V5 — Two surface transitions changed and want eyes:** the `/shop` hero now fades into a
`bone` surface via a seam gradient, and `.card-light` moved to `chalk` on `bone` (a 1.25:1
step). Both are arithmetically correct; neither has been seen.

---

## What the new assertions cover

Added to `scripts/qa-verify.mjs` this session, running on every `npm run qa`:

- Route table built from the filesystem; every nav, footer and utility link must resolve to a
  real route, a dynamic segment, or a declared redirect
- `primaryNav` is exactly four links with no duplicate destinations
- Every `?collection=` link names a collection that exists
- Every product `image`/`photo` file exists on disk, or the SKU is declared in
  `PENDING_PRODUCT_RENDERS`
- Every `useSearchParams` consumer is rendered inside a Suspense boundary
- Every `.map()` returning JSX declares a `key`
- Collection short names stay within three words and 28 characters
- Catalog shape locked: 18 families, 22 SKUs, GLP-3 at 10/20/30 mg and 148/228/298, no
  collection left empty, no purged SKU resurrected

---

## Recommended order tomorrow

1. Supply the 12 WooCommerce IDs (C1) — nothing else matters until the catalog is buyable.
2. Commission the KPV render and new GLP-2 / GLP-3 vial renders (C5, V4).
3. Run `npm run build` locally — still never executed against any of this work.
4. Run the Playwright suite on both viewports; it will confirm or clear M1–M5 and V5 in minutes.
5. Delete the three dead components (V1).
