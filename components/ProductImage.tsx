"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";

// Prefers the real render (`product.photo`, e.g. /products/bpc-157.jpg). If that file
// isn't present yet, it falls back to the branded SVG placeholder (`product.image`).
// Drop real renders into /public/products/ with the photo filenames and they appear
// with zero code change and zero layout shift (the aspect box is owned by the parent).
export function ProductImage({
  product,
  className = "",
  loading = "lazy",
}: {
  product: Product;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [src, setSrc] = useState(product.photo);

  // reset when the product changes (e.g. modal / showcase reuse)
  useEffect(() => setSrc(product.photo), [product.photo]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${product.name} research peptide — ${product.mass}`}
      loading={loading}
      onError={() => {
        if (src !== product.image) setSrc(product.image);
      }}
      className={className}
    />
  );
}
