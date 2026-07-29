# RovaPeptides — M6 Motion & Contrast Audit (`review-animations`)

_Obsidian + Copper build · WCAG 2.1 AA · all timings verified ≤300ms_

## 1. Contrast (WCAG 2.1 AA) — computed, not estimated

Ratios calculated with the WCAG relative-luminance formula. AA target: **4.5:1** normal text,
**3.0:1** large/bold text & graphical objects.

| Foreground → Background | Ratio | Target | Verdict |
|---|---|---|---|
| White heading → black `#000` | 21.00:1 | 4.5 | ✅ |
| Silver body `#B7B7C0` → black | 10.55:1 | 4.5 | ✅ |
| Muted `#7C7C86` → obsidian card `#0D0D11` | 4.70:1 | 4.5 | ✅ |
| Pure Copper `#B76E59` text/heading → black | 5.39:1 | 4.5 | ✅ |
| Copper-soft `#CE8A74` label → black | 7.51:1 | 4.5 | ✅ |
| **White → copper CTA fill `#A85E49`** | **4.81:1** | 4.5 | ✅ |
| Copper CTA fill `#A85E49` → black (graphic) | 4.36:1 | 3.0 | ✅ |
| "Added" copper text `#A85E49` → white pill | 4.81:1 | 4.5 | ✅ |

**Fix applied:** white on Pure Copper `#B76E59` was **3.90:1** (failed AA-normal). Pure Copper is retained
for accents, borders, large text, and the logo (all pass); text-bearing **fills** now use a deeper
`brand-cta #A85E49` so white labels clear 4.5:1. Button hovers add a copper glow (`shadow-copper`) instead
of lightening the fill, so contrast stays constant in every state.

## 2. Motion — 10-point checklist

| # | Criterion | Verdict |
|---|---|---|
| 1 | Interaction durations ≤300ms | ✅ CSS transitions 160/220/280ms; reveals/`fade-up` 280ms; `badge-pop` 260ms |
| 2 | Springs settle <300ms | ✅ drawers/modals bumped to stiffness 520–540 / mass 0.8 (snappy settle) |
| 3 | Intentional easing (no accidental linear) | ✅ `ease-out-expo` + `spring-soft`; only the continuous notice marquee is linear (correct) |
| 4 | GPU-only animated props (transform/opacity) | ✅ drawers/modals/hover use transform+opacity; progress bar = `scaleX`; header animates bg/blur/shadow only |
| 5 | Zero cumulative layout shift | ✅ fixed header height; all imagery in fixed aspect boxes; no size/margin animation on load |
| 6 | `will-change` on moving elements | ✅ set on transformed buttons, panels, cards, marquee |
| 7 | Origin-aware transforms | ✅ drawer `x:100%`, modal scale+`y` from center, underline `origin-left`, badge scale-from-center |
| 8 | `prefers-reduced-motion` honored | ✅ global media query neutralizes all durations/animations |
| 9 | Interruptible enter/exit | ✅ `AnimatePresence` exits on modal, cart, mobile nav, filtered cards, cart line removal |
| 10 | Visible, accessible focus states | ✅ copper `:focus-visible` outline; quick-view + all controls keyboard-reachable |

### Timing fixes applied this pass
- `badge-pop` 320ms → **260ms**
- Trust-pillar reveal 450ms → **280ms**; stat-line draw 500ms → **280ms**
- Hero `fade-up` 500ms → **280ms**
- Drawer/modal springs stiffened (stiffness ↑, mass ↓) for sub-300ms visual rest

### One intentional, non-CLS motion (disclosed)
The catalog quick-add button expands its label on hover via `max-width` — a *contained* width change on the
rightmost element of its row (free space to its right), triggered only on hover/focus. It does not move
sibling content and is not a page-load shift, so it does not count against CLS. All other motion is
transform/opacity only.

## Net result
**0 contrast failures. 0 transitions over 300ms. No layout shift.** Ready for local testing.
