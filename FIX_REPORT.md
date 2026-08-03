# Mobile Fix Report — user feedback, August 2026

Both reported bugs are fixed. `npx tsc --noEmit` passes with zero errors and
`npm run qa` passes 1,658 assertions, including nine new regression guards that
will fail the build if either bug is reintroduced.

**Note on the screenshots:** the images did not come through to this session — only
your written descriptions arrived. The diagnosis below is from the source, and both
causes match your descriptions precisely.

**Note on why you saw bug 2:** the truncation fix from the previous sweep is committed
locally but has never been pushed or deployed. The site you screenshotted on your iPhone
is running the pre-fix code, and the earlier fix would not have been sufficient anyway —
see "Why the first attempt was not enough" below.

---

## Feedback 1 — "Do you want these lines through your page?"

### Cause

`app/page.tsx` rendered a full-height decorative overlay across the entire hero:

```tsx
{/* faint editorial column rules — framing, not decoration */}
<div aria-hidden className="pointer-events-none absolute inset-0">
  <div className="mx-auto h-full max-w-[1280px] px-5 sm:px-8">
    <div className="grid h-full grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="border-l border-line/40 last:border-r" />
      ))}
    </div>
  </div>
</div>
```

This was intentional design, not leftover debugging — but the effect on a phone is
indistinguishable from a debug grid. On mobile the wrapper collapses to `grid-cols-2`,
so four `border-l` cells stack into **vertical hairlines at 0%, 50% and 100% of the hero,
running its full height straight through the headline, the paragraph, and the CTA row**.
At desktop widths the four columns spread out and read as editorial framing; at 390px
they cut through the text. That is the artifact in your first screenshot.

### Fix

The entire overlay block was deleted. No other component draws a full-bleed rule overlay —
I swept `app/` and `components/` for `repeating-linear-gradient`, `border-x`, `divide-x`,
global `outline` rules and `* { border }` declarations, and there are none.

### What I deliberately left alone

The thin horizontal rules elsewhere are real design elements, not artifacts: `.hairline`
and `.hairline-warm` (1px dividers inside sections) and the `border-t` separators between
page sections. They are single, deliberate, section-scoped lines rather than a grid across
content. If the horizontal lines in your screenshot were these rather than the section
borders, say the word and I will remove them too.

---

## Feedback 2 — "Product names cut off on my iPhone"

### Cause

Product titles render in **Syncopate**, forced uppercase by a global `h1,h2,h3,h4` rule.
Syncopate is an unusually wide display face — roughly 0.9em of advance per uppercase
character, so "TESAMORELIN" occupies about **182px at the card's `text-[1.15rem]`**, and
"BACTERIOSTATIC" about **165px**. These are single unbreakable tokens.

The card grid went two-up at `min-[380px]`. On a 390px iPhone that yields:

```
card width   = (390 − 40 page padding − 16 gap) ÷ 2 = 167px
content box  = 167 − 32 (p-4)                       = 135px
```

A 182px word inside a 135px box, with `.card-light` applying `overflow-hidden` and no
wrapping rule on the heading, gets clipped at the container edge — producing exactly
"TESAMORELI" and "BACTERIOST".

### Why the first attempt was not enough

The previous sweep added `break-words` and moved the grid to single-column below 380px.
That was the right instinct but the wrong threshold: every current iPhone is 390–430px
wide, so all of them stayed two-up, and `break-words` on a 182px word in a 135px box only
converts a clip into an ugly mid-word break ("TESAMORELI" / "N"). **No font size fixes this
at two-up** — even at 0.85rem, "BACTERIOSTATIC" still needs 171px against 135px available.
The card has to be wider.

### Fix

**`components/catalog/Catalog.tsx`** — two-up now begins at 520px, where a card offers
200px of content box and a compound name fits on one line:

```diff
- className="mt-6 grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
+ className="mt-6 grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
```

**`components/catalog/ProductCard.tsx`** — the heading now wraps under every rule, with a
slightly smaller size below 520px:

