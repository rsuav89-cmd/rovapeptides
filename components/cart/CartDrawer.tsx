"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, Lock, Check } from "lucide-react";
import { site } from "@/lib/site";
import { money, shippingInsurance, getRecommended } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";

export function CartDrawer() {
  const {
    lines,
    subtotal,
    total,
    count,
    isOpen,
    close,
    setQty,
    remove,
    add,
    insuranceId,
    insuranceTotal,
    setInsurance,
  } = useCart();
  const router = useRouter();

  const threshold = site.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, threshold > 0 ? (subtotal / threshold) * 100 : 100);
  const unlocked = subtotal >= threshold && subtotal > 0;

  const recommended = useMemo(
    () => getRecommended(lines.map((l) => l.product.id), 6),
    [lines]
  );

  function goToCheckout() {
    close();
    router.push("/checkout");
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
            className="absolute inset-0 bg-white/45 backdrop-blur-[2px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper-2 shadow-drawer"
            variants={{ open: { x: 0 }, closed: { x: "100%" } }}
            transition={{ type: "spring", stiffness: 520, damping: 44, mass: 0.8 }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                <h2 className="font-display text-lg font-semibold">Your Cart</h2>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[0.65rem] text-ink-2">
                  {count}
                </span>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full border border-line-strong transition-transform duration-160 ease-out-expo active:scale-90"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {count > 0 && (
              <div className="border-b border-line px-5 py-3.5">
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
              </div>
            )}

            {count === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-paper-2">
                  <ShoppingBag className="h-7 w-7 text-muted" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted">Browse the catalog to add research compounds.</p>
                </div>
                <a href="/shop" onClick={close} className="btn-primary">
                  Shop the Catalog
                </a>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <ul className="px-5 py-4">
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
                          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-gradient-to-br from-paper-2 to-paper">
                            <ProductImage
                              product={line.product}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-display text-sm font-semibold leading-tight">
                                  {line.product.name}
                                </p>
                                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-muted">
                                  {line.product.mass} · {line.product.batch}
                                </p>
                              </div>
                              <button
                                onClick={() => remove(line.product.id)}
                                aria-label={`Remove ${line.product.name}`}
                                className="grid h-7 w-7 place-items-center rounded-full text-muted transition-[color,transform] duration-160 hover:text-ink active:scale-90"
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
                                <span className="w-7 text-center font-mono text-xs tabular-nums">
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
                              <span className="font-mono text-sm font-semibold tabular-nums">
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

                {recommended.length > 0 && (
                  <div className="border-t border-line px-5 py-4">
                    <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
                      Frequently Bought Together
                    </p>
                    <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                      {recommended.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => add(p, 1)}
                          className="flex w-32 shrink-0 flex-col items-start rounded-lg border border-line bg-paper p-2.5 text-left transition-colors duration-160 hover:border-line-strong"
                        >
                          <div className="relative h-16 w-full overflow-hidden rounded-md bg-paper-2">
                            <ProductImage product={p} className="absolute inset-0 h-full w-full object-cover" />
                          </div>
                          <p className="mt-2 line-clamp-1 text-xs font-semibold text-ink">{p.name}</p>
                          <p className="mt-0.5 font-mono text-[0.62rem] text-muted">{money(p.price)}</p>
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[0.65rem] font-medium text-brand-cta">
                            <Plus className="h-3 w-3" strokeWidth={2.4} />
                            Add
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-line px-5 py-4">
                  <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
                    Shipping Protection
                  </p>
                  <div className="mt-3 space-y-2">
                    {shippingInsurance.map((opt) => {
                      const selected = insuranceId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setInsurance(selected ? null : opt.id)}
                          className={[
                            "flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-160",
                            selected ? "border-brand-cta bg-brand-cta/5" : "border-line-strong hover:border-ink-2",
                          ].join(" ")}
                        >
                          <span>
                            <span className="block text-sm font-medium text-ink">{opt.name}</span>
                            <span className="block text-xs text-muted">{opt.description}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold tabular-nums">{money(opt.price)}</span>
                            {selected && <Check className="h-4 w-4 text-brand-cta" strokeWidth={2.4} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {count > 0 && (
              <div className="border-t border-line px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Subtotal</span>
                  <span className="font-mono text-sm tabular-nums">{money(subtotal)}</span>
                </div>
                {insuranceTotal > 0 && (
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-muted">Shipping protection</span>
                    <span className="font-mono text-sm tabular-nums">{money(insuranceTotal)}</span>
                  </div>
                )}
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">Total</span>
                  <span className="font-sans text-xl font-semibold tabular-nums">{money(total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Shipping &amp; taxes calculated at checkout.</p>

                <button onClick={goToCheckout} className="btn-signal mt-4 w-full">
                  <Lock className="h-4 w-4" strokeWidth={2.2} />
                  Proceed to Checkout
                </button>

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
