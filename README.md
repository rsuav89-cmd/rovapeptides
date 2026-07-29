# RovaPeptides — Storefront

High-end e-commerce storefront for RovaPeptides. Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

> Note: this project was scaffolded in a cloud sandbox where the npm registry was
> blocked, so `npm install` must be run in your own environment. All source is complete.

## Stack & dependencies

| Package        | Why |
|----------------|-----|
| `next` 14.2    | App Router, `next/font`, image optimization, routing for future pages |
| `react` 18     | UI |
| `tailwindcss` 3.4 | Design tokens + utility styling |
| `framer-motion` 11 | Spring-physics for the mobile nav drawer, cart drawer (M3), modals (M3) |
| `lucide-react` | Consistent line-icon set |

## Project structure

```
app/
  layout.tsx        # fonts (Space Grotesk / Inter / JetBrains Mono), <html> shell, metadata
  page.tsx          # page assembly (M1: notice bar + header + hero foundation + section anchors)
  globals.css       # base layer, design tokens, button/component classes, reduced-motion
components/
  Logo.tsx          # brand mark + wordmark (hover: mark springs 30°)
  NoticeBar.tsx     # compliance + free-shipping infinite marquee
  Header.tsx        # sticky scroll-aware header, desktop nav, cart badge, hamburger
  MobileNav.tsx     # spring-physics slide-in drawer (Framer Motion)
  ui/               # (reserved for shared primitives added in later milestones)
lib/
  site.ts           # brand config, nav items, free-shipping threshold, compliance copy
  products.ts       # placeholder research-peptide catalog + money() helper (drives M2)
public/
  products/*.svg    # placeholder product art — replace with real photos (same filenames)
  brand/            # (reserved for logo/OG assets)
tailwind.config.ts  # color, type scale, motion curves, shadows, keyframes
```

## Design system (enforced across all milestones)

**Color (Obsidian + Copper)** — deep black `paper #000000` with obsidian surfaces (`paper-2 #0D0D11`,
`paper-3 #15151B`); crisp white `ink #FFFFFF` headings with silver `ink-2 #B7B7C0` / muted `#7C7C86`
subtext; **Pure Copper `#B76E59`** (token `brand`/`signal`) as the single accent for all CTAs, active
states, border accents, and badges, with `#CE8A74` copper for hover/highlights. `gold #C6A15B` is reserved
for warnings only. (`signal` is kept as an alias so accent classes map to copper.)

**Type** — headings/headlines: **Syncopate** (uppercase, geometric luxury); everything else — body, product
specs, prices, batch numbers, compliance: **Montserrat**. The uppercase `.data-tag` chip is the signature
lab element. (`font-mono` is aliased to Montserrat — no monospace face is used.)

**Motion** — tokens in `tailwind.config.ts`: `ease-out-expo` `(0.16,1,0.3,1)`, `spring-soft`
`(0.34,1.3,0.5,1)`, durations capped at 160/220/280ms (all ≤300ms). Only `transform`/`opacity`
animate (GPU); `will-change` set on interactive elements; `prefers-reduced-motion` fully honored.
Scroll-aware header changes only background/blur/shadow + logo scale → **zero cumulative layout shift.**

## Swapping in real product photos

Drop images into `public/products/` using the filenames in `lib/products.ts` (e.g. `bpc-157.svg` →
`bpc-157.jpg` and update the `image` field), or point each product's `image` to your asset path.

## Milestones

- [x] **M1** — scaffold, design system, notice bar, header, mobile nav drawer, hero foundation
- [x] **M2** — rotating featured showcase + filterable catalog grid + cart context (quick-add + badge)
- [x] **M3** — quick-view modal (qty + COA link) + slide-in cart drawer (shipping bar, checkout) + real-photo wiring layer
- [x] **M4** — trust/quality section (99%+ / USA / 24h) + interactive COA viewer w/ certificate modal
- [x] **M5** — footer: compliance band, quick links, merchant/security badges, newsletter signup (validated)
- [x] **M6** — motion + contrast audit (see `AUDIT.md`): WCAG AA verified, all transitions ≤300ms, zero CLS
- [x] Real product photos wired — 13 RovaPeptides renders in /public/products/ (full-bleed on cards)

## Dropping in real product photos
`<ProductImage>` prefers each product's `photo` field (e.g. `/products/bpc-157.jpg`) and falls back to the
SVG placeholder if the file isn't there. To use your real bottle renders, drop files into `public/products/`
named to match the `photo` fields in `lib/products.ts`:

`bpc-157.jpg` · `tb-500.jpg` · `ghk-cu.jpg` · `semaglutide.jpg` · `tirzepatide.jpg` ·
`ipamorelin.jpg` · `cjc-ipamorelin.jpg` · `bpc-tb-blend.jpg` · `pt-141.jpg` · `glow-blend.jpg`

(Prefer `.webp`/`.png`? Just update the extension in each product's `photo` field.)
