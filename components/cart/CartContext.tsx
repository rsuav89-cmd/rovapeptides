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
import { products, shippingInsurance } from "@/lib/products";

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
  open: () => void;
  close: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

const CART_LINES_KEY = "rova-cart-lines";
const CART_INSURANCE_KEY = "rova-cart-insurance";

function loadStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_LINES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { id: string; qty: number }[];
    return parsed
    .map((entry) => {
      const product = products.find((p) => p.id === entry.id);
      return product ? { product, qty: entry.qty } : null;
    })
    .filter((line): line is CartLine => line !== null && line.qty > 0);
  } catch {
    return [];
  }
}

function loadStoredInsurance(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CART_INSURANCE_KEY);
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
  const [lines, setLines] = useState<CartLine[]>(() => loadStoredLines());
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [insuranceId, setInsuranceId] = useState<string | null>(() => loadStoredInsurance());

  useEffect(() => {
    try {
      const serializable = lines.map((l) => ({ id: l.product.id, qty: l.qty }));
      window.localStorage.setItem(CART_LINES_KEY, JSON.stringify(serializable));
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }, [lines]);

  useEffect(() => {
    try {
      if (insuranceId) {
        window.localStorage.setItem(CART_INSURANCE_KEY, insuranceId);
      } else {
        window.localStorage.removeItem(CART_INSURANCE_KEY);
      }
    } catch {
      // ignore storage failures
    }
  }, [insuranceId]);

  const add = useCallback((p: Product, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === p.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { product: p, qty }];
    });
    setLastAddedId(p.id);
    // clear the "just added" flag so the pulse can retrigger on the next add
    window.setTimeout(() => setLastAddedId((cur) => (cur === p.id ? null : cur)), 900);
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.product.id !== id)
        : prev.map((l) => (l.product.id === id ? { ...l, qty } : l))
    );
  }, []);

  const setInsurance = useCallback((id: string | null) => {
    setInsuranceId(id);
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
      open,
      close,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