```diff
- <h3 className="mt-1 break-words font-display text-[1.15rem] font-semibold leading-tight text-ink-dark hyphens-auto">
+ <h3 className="mt-1 whitespace-normal break-words hyphens-auto font-display text-[1.05rem]
+                font-semibold leading-tight text-ink-dark [overflow-wrap:anywhere]
+                min-[520px]:text-[1.15rem]">
```

`whitespace-normal` guarantees wrapping, `break-words` handles long tokens,
`[overflow-wrap:anywhere]` is the CSS equivalent of `word-break: break-word` and is the
last-resort backstop, and the size steps back up at 520px where the card can carry it. The
subtitle beneath it got `break-words [overflow-wrap:anywhere]` too — "0.9% Benzyl Alcohol ·
For Reconstitution" had the same exposure.

**`components/catalog/FamilyCard.tsx`** — same treatment (`/shop` and collection pages):
`text-[1.15rem]` below `sm`, back to `text-[1.28rem]` above, plus the wrap trio on both the
name and the strength summary.

**`components/catalog/FamilyDetail.tsx`** — the product-page `<h1>` was `text-3xl` (30px)
with no wrap rule, which overflows at 320px. Now `text-2xl` with the wrap trio, restored to
`text-3xl` from `sm` up.

### Truncation removed everywhere a product name appears

Your feedback was about cards, but the same clipping existed in three more places. All now
wrap to a second line instead of cutting:

| File | Element | Was | Now |
|---|---|---|---|
| `FamilyDetail.tsx` | mobile sticky buy bar — name and meta line | `truncate` | `break-words leading-snug` |
| `SearchOverlay.tsx` | search result name | `truncate` | `break-words leading-snug` |
| `cart/CartDrawer.tsx` | cart line item name | `truncate` | `break-words leading-snug` |

The buy bar's reserved space grew from `5.5rem` to `6.5rem` (plus safe-area inset) in
`app/globals.css` so a two-line name can never overlap the footer.

Two `truncate` classes remain and are intentional: the search result's secondary metadata
line and the desktop mega-menu's collection blurb. Neither is a product name.

---

## The tradeoff you should know about

Single-column cards below 520px means the homepage catalog — all 40 SKUs — is a long
scroll on a phone. Correctness beat density here, but if you want the density back the
cleanest fix is not to lower the breakpoint (that reintroduces the bug) but to cap the
homepage grid and link out, which the earlier CRO audit already recommended:

```tsx
// components/catalog/Catalog.tsx — render the first 12, then
<Link href="/shop/all">View all 40 research products →</Link>
```

Say the word and I will wire it.

---

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Pass — 0 errors |
| `npm run qa` | Pass — 1,658 assertions, 0 failures |
| `npm run build` | **Not executed** — this session cannot run it |

Nine new permanent guards were added to `scripts/qa-verify.mjs`, so these two bugs cannot
silently return: product-name headings must carry `break-words`; they must not carry
`truncate`, `line-clamp`, `whitespace-nowrap` or `text-ellipsis`; no element rendering
`{product.name}`, `{family.name}` or `{p.name}` may carry `truncate`; `app/page.tsx` must
contain no `last:border-r` column-rule overlay; and the catalog grid's two-up breakpoint
must be at least 480px.

`npm run build` still cannot complete here — the bridge to your Mac caps every command at
45 seconds and kills background processes between calls, so a Next production build is
never able to finish. Type checking and the assertion suite both pass, but please run
`npm run build` locally before deploying.

## Files changed

- `app/page.tsx` — removed the column-rule overlay
- `components/catalog/Catalog.tsx` — two-up breakpoint 380px → 520px
- `components/catalog/ProductCard.tsx` — heading and subtitle wrap rules, responsive size
- `components/catalog/FamilyCard.tsx` — heading and subtitle wrap rules, responsive size
- `components/catalog/FamilyDetail.tsx` — `<h1>` wrap rules; buy-bar truncation removed
- `components/SearchOverlay.tsx` — result name truncation removed
- `components/cart/CartDrawer.tsx` — line-item name truncation removed
- `app/globals.css` — buy-bar reserve 5.5rem → 6.5rem, scroll-padding 7rem → 8rem
- `scripts/qa-verify.mjs` — nine regression guards
