"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

// Prefers the real render (`product.photo`, e.g. /products/bpc-157.jpg). If that file
// isn't present yet, it falls back to the branded SVG placeholder (`product.image`).
// Drop real renders into /public/products/ with the photo filenames and they appear
// with zero code change and zero layout shift (the aspect box is owned by the parent).
//
// A native <img> is used deliberately: it keeps the onError → SVG-placeholder swap
// simple and avoids next/image config for what are already-optimized local renders.
// `priority` marks above-the-fold images (eager + high fetch priority); everything
// else stays lazy with async decode so it never blocks the main thread.
export function ProductImage({
  product,
  className = "",
  loading = "lazy",
  priority = false,
  sizes,
}: {
  product: Product;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  sizes?: string;
}) {
  const [src, setSrc] = useState(product.photo);

  // reset when the product changes (e.g. modal / showcase reuse)
  useEffect(() => setSrc(product.photo), [product.photo]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${product.name} (${product.subtitle}) research peptide — ${product.mass}, ${product.purity} purity, batch ${product.batch}`}
      loading={priority ? "eager" : loading}
      // fetchPriority is a valid DOM attribute; cast avoids older React type gaps.
      {...({ fetchpriority: priority ? "high" : "auto" } as Record<string, string>)}
      decoding="async"
      {...(sizes ? { sizes } : {})}
      onError={() => {
        if (src !== product.image) setSrc(product.image);
      }}
      className={className}
    />
  );
}
