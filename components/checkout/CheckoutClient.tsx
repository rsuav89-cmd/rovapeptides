"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Check, ShoppingBag, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";
import { money } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";

const SHIP_FLAT = 12;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutClient() {
  const { lines, subtotal, count, setQty, remove, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const shipping = subtotal >= site.freeShippingThreshold || subtotal === 0 ? 0 : SHIP_FLAT;
  const total = subtotal + shipping;

  function set(key: keyof typeof f) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setF((s) => ({ ...s, [key]: e.target.value }));
      if (error) setError("");
    };
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(f.email.trim())) return setError("Please enter a valid email address.");
    if (!f.firstName.trim() || !f.lastName.trim()) return setError("Please enter your name.");
    if (!f.address.trim() || !f.city.trim() || !f.zip.trim()) return setError("Please complete your shipping address.");

    setPlacing(true);
    try {
      // Prototype: no live payment yet. When wiring the headless WooCommerce
      // backend, POST the cart + address to a route handler (e.g. /api/checkout)
      // that runs the WPGraphQL checkout mutation (or WooCommerce Store API),
      // then redirect to the returned payment/confirmation URL.
      await new Promise((r) => setTimeout(r, 700));
      const id = `RV-${Date.now().toString().slice(-6)}`;
      setOrderId(id);
      clear();
    } finally {
      setPlacing(false);
    }
  }

  if (orderId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-cta text-white">
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-display-md text-ink">Order confirmed</h1>
        <p className="mt-3 text-ink-2">
          Thanks, {f.firstName || "researcher"} — your order{" "}
          <span className="font-mono text-ink">{orderId}</span> is in. A confirmation is on its way to{" "}
          <span className="text-ink">{f.email}</span>.
        </p>
        <Link href="/" className="btn-signal mt-8">
          Back to store
        </Link>
        <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-widest text-muted">
          {site.compliance}
        </p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-paper-3">
          <ShoppingBag className="h-7 w-7 text-muted" strokeWidth={1.6} />
        </div>
        <h1 className="mt-6 text-display-md text-ink">Your cart is empty</h1>
        <p className="mt-3 text-ink-2">Add a research compound to start an order.</p>
        <Link href="/#catalog" className="btn-signal mt-8">
          Shop the Catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/#catalog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Continue shopping
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <form onSubmit={placeOrder} className="order-2 lg:order-1">
          <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
          <div className="mt-4">
            <input
              type="email"
              value={f.email}
              onChange={set("email")}
              placeholder="Email address"
              autoComplete="email"
              className="rova-input"
            />
          </div>

          <h2 className="mt-8 font-display text-lg font-semibold text-ink">Shipping address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input value={f.firstName} onChange={set("firstName")} placeholder="First name" autoComplete="given-name" className="rova-input" />
            <input value={f.lastName} onChange={set("lastName")} placeholder="Last name" autoComplete="family-name" className="rova-input" />
            <input value={f.address} onChange={set("address")} placeholder="Address" autoComplete="street-address" className="rova-input sm:col-span-2" />
            <input value={f.city} onChange={set("city")} placeholder="City" autoComplete="address-level2" className="rova-input" />
            <div className="grid grid-cols-2 gap-4">
              <input value={f.state} onChange={set("state")} placeholder="State" autoComplete="address-level1" className="rova-input" />
              <input value={f.zip} onChange={set("zip")} placeholder="ZIP" autoComplete="postal-code" className="rova-input" />
            </div>
            <input value={f.country} onChange={set("country")} placeholder="Country" autoComplete="country-name" className="rova-input sm:col-span-2" />
          </div>

          {error && <p className="mt-4 text-sm text-gold">{error}</p>}

          <button type="submit" disabled={placing} className="btn-signal mt-8 w-full disabled:opacity-70">
            <Lock className="h-4 w-4" strokeWidth={2.2} />
            {placing ? "Placing order…" : `Place Order · ${money(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Payment is processed on the next step. {site.compliance}
          </p>
        </form>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl2 border border-line bg-paper-2/60 p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>

            <ul className="mt-4 space-y-4">
              {lines.map((line) => (
                <li key={line.product.id} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-gradient-to-br from-paper-3 to-paper-2">
                    <ProductImage product={line.product} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-display text-sm font-semibold text-ink">{line.product.name}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted">
                      {line.product.mass} · {line.product.batch}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line-strong">
                        <button type="button" onClick={() => setQty(line.product.id, line.qty - 1)} aria-label="Decrease quantity" className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-160 hover:bg-white/[0.04] active:scale-90">
                          <Minus className="h-3 w-3" strokeWidth={2.2} />
                        </button>
                        <span className="w-6 text-center font-mono text-xs tabular-nums">{line.qty}</span>
                        <button type="button" onClick={() => setQty(line.product.id, line.qty + 1)} aria-label="Increase quantity" className="grid h-7 w-7 place-items-center rounded-full transition-transform duration-160 hover:bg-white/[0.04] active:scale-90">
                          <Plus className="h-3 w-3" strokeWidth={2.2} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold tabular-nums">
                          {money(line.product.price * line.qty)}
                        </span>
                        <button type="button" onClick={() => remove(line.product.id)} aria-label={`Remove ${line.product.name}`} className="text-muted transition-colors hover:text-ink">
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="my-5 hairline" />

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-mono tabular-nums text-ink-2">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-mono tabular-nums text-ink-2">{shipping === 0 ? "Free" : money(shipping)}</dd>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-display text-base font-semibold text-ink">Total</dt>
                <dd className="font-sans text-xl font-semibold tabular-nums text-ink">{money(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
