"use client";

import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft,
    Minus,
    Plus,
    FileCheck2,
    ShieldCheck,
    Truck,
    Snowflake,
    type LucideIcon,
} from "lucide-react";
import { money, productStorageNote, type Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/ProductImage";

export function ProductDetail({ product }: { product: Product }) {
    const { add, open: openCart } = useCart();
    const [qty, setQty] = useState(1);

  function addToCart() {
        add(product, qty);
        openCart();
  }

  return (
        <section className="border-t border-line/70">
              <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:py-14">
                      <Link
                                  href="/shop"
                                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
                                >
                                <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
                                Back to shop
                      </Link>

                        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
                                  <div className="relative aspect-square overflow-hidden rounded-xl2 border border-line bg-gradient-to-br from-paper-2 to-black">
                                              <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(60%_50%_at_65%_20%,rgba(183,110,89,0.35),transparent_60%)]" />
                                              <div className="absolute left-4 top-4 z-10">
                                                            <span className="data-tag border-signal/30 bg-brand-deep/40 text-white/90">
                                                                            Batch · {product.batch}
                                                            </span>
                                              </div>
                                              <ProductImage
                                                              product={product}
                                                              loading="eager"
                                                              className="absolute inset-0 h-full w-full object-contain p-6"
                                                            />
                                  </div>
                                  <div className="flex flex-col">
                                              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal-ink">
                                                {product.categories[0]}
                                              </p>
                                              <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-ink">
                                                {product.name}
                                              </h1>
                                              <p className="mt-1 text-muted">{product.subtitle}</p>
                                  
                                              <div className="mt-4 flex flex-wrap gap-1.5">
                                                            <span className="data-tag">{product.mass}</span>
                                                            <span className="data-tag">{product.purity} purity</span>
                                                            <span className="data-tag">HPLC verified</span>
                                              </div>
                                  
                                              <p className="mt-5 text-sm leading-relaxed text-ink-2">{product.description}</p>
                                  
                                              <div className="mt-5 space-y-2 rounded-xl border border-line bg-paper-2/40 p-3">
                                                            <Spec icon={ShieldCheck} label="Purity" value={`${product.purity} (third-party COA)`} />
                                                            <Spec icon={Snowflake} label="Storage" value={productStorageNote} />
                                                            <Spec icon={Truck} label="Shipping" value="Discreet · ships within 24h" />
                                              </div>
                                  
                                              <Link
                                                              href="/coas"
                                                              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-signal-ink transition-colors hover:text-brand"
                                                            >
                                                            <FileCheck2 className="h-4 w-4" strokeWidth={2} />
                                                            View Certificate of Analysis — {product.batch}
                                              </Link>
                                  
                                              <div className="mt-8 flex items-center gap-3">
                                                            <p className="font-sans text-2xl font-semibold text-ink">{money(product.price)}</p>
                                              </div>
                                  
                                              <div className="mt-4 flex items-center gap-3">
                                                            <div className="flex items-center rounded-full border border-line-strong">
                                                                            <button
                                                                                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                                                                                aria-label="Decrease quantity"
                                                                                                className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-160 ease-out-expo hover:bg-white/[0.04] active:scale-90"
                                                                                              >
                                                                                              <Minus className="h-4 w-4" strokeWidth={2.2} />
                                                                            </button>
                                                                            <span className="w-8 text-center font-mono text-sm tabular-nums">{qty}</span>
                                                                            <button
                                                                                                onClick={() => setQty((q) => q + 1)}
                                                                                                aria-label="Increase quantity"
                                                                                                className="grid h-11 w-11 place-items-center rounded-full transition-transform duration-160 ease-out-expo hover:bg-white/[0.04] active:scale-90"
                                                                                              >
                                                                                              <Plus className="h-4 w-4" strokeWidth={2.2} />
                                                                            </button>
                                                            </div>
                                      
                                                            <button onClick={addToCart} className="btn-signal flex-1">
                                                                            Add {qty > 1 ? `${qty} ` : ""}· {money(product.price * qty)}
                                                            </button>
                                              </div>
                                  </div>
                        </div>
              </div>
        </section>
      );
}

function Spec({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
          <div className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" strokeWidth={1.9} />
                <div className="text-sm">
                        <span className="font-medium text-ink">{label}:</span>{" "}
                          <span className="text-ink-2">{value}</span>
                </div>
          </div>
      );
}
                </div>
              </section>
