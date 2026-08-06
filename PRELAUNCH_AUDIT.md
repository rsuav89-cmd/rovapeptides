# Pre-Launch Diagnostic — ROVA Peptides

Run: August 2026, ahead of tonight's launch. Frontend `rovapeptides.com` (Next.js) ·
Backend `shop.rovapeptides.com` (WooCommerce 10.9.4 / WordPress, Twenty Twenty-Five).

## Verdict

**Two blockers, one of them silent.** Everything else passes.

| Phase | Result |
|---|---|
| 1.1 Type check + QA suite | **PASS** — 0 TS errors, 1,510 assertions, 3 known warnings |
| 1.2 Production build | **NOT RUN** — cannot execute in this environment |
| 1.3 Git sync | **FAIL** — 4 commits unpushed; production appears to predate them |
| 2.1 `rova-edit-cart-button.php` | **PASS** — all 5 checks |
| 2.2 `rova-manual-payment-instructions.php` | **PASS** — all 8 checks |
| 3.1 Domains + staging leak | **PASS** — both resolve, zero staging references |
| 3.2 WooCommerce REST bridge | **PASS** — `wc/v3` reachable and enumerating routes |
| — `/shop` server rendering | **FAIL → FIXED THIS RUN** — page shipped zero products |

---

## 🚨 Blocker 1 — production is running older code than the repo

`https://rovapeptides.com/shop/glp-3` currently renders batch **`RV-GL3-2610`**.
The committed code renders **`GLP3-10-2026-01`** for that SKU — the batch number from the
curated COA database introduced in `c892d96`. A deployed build that still shows the old
generated batch number cannot contain that commit.

Four commits are local-only:

```
054c081  fix(checkout): adjust edit cart placement, hardcode storefront redirect, zelle text
1b06220  feat(checkout): openCart URL handler, cart edit loop, manual payment instructions
f0ddda5  fix(checkout): accept WOOCOMMERCE_* env aliases and normalise the REST base
c892d96  feat(checkout): server-side order generation and direct payment url handoff
```

`git push origin main` has failed on every attempt from this session — `HTTP 403 from proxy
after CONNECT`, no outbound network from the sandbox. **Nothing in those four commits is live**,
which includes the server-side order creation, the env-alias fallback, and the `openCart=true`
return handler that the WordPress Edit Cart button depends on.

**Do this first tonight:**
```
cd ~/Desktop/ROVA_PROJECT/rovapeptides
npm run build && git push origin main
```
Then confirm Vercel finished, and re-check `/shop/glp-3` shows `GLP3-10-2026-01`. If it still
shows `RV-GL3-2610`, the deploy did not land and nothing below matters.

## 🚨 Blocker 2 — the production build has never been run

Not once, across this entire engagement — roughly a dozen attempts. The bridge to your Mac caps
every command at 45 seconds and reaps background processes between calls, so `next build` cannot
finish here. Type checking and 1,510 assertions cover logic, data and contracts. They do **not**
cover webpack bundling, static generation of all routes, the `next/font/google` fetch, or image
optimisation.

Given that the last four commits rewrote the checkout path, launching without a single successful
build is the largest uncontrolled risk on this list. `npm run build` locally is non-negotiable.

## ⚠️ Found and fixed during this scan — `/shop` was shipping an empty catalog

`https://rovapeptides.com/shop` returned the page shell, the headline "Every compound, one
shelf.", and the category filter labels — **but not a single product**. `/shop/all` returned all
22 correctly.

Cause: `ShopBrowser` reads `?collection=` via `useSearchParams()`, which opts its subtree into
client rendering. For a statically generated route that means **the Suspense fallback is what
ends up in the static HTML** — and the fallback was an empty `<div aria-hidden />`. Every
crawler, every no-JS visitor, and every social preview of `/shop` saw a catalog page with no
catalog. Human visitors with JS never noticed, which is exactly why it survived to a launch audit.

**Fixed:** the fallback now server-renders the complete `FamilyGrid` plus the section heading and
product count. Static HTML carries all 18 families; the client swaps in the filtered view on
hydration. A new assertion pins it so the fallback can never regress to a placeholder.

**This fix is in commit-pending state — it ships only with the push above.**

---

## Phase 1 detail

`npx tsc --noEmit` → exit 0.
`npm run qa` → 1,510 assertions, 0 failures. Three warnings, all known and none launch-blocking:

- `cjc-1295-ipamorelin-combo` and `kpv-5mg` have no WooCommerce ID — they are declared in
  `PENDING_WOO_IDS`, so checkout returns 409 with a named message rather than dropping them
  silently. **20 of 22 SKUs are checkout-ready.**
- `kpv-5mg` has no product render (`/products/kpv.jpg` does not exist).
- 21 of 22 SKUs have no certificate on file; only GLP-3 10 mg does.

Working tree is clean — 0 modified tracked files, 0 untracked (excluding `_to_delete/`).

## Phase 2 detail — MU-plugin files

These are the local source of truth. **Compare byte size and hash against what is live in
`wp-content/mu-plugins/` before launch** — the repo copies are ahead of the server unless you
re-uploaded after the last round of fixes.

