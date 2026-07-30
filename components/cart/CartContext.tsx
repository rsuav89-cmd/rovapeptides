"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/products";

export type CartLine = { product: Product; qty: number };

const STORAGE_KEY = "rova-cart-v1";

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  lastAddedId: string | null;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within <CartProvider>");
  return c;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [lines, hydrated]);

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

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((a, l) => a + l.qty * l.product.price, 0),
    [lines]
  );

  const value = useMemo(
    () => ({ lines, count, subtotal, isOpen, lastAddedId, add, remove, setQty, clear, open, close }),
    [lines, count, subtotal, isOpen, lastAddedId, add, remove, setQty, clear, open, close]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
