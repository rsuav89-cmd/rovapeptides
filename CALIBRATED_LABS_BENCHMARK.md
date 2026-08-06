# Calibrated Labs — UI/UX Benchmark vs ROVA

Observed August 2026: homepage and the Retatrutide PDP at `calibratedlabs.com`.
ROVA assessed from the working tree. `npx tsc --noEmit` clean; `npm run qa` 1,466 assertions.

**File paths in your brief don't match the repo.** `app/product/[slug]/page.tsx` is
`app/shop/[slug]/page.tsx` (a `/product/:slug` redirect now exists), `components/CartDrawer.tsx`
is `components/cart/CartDrawer.tsx`, and `components/ProductCard.tsx` is
`components/catalog/ProductCard.tsx`. Corrected paths are used throughout.

---

## Read this before adopting anything

Several of Calibrated Labs' highest-converting patterns are **compliance exposure we should
not copy.** Their Retatrutide PDP subtitle reads *"Triple agonist technology engineered for
next generation weight loss"* — an outcome claim on a research chemical. Their FAQ includes
*"How do I correctly reconstitute and dose the product?"*, they ship a **Peptide Calculator**
as a dosing tool, and their cross-sell offers **preloaded pens, tablets, and alcohol swabs** —
a human-administration product set.

That is a materially different regulatory posture from ours. Our entire positioning — published
per-batch certificates, no dosing guidance, laboratory framing in every product string, a QA
suite that fails the build on banned vocabulary — is the asset that makes us defensible. The
recommendations below take their **structural** conversion patterns and leave the claims behind.

Also worth noting: **Freedom Diagnostics is the named testing lab for both Calibrated Labs and
Amino Club.** Two of two competitors name a real laboratory on the PDP. That is now table
stakes, and it is the single strongest argument for finishing the real-COA migration.

---

## 1. Product badging and micro-copy

**What they do.** Purity is a badge, not a sentence: `99%+ Purity`, `Lab Verified`,
`USA Sourced`, `Same Day Shipping` — four short chips, repeated across the homepage. On the
PDP, `>99.0%` sits in a structured lab-results block *above* the variant selector, with
`View Clinical Report` as the proof link. Product cards carry the compound name, linked
category tags ("GLP-1 / GIP / Glucagon Triple Agonist", "Metabolism"), a price range, and two
buttons: **Buy Now** and **View COA**.

**The gap.** Their card offers proof at the browse stage. Ours didn't — a shopper had to open
the PDP before seeing any certificate affordance. And their `View COA` goes to a portal;
**ours can go to a specific server-rendered batch page**, which is a materially stronger version
of the same pattern.

**Implemented this session** in `components/catalog/ProductCard.tsx`:
- The purity chip now reads `99%+ HPLC verified` rather than `99% pure` — method, not adjective.
- A `View COA` link renders beside the batch line whenever a certificate is on file, deep-linking
  to `/coas/{batchNumber}`. It carries `pointer-events-auto relative z-10` and
  `stopPropagation` so it works inside the card's full-area overlay link.
- Cards without a certificate show `COA in queue` instead of an internal lot code that resolves
  to nothing.

**Also implemented** in `components/catalog/FamilyCard.tsx`: multi-strength families now show a
range (`$148 – $298`) instead of `From $148`. Their range format tests better because it
communicates the ceiling as well as the entry point.

**Still recommended.** Add linked category tags under the PDP title, sourced from
`familiesInCollection` — they double as internal links into the eight collections and cost
nothing. Place them in `components/catalog/FamilyDetail.tsx` beneath the `<h1>`, styled as
`data-tag` chips linking to `/shop?collection={slug}`.

---

## 2. PDP layout architecture

**What they do.** Dosage is a **dropdown** labelled "Size" — 10/20/30/40/60mg. Below it, a
**bulk savings ladder**: `Buy 10 / $632.00 / Save 20%` escalating to `Buy 30 / $1,659.00 /
Save 30%`. A delivery window renders inline (`Aug 11 – Aug 13`) alongside "Overnight Shipping
Available" and "Free Shipping on orders over $150". Technical content lives in a
`Common Questions` accordion. No sticky add-to-cart bar was detected on scroll.

**Where we already win.** Our variant pills show **strength and price per option** — a dropdown
hides the price consequence until after the click, which is the weaker pattern. We have a
sticky mobile buy bar; they don't. We have per-mg unit economics, a batch proof strip above the
price, and an in-page COA preview modal. Our accordion (`Common questions`, generated from
`lib/product-faq.ts`) is already the same device with better provenance, since it feeds
`FAQPage` schema from the same source.

**The three real gaps.**

**Volume pricing.** Their savings ladder is the most valuable pattern on the page and we have no
equivalent. Lab buyers order in multiples; a 20–30% break at quantity is a legitimate AOV lever
with no compliance surface. Implementation: add `tiers?: { qty: number; unitPrice: number }[]`
to `Product` in `lib/products.ts`, render beneath the qty stepper in `FamilyDetail.tsx`, and
apply the break in `CartContext`. **This needs your price points — I won't invent margin.**

