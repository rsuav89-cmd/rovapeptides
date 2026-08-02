# RovaPeptides — Six-Phase Optimization Sweep

Autonomous pass executed against `main` at `f4cf937`. Every change below is on disk and
uncommitted. `npx tsc --noEmit` returns **zero errors**. The previous version of this report
(the M-series frontend optimization pass) is superseded and remains in git history.

---

## Verification status — read this first

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | **Pass, 0 errors** — re-run after every phase |
| `npm run build` | **Could not be executed.** See below. |
| `npx next lint` | **Not configured** — no `.eslintrc` exists; the CLI drops into an interactive setup prompt |

`npm run build` was attempted seven times and cannot complete in this environment. The session
reaches the repository through a sandboxed bridge with a hard 45-second ceiling per command, and
that sandbox reaps background processes between calls — `nohup`, `disown`, and `setsid --fork`
were all tried, and the build process is killed each time the invoking call returns. A cloud-side
build was also attempted and failed: the container's npm registry access returns HTTP 403 on
package tarballs, so `node_modules` cannot be reconstructed there, and the device's 301 MB
`node_modules` exceeds what can be transferred within the same time ceiling.

**Action required: run `npm run build` locally before deploying.** Type checking covers type
errors across every file touched, but it does not exercise webpack bundling, static generation of
the 42 new `/coas/[batch]` pages, or the `next/font/google` fetch. Those are the three things a
local build will confirm.

---

## Phase 1 — App Router & performance

**Client → Server conversions: none were possible.** All 22 `"use client"` modules were reviewed.
Every one holds either React state, an event handler, a browser API, or a framer-motion animation
that requires the client runtime. `app/error.tsx` and `app/global-error.tsx` are required to be
client components by the framework. No file was converted, because converting any of them would
have broken behaviour rather than improved load time.

**Images now run through `next/image`.** `components/ProductImage.tsx` was rewritten from a native
`<img>` to `next/image` with `fill`. Every call site already places the image inside a
`relative aspect-[4/5]` box, so geometry is unchanged, while Next now emits AVIF and WebP variants
per breakpoint instead of shipping the full-size JPEG to a 360px phone. The `onError` → placeholder
fallback and the generated descriptive alt text were both preserved. `next.config.mjs` gained
`formats: ["image/avif", "image/webp"]` plus tuned `deviceSizes`/`imageSizes` for the card grid.

**LCP element now has real priority.** The hero product image in `HeroShowcase.tsx` was
`loading="eager"` but never received `priority`, so it was not preloaded and carried
`fetchpriority="auto"`. It now passes `priority` with an explicit `sizes` hint.

**Code splitting.** `TrustQuality`, `CoaViewer`, and `FaqPreview` are below the fold on the home
page and are now `next/dynamic` imports (server-rendered as before, separate client chunks).
`MobileNav` and `SearchOverlay` in the header, and `CartDrawer` in `Providers`, are dynamic with
`ssr: false` — none of them exist on first paint, and all three pull framer-motion. Combined with
`optimizePackageImports` for `lucide-react` (a ~1,500-module barrel file) and `framer-motion`, this
is the largest initial-JS reduction available without changing behaviour.

## Phase 2 — CRO & UI

**Product cards became real links.** `ProductCard.tsx` navigated via `onClick` + `router.push` on an
`<article>` — not keyboard reachable, no middle-click, no open-in-new-tab, and it passed zero
internal link equity to product pages. It now uses an absolute-inset `<Link>` overlay, mirroring the
pattern `FamilyCard` already used correctly, with the body layer `pointer-events-none relative z-[1]`
and the quick-add button `pointer-events-auto relative z-10`.

**Quick-view is reachable on touch.** That affordance was `opacity-0 group-hover:opacity-100` — i.e.
permanently invisible on every phone. It is now visible by default and hover-revealed only from `sm`
upward.

**Unit economics on multi-strength families.** Product pages now show `$X.XX per mg` beside the price
whenever the strength parses as a clean mg figure. This is a pure factual restatement that removes
arithmetic the buyer would otherwise do by hand when comparing a 10 mg against a 30 mg vial.

**Free-shipping threshold surfaced before the decision, not after.** The $200 progress bar previously
lived only inside the cart drawer. The mobile sticky bar now carries `· $146 to free shipping` inline
alongside strength and price.

**Cart drawer: the shortfall is now actionable.** "Add $X more for free shipping" told shoppers to
spend more while giving them nothing to click. Two purchasable recommendations from the existing
`getRecommended()` helper now render directly beneath the progress bar with one-tap add buttons.

