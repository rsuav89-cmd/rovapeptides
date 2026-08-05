# /shop Redesign — Collection Mosaic → Category Filter Bar

`npx tsc --noEmit`: **0 errors.** `npm run qa`: **1,253 assertions pass** (one pre-existing
warning — the 12 SKUs still awaiting WooCommerce IDs, unrelated to this work).

---

## The structural problem, not just the styling

The old block wasn't only heavy-looking — it was an **interstitial**. `/shop` rendered eight
dark cards, and each one cost a full page load before a shopper saw a single product. With
only 18 products in the catalog, that meant a page whose entire job was to make people click
again. The dark mosaic also sat directly beneath a dark hero, so the first two screens were
one undifferentiated slab.

So the redesign does two things at once: it removes the boxes, and it removes the click.
Choosing a category now filters the grid in place. `/shop` went from a signpost to a shop.

The eight `/shop/collections/[slug]` routes are untouched — they still exist for deep links,
the sitemap, breadcrumbs and `CollectionPage` JSON-LD, and the active filter links straight to
its own page ("Open the Metabolic & Energy collection →"). Nothing was lost from SEO.

---

## 1. Category navigation

**New: `components/catalog/CollectionFilterBar.tsx`** — a horizontal, scrollable pill row with
no container boxes at all. Active state is carried by **typography plus a sliding 2px copper
underline** (`framer-motion` `layoutId` on a 520-stiffness spring, so the underline travels
between pills rather than blinking). Inactive labels sit at `muted-dark`, active at
`ink-dark` — weight and colour do the work a box used to do.

Every pill carries its live count in tabular figures at 70% opacity: `Metabolic & Energy 6`.
Counts come from `familiesInCollection()`, so they match exactly what the filter will show —
including families that belong to a collection secondarily.

Accessibility: `role="group"` with `aria-label="Filter by research collection"`,
`aria-pressed` per pill, 44px minimum touch targets, horizontal scroll on mobile with hidden
scrollbars, wrapping instead of scrolling from `sm` up.

**New: `components/catalog/ShopBrowser.tsx`** — owns the filter state and the grid. Reading
`?collection=<slug>` on mount and writing it back with `history.replaceState` means a filtered
view is linkable and survives a refresh without adding history entries on every pill tap. The
grid cross-fades on change (220ms, `ease-out-expo`, opacity + 8px rise) and a
`role="status" aria-live="polite"` line announces "6 products in Metabolic & Energy" for
screen readers.

---

## 2. Category names

| Collection | Before | After |
|---|---|---|
| `weight-metabolic` | Weight & Metabolic | **Metabolic & Energy** |
| `recovery-repair` | Recovery & Repair | **Tissue & Recovery** |
| `mitochondrial-energy` | Mitochondrial Energy | **Cellular & Longevity** |
| `brain-mood` | Brain & Mood | **Cognitive & Focus** |
| `hormone-sexual-health` | Hormone & Endocrine | **Hormone Balance** |
| `longevity-aging` | Longevity & Aging | **Healthy Aging** |
| `skin-hair-antioxidant` | Skin & Antioxidant | **Dermal & Antioxidants** |
| `vitamins-supplies` | Vitamins & Supplies | **Reconstitution & Supplies** |

**One name was mine, not yours.** Your list covered seven categories; we have eight. Since
"Cellular & Longevity" went to `mitochondrial-energy`, the actual longevity collection needed
its own label or the bar would have shown two Longevity pills. I used **Healthy Aging**. Change
it in `lib/collections.ts` if you'd rather have something else.

Both `name` and `shortName` were updated, along with every `seoTitle`. `shortName` is what the
pills, breadcrumbs, mobile nav and mega menu render; `name` keeps a "Research" qualifier for
page headings and structured data ("Metabolic & Energy Research"), which holds the RUO framing
and the search term without lengthening the pill. **Slugs are unchanged**, so no URL moved and
no redirect is needed.

A QA guard now fails the build if any `shortName` exceeds three words or 28 characters — the
labels can't silently creep back toward paragraph length.

---

## 3. Aesthetic and hierarchy

The browse section sits on `surface-bone on-light grain` — the warm luxury surface, not a dark
block — which also means the light `FamilyCard`s are on the ground tone they were designed
for. The hero above it now **fades into that surface** through a seam gradient instead of
butting against a second dark section, so the two screens read as one continuous descent
rather than two slabs.

The hero was also rewritten and lightened: `section-tight` rhythm, the decorative copper dot
removed (accent discipline — solid copper now means "buy"), headline changed from the
procedural "Explore by Research Collection" to **"Every compound, one shelf."**, and the
primary CTA relabelled from "Browse Collections" to **"Filter the catalog"** pointing at
`#browse` rather than a second section of links.

The old **"Featured — Selected research families"** section was removed. It showed 8 of 18
families immediately above a grid that now shows all 18; with a catalog this size it was
duplication, not curation.

Micro-animations added: the sliding underline, the grid cross-fade on filter change, the
existing card hover choreography (lift, image follow-through, copper rule under the title),
and pill colour transitions on `ease-snap`. All transform/opacity only, all under 300ms, all
suppressed by the global `MotionConfig reducedMotion="user"`.

---

## 4. Files modified

**New**
- `components/catalog/CollectionFilterBar.tsx` — pill row, sliding underline, counts, ARIA
- `components/catalog/ShopBrowser.tsx` — filter state, URL sync, animated grid, live count

**Rewritten**
- `components/catalog/CatalogLanding.tsx` — mosaic and featured sections removed, hero
  rewritten, seam added, `ShopBrowser` mounted

**Edited**
- `lib/collections.ts` — 8 × `name`, `shortName`, `seoTitle`
- `app/shop/page.tsx` — title and description now describe a filterable catalog
- `scripts/qa-verify.mjs` — 11 new guards covering the browse experience and label length

**Now unused:** `components/catalog/CollectionCard.tsx` has no importers. Left in place in case
you want the mosaic back for a future landing page; delete it if not.

---

## 5. Worth a look when you next run the site

The filter bar is the one piece I'd want eyes on: it's horizontally scrollable below `sm` and
wraps above it, and the sliding underline animates between pills that change width. The
arithmetic is sound but the transition between a short pill ("Hormone Balance") and a long one
("Reconstitution & Supplies") is the kind of thing that only reveals itself on screen.

`npm run build` still can't be executed from this session — run it locally before deploying.
