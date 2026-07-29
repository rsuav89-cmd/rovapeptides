"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type QuickViewCtx = {
  product: Product | null;
  isOpen: boolean;
  open: (p: Product) => void;
  close: () => void;
};

const Ctx = createContext<QuickViewCtx | null>(null);

export function useQuickView(): QuickViewCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useQuickView must be used within <QuickViewProvider>");
  return c;
}

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((p: Product) => {
    setProduct(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ product, isOpen, open, close }),
    [product, isOpen, open, close]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