**Checkout destination and payment methods disclosed.** Checkout hands off to
`shop.rovapeptides.com` via a top-level POST. That domain change was previously unannounced and the
accepted payment methods were disclosed only in the footer. Both now appear directly under the
checkout button; `paymentMethods` was lifted into `lib/site.ts` so the footer and the drawer cannot
drift apart.

**Deliberately not done: low-stock urgency.** You asked for it, and I did not implement it. There is
no inventory data anywhere in this codebase, so any "only 3 left" indicator would be fabricated. For a
research-chemical supplier whose entire positioning rests on published analytical honesty, invented
scarcity is both an FTC deceptive-practice exposure and a direct contradiction of the trust argument
the rest of the site makes. If real stock levels become available through the WooCommerce Store API,
this becomes a legitimate and effective lever.

## Phase 3 — WooCommerce & backend guardrails

**There is no runtime WooCommerce fetch layer to harden.** The catalog is static TypeScript data;
the only backend boundary is the signed checkout handoff. Retry logic, SWR, and React `cache()` have
nothing to wrap here. What exists was hardened instead:

The signed handoff URL was being written to the server log in full, including its HMAC signature —
a logged line was a replayable checkout link for the entire 15-minute TTL window. It now logs line
count, unit count, and expiry only. Payload bounds were added (`MAX_LINES = 40`,
`MAX_QTY_PER_LINE = 99`) so a crafted POST cannot generate an unbounded signed query string, and
every response now carries `Cache-Control: no-store`.

The more consequential fix is on the client. `/api/checkout` returns a JSON 400 when a cart contains
an unmapped or unpriced SKU — but the cart submits a top-level form POST, so that JSON body would
have *replaced the page*, dumping a raw error object on the shopper mid-purchase. `CartDrawer` now
runs `cartHasIneligible()` as a pre-flight gate and surfaces an inline `role="alert"` message
instead.

## Phase 4 — Compliance & copy

A full-repository sweep for therapeutic, dosing, human-use, and outcome vocabulary now returns only
intentional hits: compliance disclaimers, and source comments instructing future editors. Four
substantive changes were made. The `lib/collections.ts` Brain & Mood long description said
"including nootropic peptides" — a human cognitive-outcome class — now "ACTH-fragment analogs and
neurotrophic peptide complexes". Two collection names carried consumer-health framing rather than
research framing: "Hormone & Sexual Health Research" → "Hormone & Neuroendocrine Research" (short
name "Hormone & Endocrine"), and "Skin, Hair & Antioxidant Support" → "…Research", since "Support" is
supplement-claim vocabulary. The COA match guarantee now appears at the checkout step in the cart
drawer as well as on product pages, worded strictly as a fulfilment promise — the vial matches its
published certificate — with no claim about what the material does.

## Phase 5 — SEO, schema, and AI search

**`/coas/[batch]` now exists — 42 statically generated certificate pages.** This is the highest-value
change in the sweep. All 42 certificates already existed in `lib/coa.ts` with seven analytes each,
methods, specifications, results, the named independent laboratory, and test/release dates — and every
byte of it was invisible to crawlers, because it rendered only after a keystroke into a client-side
search box. Each page now server-renders a semantic `<table>` with proper `<th scope>` headers, a
`<caption>`, and canonical `/coas/{BATCH}`, wrapped in a schema.org `@graph` of `WebPage` +
`Certification` + `Product` with every analyte as a `PropertyValue` carrying `measurementTechnique`.
All 42 URLs were added to the sitemap, and product pages now deep-link to the specific certificate for
the batch on the shelf instead of dumping the user on a generic lookup form.

**`ProductGroup` + `hasVariant` for multi-strength families.** A single `Product` node can only
describe one variant, so families with a strength selector were advertising variant zero's price for
every strength — Retatrutide's 20 mg and 30 mg SKUs inherited the 10 mg price. Multi-variant families
now emit a `ProductGroup` with `variesBy: size`, one `Product` node per strength carrying its own SKU,
MPN, image, batch, purity, `hasCertification` link and `Offer`, plus an `AggregateOffer` with the real
`lowPrice`/`highPrice` range. Single-variant families keep the flat `Product` node and gained a
`hasCertification` reference.

**`CollectionPage` + `ItemList`** now emit on all eight collection pages and on `/shop/all`. Per the
`ai-seo` methodology, `ItemList` is the schema that makes a catalog page retrievable for
"best/list of X" fan-out queries.

