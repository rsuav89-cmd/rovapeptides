"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import type { Product } from "@/lib/products";
import { products, shippingInsurance, isPurchasable } from "@/lib/products";

export type CartLine = { product: Product; qty: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  lastAddedId: string | null;
  insuranceId: string | null;
  insuranceTotal: number;
  total: number;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setInsurance: (id: string | null) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

const CART_LINES_KEY = "rova-cart-lines";
const CART_INSURANCE_KEY = "rova-cart-insurance";

function normalizeQty(qty: unknown): number | null {
  const value = typeof qty === "number" ? qty : Number(qty);
  if (!Number.isFinite(value)) return null;
  const normalized = Math.floor(value);
  return normalized > 0 ? normalized : null;
}

function loadStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_LINES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const { id, qty } = entry as { id?: unknown; qty?: unknown };
        if (typeof id !== "string") return null;
        const safeQty = normalizeQty(qty);
        if (!safeQty) return null;
        const product = products.find((p) => p.id === id);
        return product ? { product, qty: safeQty } : null;
      })
      .filter((line): line is CartLine => line !== null);
  } catch {
    return [];
  }
}

function loadStoredInsurance(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const id = window.localStorage.getItem(CART_INSURANCE_KEY);
    return shippingInsurance.some((o) => o.id === id) ? id : null;
  } catch {
    return null;
  }
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [insuranceId, setInsuranceId] = useState<string | null>(null);

  useEffect(() => {
    setLines(loadStoredLines());
    setInsuranceId(loadStoredInsurance());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const serializable = lines.map((l) => ({ id: l.product.id, qty: l.qty }));
      window.localStorage.setItem(CART_LINES_KEY, JSON.stringify(serializable));
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }, [lines, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (insuranceId) {
        window.localStorage.setItem(CART_INSURANCE_KEY, insuranceId);
      } else {
        window.localStorage.removeItem(CART_INSURANCE_KEY);
      }
    } catch {
      // ignore storage failures
    }
  }, [insuranceId, ready]);

  const add = useCallback((p: Product, qty = 1) => {
    const safeQty = normalizeQty(qty);
    if (!safeQty) return;
    // Commerce invariant: never place an unpriced ($0) SKU into the cart.
    if (!isPurchasable(p)) return;

    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === p.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + safeQty };
        return next;
      }
      return [...prev, { product: p, qty: safeQty }];
    });
    setLastAddedId(p.id);
    window.setTimeout(() => setLastAddedId((cur) => (cur === p.id ? null : cur)), 900);
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const safeQty = normalizeQty(qty);
    setLines((prev) =>
      !safeQty
        ? prev.filter((l) => l.product.id !== id)
        : prev.map((l) => (l.product.id === id ? { ...l, qty: safeQty } : l))
    );
  }, []);

  const setInsurance = useCallback((id: string | null) => {
    setInsuranceId(id);
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setInsuranceId(null);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((a, l) => a + l.qty * l.product.price, 0),
    [lines]
  );
  const insuranceTotal = useMemo(() => {
    const opt = shippingInsurance.find((o) => o.id === insuranceId);
    return opt ? opt.price : 0;
  }, [insuranceId]);
  const total = useMemo(() => subtotal + insuranceTotal, [subtotal, insuranceTotal]);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      isOpen,
      lastAddedId,
      insuranceId,
      insuranceTotal,
      total,
      add,
      remove,
      setQty,
      setInsurance,
      clear,
      open,
      close,
    }),
    [
      lines,
      count,
      subtotal,
      isOpen,
      lastAddedId,
      insuranceId,
      insuranceTotal,
      total,
      add,
      remove,
      setQty,
      setInsurance,
      clear,
      open,
      close,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
