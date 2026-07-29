"use client";

import { CartProvider } from "@/components/cart/CartContext";
import { QuickViewProvider } from "@/components/quickview/QuickViewContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductModal } from "@/components/catalog/ProductModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <QuickViewProvider>
        {children}
        {/* global overlays — mounted once, driven by context */}
        <CartDrawer />
        <ProductModal />
      </QuickViewProvider>
    </CartProvider>
  );
}