| File | Bytes | SHA-256 (first 16) |
|---|---|---|
| `rova-edit-cart-button.php` | 3,471 | `d868b5cfea45ff74` |
| `rova-manual-payment-instructions.php` | 11,647 | `61a04eaf39877fef` |
| `rova-handoff.php` | 6,762 | `191e6180b7f56ede` |

Local path: `/Users/zz/Desktop/ROVA_PROJECT/rovapeptides/deploy/hostinger-mu-plugins/`
Destination: `wp-content/mu-plugins/` — **flat, not in a subfolder**; mu-plugins only autoloads
top-level files, and a nested folder fails silently with no error anywhere.

**`rova-edit-cart-button.php` — 5/5 pass**
- Hook: `woocommerce_pay_order_before_payment` (line 55) — renders above the payment options
- Link literal `https://rovapeptides.com/shop?openCart=true` present, pinned to a constant
- Zero `site_url()` / `home_url()` / `WP_HOME` references in executable code
- Styles gated behind `is_checkout_pay_page()`
- Old `woocommerce_pay_order_before_submit` hook fully removed

**`rova-manual-payment-instructions.php` — 8/8 pass**
- Zelle `321-482-6724` · Cash App `$JRandone`
- Order reference via `get_order_number()` in both blocks (sequential-plugin safe)
- Renders on `woocommerce_thankyou` (line 260) and `woocommerce_email_before_order_table` (272)
- Three-layer placeholder suppression all wired:
  1. property blanking — `wp` @5 (206) and `woocommerce_email_before_order_table` @1 (207)
  2. `woocommerce_gateway_description` filter (213)
  3. output buffer — `woocommerce_before_thankyou` @0 (225) → `woocommerce_thankyou` @1 (248),
     flushing before our renderer at @10

**`rova-handoff.php` is now dead code.** It served the old signed-cart architecture that
`c892d96` replaced. Leaving it installed is harmless but it is one more thing that can fire
unexpectedly — worth removing from `mu-plugins/` once the new checkout is confirmed live.

## Phase 3 detail — live endpoints

**`https://rovapeptides.com`** — loads. Title and hero match the current codebase. Hostnames
referenced: `rovapeptides.com`, `shop.rovapeptides.com`. **No `hostingersite.com` or
`palevioletred-koala-953741` anywhere.** No maintenance or coming-soon interstitial.

**`https://shop.rovapeptides.com`** — loads. WooCommerce 10.9.4, Twenty Twenty-Five. Hostnames:
`shop.rovapeptides.com`, `wordpress.org` (footer credit). **No staging references.** No
maintenance mode or login wall.

**`https://shop.rovapeptides.com/wp-json/wc/v3`** — returns a full route index including
`orders`, `products`, `customers`, `coupons`. The headless bridge is live and reachable. Two
observations worth noting: the index is **publicly discoverable without credentials** (normal for
WooCommerce, but it advertises your stack), and the route list includes **Stripe integration
endpoints**, meaning a Stripe plugin is installed on the store — relevant given peptides are a
prohibited vertical for Stripe. See `PAYMENTS_ASSESSMENT.md`.

**Two caveats on this phase.** These were fetched through a content-fetching tool, not `curl -I`,
so I have reachability, payload and hostname evidence but **not raw status codes, redirect chains,
or CORS headers**. And the store's front page renders as a default WordPress blog with a search
prompt rather than a shop — harmless if customers only ever land on `order-pay` and `my-account`,
but anyone who types the bare domain sees an unfinished site.

---

## Launch checklist

1. **`npm run build` locally.** Nothing ships until this passes once.
2. **`git push origin main`** — 4 commits plus the `/shop` fix. Confirm Vercel deploys.
3. **Verify the deploy landed:** `/shop/glp-3` must show batch `GLP3-10-2026-01`, and `/shop`
   must show products with JavaScript disabled.
4. **Re-upload both MU-plugin files** and match the hashes above. Consider removing
   `rova-handoff.php`.
5. **Confirm `WC_CONSUMER_KEY`/`WC_CONSUMER_SECRET` (or the `WOOCOMMERCE_*` aliases) are set in
   Vercel with Read/Write** REST permissions. Read-only returns 401 on order creation.
6. **Place one live test order end to end** with Zelle: confirm the order-pay screen shows the
   Edit Cart link above the payment methods, that the link reopens the storefront drawer, that
   the thank-you page shows `321-482-6724` with the order number and no `[YOUR-ZELLE-...]`
   placeholder, and that the same block arrives in the customer email.
7. **Turn on WooCommerce → Settings → Products → Inventory → Hold stock (minutes)** (~60). Every
   Edit Cart click now leaves an abandoned pending order; without this your admin fills up.

## Known-and-accepted at launch

Two SKUs cannot be purchased (no Woo IDs) and fail cleanly with a named message. KPV has no
product image. 21 of 22 SKUs show "Certificate in queue" rather than a certificate — accurate,
but it is the visible state of most of the catalog, and the GLP-2/GLP-3 renders still carry the
old Tirzepatide/Retatrutide vial labels.
