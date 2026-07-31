# Catalog Maintenance Guide

Everything about the collection-first catalog is centralized. Adding or changing a product
should **never** require editing multiple UI components. After any change, run
`npm run validate:catalog` and `npx tsc --noEmit`.

## Where things live

| Concern | File |
|---|---|
| Source SKUs (id, name, price, image, batch…) | `lib/products.ts` → `products[]` |
| Pricing / purchase eligibility | `lib/products.ts` → `getPurchaseEligibility`, `ALLOW_ZERO_PRICE_IDS` |
| NEW badge list | `lib/products.ts` → `NEW_BADGE_IDS` |
| Collections (names, copy, tokens, SEO) | `lib/collections.ts` |
| Family grouping + collection assignment | `lib/catalog-data.ts` → `FAMILIES[]` |
| Derived catalog model (variants, pricing, search, sort) | `lib/catalog.ts` |
| Integrity checks | `scripts/validate-catalog.mjs` (`npm run validate:catalog`) |
| UI (cards, pages, nav) | `components/catalog/*`, `app/shop/*` |

## Common tasks

### Add a new strength/format to an existing product
1. Add the SKU object to `products[]` in `lib/products.ts` (unique `id`, real `price`, image at `/products/<id>.jpg`).
2. Add its `id` to the matching family's `skus: [...]` array in `lib/catalog-data.ts`.
3. Drop the image into `public/products/<id>.jpg`.
4. `npm run validate:catalog` (confirms it's mapped and the image resolves).

### Add a brand-new product family
1. Add the SKU(s) to `products[]`.
2. Add a new entry to `FAMILIES` in `lib/catalog-data.ts`:
   `{ id, name, skus: [...], primary: "<collection-id>", secondary?: [...], blend?, featured?, aliases?, confidence? }`.
3. Add image(s) to `public/products/`.
4. Validate. The family page (`/shop/<id>`), collection listing, search, and sitemap update automatically.

### Add / rename a collection or change its accent
- Edit `lib/collections.ts` (`collections[]`). Change `name`/`shortDescription`/`seoTitle` to rename; change `tokens.accent` / `tokens.glow` / `tokens.border` for the visual accent. Never hardcode a collection name or color in a component — read from here.
- Reassign families by editing each family's `primary` / `secondary` in `lib/catalog-data.ts`.

### Assign primary / secondary collections
- Every family has exactly one `primary`. `secondary` is optional (0–2). A family shown in a secondary collection still links to the same canonical `/shop/<family>` page.

### Mark a product as featured
- Set `featured: true` on the family in `lib/catalog-data.ts`. It appears in the `/shop` "Selected research families" row (`featuredFamilies(8)`).

### Badge rules
- The NEW badge shows **only** for source ids listed in `NEW_BADGE_IDS` (`lib/products.ts`). `isNew` on a product no longer drives any badge. Remove an id from the list to remove its badge.

### Search aliases
- Add strings to a family's `aliases: [...]` in `lib/catalog-data.ts` (e.g. `"mots c"`, `"melanotan 2"`). Search normalizes punctuation/case, so `MOTS-C` and `mots c` already match; aliases cover synonyms and abbreviations. Do not add aliases implying medical use.

### Related products
- Automatic: same primary collection, excluding the current family (first 4). To curate, extend `FamilyDef` with `relatedIds` and filter on it in `FamilyDetail`.

### Legacy redirects
- `/shop/<old-sku-id>` automatically 301s to `/shop/<family>?strength=<strength>` via `familySlugForSku()` — no per-SKU config needed. Adding a SKU to a family makes its legacy URL redirect correctly.

### Prevent accidental zero pricing
- A SKU with `price: 0` is automatically non-purchasable (shows "Pricing coming soon", blocked from cart + checkout). To sell it, set a real `price`. To intentionally allow a $0 item, add its id to `ALLOW_ZERO_PRICE_IDS` (discouraged). `validate:catalog` fails if a $0 SKU is ever marked purchasable.

### Verify a new product reaches checkout correctly
1. `npm run validate:catalog` — SKU is mapped, image resolves, price is set.
2. `npm run dev` → open `/shop/<family>`, select the variant, add to cart, confirm the cart line shows the exact strength/price, then confirm the checkout redirect target (`WC_CHECKOUT_URL`).

### Map a new product image
- Filename **must** equal the SKU `id`: `public/products/<id>.jpg`. `img(slug)` in `lib/products.ts` builds the path; the validator asserts the file exists.

## Guardrails
- Never change an existing `product.id` (it's the cart/checkout key and legacy URL).
- Never invent prices. Never add dosing/medical/outcome copy. Keep collection descriptions organizational only.
- Run both checks before pushing: `npm run validate:catalog && npx tsc --noEmit`.