**Delivery estimate.** Both competitors show an arrival window; we show dispatch timing only.
This is pure computation from data we already publish (dispatch within 1 business day, 2–5
business days transit). Add `lib/shipping.ts` exporting `deliveryWindow(from: Date)` — weekend
aware, no new data — and render it in the PDP trust stack and above the cart's checkout button.

**Free-shipping threshold.** Theirs is $150, Amino Club's is $150, ours is $200. Two of two
competitors sit a third lower. `site.freeShippingThreshold` in `lib/site.ts` is a one-line
change; the progress bar, the PDP shortfall line and the sticky bar all read from it.

---

## 3. Quick-add and cart drawer

**What they do.** A cross-sell block headed **"Complete Your Protocol"** with the line
*"Customers usually pair Retatrutide with:"*, offering related products plus **consumables**,
each with an `Add to Order` button. The cart itself is a persistent header icon showing
`$0.00 0 Cart`.

**Where we already win.** Our drawer has a free-shipping progress bar, two live cross-sell rows
from `getRecommended()`, payment-method chips, an encrypted-checkout destination disclosure, the
COA match guarantee, a 14-day return line, a dispatch expectation, and a pre-flight guard that
blocks checkout on unmapped SKUs with a named message. That is a materially richer drawer.

**The one gap worth closing.** Their cross-sell includes the **consumable** — the thing the buyer
needs but forgets. We sell Bacteriostatic Water 30 mL at $12 and it is currently just another
grid item. In `components/cart/CartDrawer.tsx`, pin bacteriostatic water to the top of the
suggestion list whenever the cart contains a lyophilized product and doesn't already contain it.
`getRecommended()` currently returns featured-first; a `pairsWith` rule would beat it. Same
treatment on the PDP under the heading **"Complete the bench setup"** — RUO-safe phrasing of
their "Complete Your Protocol".

Two micro-interactions worth borrowing: `Add to Order` as the cross-sell button label (lower
commitment than "Add to cart"), and a quantity stepper on cart lines that holds focus between
taps — ours re-renders the row on each change.

---

## 4. Trust footer and floating elements

**What they do.** The footer is three columns (Catalog, Resources, Legal) with a positioning
line — *"Premium research-grade peptides. Engineered for precision. Verified for absolute
purity."* — plus TikTok, Discord and Instagram. Resources includes **Certificates of Analysis**
and the **Peptide Calculator**. The persistent elements are a cart icon with live total and a
15%-off email capture modal. The RUO disclaimer sits in the header banner: *"Research Use
Only · One-Time Use"*.

**Assessment.** Our footer is already stronger — four columns including collection deep links,
payment chips, security badges, and compliance in the band rather than a banner. Their Discord
is the one genuinely differentiated asset: a researcher community is a retention moat we have no
answer to.

**Recommended, in order.** A persistent **"Verify a batch"** affordance — a small fixed
bottom-left pill on `/shop` and PDPs opening the COA lookup — turns our strongest asset into a
sitewide element rather than a page. Second, add **Analytical Methods** and **COA lookup** to a
Resources column, mirroring their information architecture (already partly done in this
session's nav consolidation). Third, consider a community channel; that is a business decision,
not a code one.

**Do not adopt:** the 15%-off entry modal. Discounting on arrival signals commodity, and it is
the opposite of the "documented purity" positioning both of us claim. If you want email capture,
incentivise it with **documentation** — new-batch certificate alerts — which is what Amino Club
does and what our newsletter copy already implies.

---

## Priority order

| # | Change | File | Effort | Blocked on |
|---|---|---|---|---|
| 1 | Volume pricing ladder | `lib/products.ts`, `FamilyDetail.tsx`, `CartContext.tsx` | M | **Your price points** |
| 2 | Consumable pairing in cart + PDP | `cart/CartDrawer.tsx`, `lib/products.ts` | S | — |
| 3 | Delivery-date estimate | new `lib/shipping.ts`, `FamilyDetail.tsx`, `CartDrawer.tsx` | S | — |
| 4 | Free-shipping threshold $200 → $150 | `lib/site.ts` | XS | **Your margin call** |
| 5 | Category tags on the PDP | `FamilyDetail.tsx` | S | — |
| 6 | Persistent "Verify a batch" pill | new component + `Providers.tsx` | S | — |
| 7 | ~~Card COA link + purity micro-copy~~ | `ProductCard.tsx` | — | **Done this session** |
| 8 | ~~Price range on family cards~~ | `FamilyCard.tsx` | — | **Done this session** |

Above all of it: **finish the real-COA migration.** Both competitors name a real lab on every
PDP. We now have exactly one genuine certificate on file (GLP-3 10 mg, JanoShield Analytical,
99.4%, 2026-07-28) and 21 SKUs correctly marked pending. Every trust pattern in this document
is worth more once that number goes up, and worth very little while it stays at one.
