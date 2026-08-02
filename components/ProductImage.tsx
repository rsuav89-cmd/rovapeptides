"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

// Prefers the real render (`product.photo`, e.g. /products/bpc-157.jpg) and falls
// back to the branded placeholder (`product.image`) if that file is missing.
//
// Rendered through next/image with `fill`: every call site already places this
// inside a `relative aspect-[4/5]` box, so geometry is unchanged while Next
// generates AVIF/WebP variants per breakpoint. `priority` marks the LCP image
// (preloaded, fetchpriority=high); everything else stays lazy.
const DEFAULT_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 340px";

export function ProductImage({
  product,
  className = "",
  loading = "lazy",
  priority = false,
  sizes = DEFAULT_SIZES,
}: {
  product: Product;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  sizes?: string;
}) {
  const [src, setSrc] = useState(product.photo);
  const eager = priority || loading === "eager";

  // reset when the product changes (e.g. modal / showcase reuse)
  useEffect(() => setSrc(product.photo), [product.photo]);

  return (
    <Image
      src={src}
      alt={`${product.name} (${product.subtitle}) research peptide — ${product.mass}, ${product.purity} purity, batch ${product.batch}`}
      fill
      sizes={sizes}
      priority={eager}
      {...(eager ? {} : { loading: "lazy" as const })}
      onError={() => {
        if (src !== product.image) setSrc(product.image);
      }}
      className={className}
    />
  );
}