**`/llms.txt`** was added as a static route: what RovaPeptides is, the research-use-only constraint
stated plainly, the analytical methodology with its release specification, how to retrieve any COA by
batch number, the eight collections, and the key page URLs.

**Exact-match query headings.** Product pages carry `<h2>What is {compound}?</h2>` directly above the
laboratory overview, styled as an existing kicker so nothing changes visually. "What is BPC-157" is
the highest-volume query shape in this niche.

---

## Files touched

| File | Phase | Change |
|---|---|---|
| `next.config.mjs` | 1 | AVIF/WebP, device/image sizes, `optimizePackageImports`, `poweredByHeader: false` |
| `components/ProductImage.tsx` | 1 | Rewritten onto `next/image` with `fill`, fallback preserved |
| `components/HeroShowcase.tsx` | 1 | LCP image gets `priority` + `sizes` |
| `app/page.tsx` | 1 | `next/dynamic` for `TrustQuality`, `CoaViewer`, `FaqPreview` |
| `components/Header.tsx` | 1 | `next/dynamic` (`ssr: false`) for `MobileNav`, `SearchOverlay` |
| `components/Providers.tsx` | 1 | `next/dynamic` (`ssr: false`) for `CartDrawer` |
| `components/catalog/ProductCard.tsx` | 2 | Anchor overlay replaces `onClick`; touch-visible quick view |
| `components/catalog/FamilyDetail.tsx` | 2, 5 | Per-mg pricing, shipping status in sticky bar, batch-specific COA links |
| `components/cart/CartDrawer.tsx` | 2, 3, 4 | Cross-sell, payment chips, destination disclosure, pre-flight gate + error surface, COA guarantee |
| `lib/site.ts` | 2 | `paymentMethods` extracted for reuse |
| `components/Footer.tsx` | 2 | Consumes shared `paymentMethods` |
| `app/api/checkout/route.ts` | 3 | Signature redacted from logs, payload caps, `no-store` |
| `lib/collections.ts` | 4 | Collection names and Brain & Mood description re-framed |
| `lib/jsonld.ts` | 5 | `productGroupJsonLd`, `certificationJsonLd`, `coaPageJsonLd`, `collectionPageJsonLd` |
| `app/coas/[batch]/page.tsx` | 5 | **New** — 42 server-rendered certificate pages |
| `app/llms.txt/route.ts` | 5 | **New** — AI-search orientation file |
| `app/shop/[slug]/page.tsx` | 5 | `ProductGroup` for multi-variant families, `hasCertification` |
| `app/shop/collections/[slug]/page.tsx` | 5 | `CollectionPage` + `ItemList` |
| `app/shop/all/page.tsx` | 5 | `CollectionPage` + `ItemList` |
| `app/sitemap.ts` | 5 | 42 COA URLs |

---

## Warnings requiring your review

**1. 27 of 42 SKUs have `price: 0`.** They render "Pricing coming soon" and are correctly excluded
from checkout, from `Offer` schema, and from the `AggregateOffer` price range. This is now a revenue
ceiling, not a bug: roughly two thirds of the catalog cannot be bought, and AI shopping agents filter
out unpriced suppliers entirely.

**2. `lib/woo-mapping.ts` must be extended in lockstep with those prices.** A SKU with a price but no
Woo mapping is silently skipped by the handoff route — it will vanish from the cart at checkout. The
new pre-flight gate catches the all-items case but not a partial cart.

**3. `next/image` needs a visual check.** Geometry should be identical, but this is the one change I
could not verify without a build. Look at the hero, the catalog grid, product detail, and the new cart
thumbnails. If your host does not run the Next image optimizer, add `unoptimized: true` under `images`.

**4. Search aliases still contain effect-class terms.** `lib/catalog-data.ts` lists "nootropic",
"anxiolytic", and "senolytic" as search aliases. They are never rendered — they exist so researchers
find the product — but a strict compliance reading may want them removed.

**5. ESLint is not configured.** `next lint` prompts for setup. Worth initialising so `react-hooks`
and `@next/next` rules run in CI.

**6. `components/catalog/ProductDetail.tsx` is dead code.** No importers; it still carries the old
three-row spec block and will drift from `FamilyDetail`.

**7. The homepage renders all 42 SKUs flat.** Retatrutide 10/20/30 mg occupy three near-identical
cards while `/shop` correctly groups by family. Switching the home grid to `FamilyCard` over
`families` was scoped but not executed — it is a visible merchandising change and wanted your call.
