"use client";

import dynamic from "next/dynamic";
import { CartProvider } from "@/components/cart/CartContext";

// The drawer is closed on every first paint; load it with the first interaction.
const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
