"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { RevealController } from "@/components/Reveal";
import { CartProvider } from "@/components/cart/CartContext";

// The drawer is closed on every first paint; load it with the first interaction.
const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // `reducedMotion="user"` is the only thing that reaches Framer Motion: the
    // CSS media query overrides durations, but Framer drives rAF and ignores it.
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <RevealController />
        {children}
        <CartDrawer />
      </CartProvider>
    </MotionConfig>
  );
}
