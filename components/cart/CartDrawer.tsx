"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, Lock, Check } from "lucide-react";
import { paymentMethods, site } from "@/lib/site";
import { money, getRecommended, isPurchasable } from "@/lib/products";
import { cartHasIneligible, WC_STORE_BASE } from "@/lib/wc";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";

export function CartDrawer() {
  const { lines, subtotal, count, isOpen, close, setQty, remove, add } = useCart();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threshold = site.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, threshold > 0 ? (subtotal / threshold) * 100 : 100);
  const unlocked = subtotal >= threshold && subtotal > 0;

  const suggestions =
    count > 0 && !unlocked
      ? getRecommended(
          lines.map((l) => l.product.id),
          2
        ).filter(isPurchasable)
      : [];

  // Hand the cart off to WooCommerce. We submit a top-level form POST to
  // /api/checkout (NOT fetch) so the browser follows the route's 302 across to
  // shop.rovapeptides.com/rova-handoff, which rebuilds the WooCommerce cart
  // server-side (HMAC-verified) and redirects on to checkout. A top-level
  // navigation means no CORS and a first-party WooCommerce session cookie.
  function goToCheckout() {
    if (redirecting || lines.length === 0) return;

    // Pre-flight gate. The handoff route rejects unmapped/unpriced SKUs with a
    // JSON 400 — but this is a top-level form POST, so that JSON would replace
    // the page. Catch it here and keep the shopper in the drawer instead.
    if (cartHasIneligible(lines)) {
      setError(
        "One or more items in your cart are not yet available for checkout. Remove them to continue."
      );
      return;
    }

    setError(null);
    setRedirecting(true);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/checkout";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "items";
    input.value = JSON.stringify(
      lines.map((l) => ({ id: l.product.id, qty: l.qty })),
    );

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[75]" initial="closed" animate="open" exit="closed">
          <motion.button
            aria-label="Close cart"
            onClick={close}
            className="absolute inset-0 bg-ink-dark/50 backdrop-blur-[2px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-graphite text-ink shadow-drawer"
            variants={{ open: { x: 0 }, closed: { x: "100%" } }}
            transition={{ type: "spring", stiffness: 520, damping: 44, mass: 0.8 }}
          >
            {/* copper crown — ties the drawer to the brand system */}
            <div aria-hidden className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand to-transparent" />

            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-signal-ink" strokeWidth={2} />
                <h2 className="font-display text-lg font-semibold text-ink">Your Cart</h2>
                <span className="rounded-full border border-brand/30 bg-brand-cta/15 px-2 py-0.5 font-mono text-[0.65rem] text-signal-ink">
                  {count}
                </span>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full border border-line-strong transition-transform duration-160 ease-out-expo hover:border-ink active:scale-90"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* free-shipping progress */}
            {count > 0 && (
              <div className="border-b border-line bg-paper-3/40 px-5 py-3.5">
                <p className="flex items-center gap-1.5 text-[0.8rem] text-ink-2">
                  {unlocked ? (
                    <>
                      <Check className="h-4 w-4 text-signal-ink" strokeWidth={2.4} />
                      <span className="font-medium text-ink">Free shipping unlocked.</span>
                    </>
                  ) : (
                    <>
                      Add <span className="font-mono font-semibold text-ink">{money(remaining)}</span>{" "}
                      more for <span className="font-medium">free shipping</span>
                    </>
                  )}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full origin-left rounded-full bg-brand-cta transition-transform duration-280 ease-out-expo"
                    style={{ transform: `scaleX(${pct / 100})`, width: "100%" }}
                  />
                </div>

                {/* Goal-gradient assist: the shortfall message is only actionable
                    if something is one tap away from closing it. */}
                {suggestions.length > 0 && (
                  <div className="mt-3.5 border-t border-line pt-3">
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                      Add to reach free shipping
                    </p>
                    <ul className="mt-2 space-y-2">
                      {suggestions.map((p) => (
                        <li key={p.id} className="flex items-center gap-2.5">
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-line bg-paper-2">
                            <ProductImage
                              product={p}
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-medium text-ink">
                              {p.name}
                            </span>
                            <span className="block font-mono text-[0.65rem] text-muted">
                              {p.mass} · {money(p.price)}
                            </span>
                          </span>
                          <button
                            onClick={() => add(p, 1)}
                            aria-label={`Add ${p.name} to cart`}
                            className="shrink-0 rounded-full border border-line-strong px-2.5 py-1 text-[0.7rem] font-semibold text-ink transition-colors duration-160 hover:border-brand hover:text-signal-ink"
                          >
                            + Add
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* items / empty */}
            {count === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-line bg-paper-3">
                  <ShoppingBag className="h-7 w-7 text-signal-ink" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold uppercase text-ink">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted">Browse the catalog to add research compounds.</p>
                </div>
                <a href="#catalog" onClick={close} className="btn-signal">
                  Shop the Catalog
                </a>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto px-5 py-4">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.product.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-3 py-3">
                        <div className="image-stage-light relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-line">
                          <ProductImage
                            product={line.product}
                            className="absolute inset-0 h-full w-full object-contain p-1.5"
                          />
                        </div>

                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-display text-sm font-semibold leading-tight text-ink">
                                {line.product.name}
                              </p>
                              <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted">
                                {line.product.mass} · {line.product.batch}
                              </p>
                            </div>
                            <button
                              onClick={() => remove(line.product.id)}
                              aria-label={`Remove ${line.product.name}`}
                              className="grid h-7 w-7 place-items-center rounded-full text-muted transition-[color,transform] duration-160 hover:text-signal-ink active:scale-90"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-line-strong">
                              <button
                                onClick={() => setQty(line.product.id, line.qty - 1)}
                                aria-label="Decrease quantity"
                                className="grid h-8 w-8 place-items-center rounded-full transition-transform duration-160 hover:bg-white/[0.04] active:scale-90"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={2.2} />
                              </button>
                              <span className="w-7 text-center font-mono text-xs tabular-nums text-ink">
                                {line.qty}
                              </span>
                              <button
                                onClick={() => setQty(line.product.id, line.qty + 1)}
                                aria-label="Increase quantity"
                                className="grid h-8 w-8 place-items-center rounded-full transition-transform duration-160 hover:bg-white/[0.04] active:scale-90"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                              </button>
                            </div>
                            <span className="font-mono text-sm font-semibold tabular-nums text-ink">
                              {money(line.product.price * line.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hairline" />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {/* footer */}
            {count > 0 && (
              <div className="border-t border-line bg-paper-3/40 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="font-sans text-xl font-semibold tabular-nums text-signal-ink">
                    {money(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">Shipping &amp; taxes calculated at checkout.</p>
                <p className="mt-2 text-[0.7rem] leading-relaxed text-muted">
                  COA match guarantee — if a vial does not match the certificate published for its
                  batch, we replace or refund it.
                </p>

                {error && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg border border-brand/40 bg-brand-cta/10 px-3 py-2 text-xs leading-relaxed text-ink"
                  >
                    {error}
                  </p>
                )}

                <button
                  onClick={goToCheckout}
                  disabled={redirecting}
                  className="btn-signal mt-4 w-full disabled:opacity-70"
                >
                  <Lock className="h-4 w-4" strokeWidth={2.2} />
                  {redirecting ? "Redirecting…" : "Proceed to Checkout"}
                </button>

                {/* Destination + payment disclosure: the handoff leaves this domain,
                    and an unannounced domain change is a top abandonment driver. */}
                <p className="mt-2.5 text-center text-[0.7rem] leading-relaxed text-muted">
                  Encrypted checkout on {WC_STORE_BASE.replace(/^https?:\/\//, "")}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  {paymentMethods.map((pm) => (
                    <span
                      key={pm.label}
                      className={`rounded px-1.5 py-0.5 text-[0.6rem] ${pm.className}`}
                    >
                      {pm.label}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-widest text-muted">
                  {site.compliance}
                </p>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
