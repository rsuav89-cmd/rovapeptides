import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Collection } from "@/lib/collections";

export function CollectionCard({
  collection,
  familyCount,
  className = "",
}: {
  collection: Collection;
  familyCount: number;
  className?: string;
}) {
  return (
    <Link
      href={`/shop/collections/${collection.slug}`}
      className={`group image-stage relative flex flex-col justify-between overflow-hidden rounded-xl2 border border-line p-6 transition-[transform,border-color,box-shadow] duration-280 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift ${className}`}
      style={
        {
          "--c-accent": collection.tokens.accent,
          "--c-glow": collection.tokens.glow,
          "--c-border": collection.tokens.border,
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-60 blur-2xl" style={{ background: "var(--c-glow)" }} />
      <div className="relative">
        <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.18em] collection-accent">
          {collection.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold uppercase leading-tight text-ink">
          {collection.name}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">
          {collection.shortDescription}
        </p>
      </div>
      <div className="relative mt-6 flex items-center justify-between">
        <span className="font-sans text-xs uppercase tracking-widest text-muted">
          {familyCount} {familyCount === 1 ? "product" : "products"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold collection-accent transition-transform duration-160 ease-out-expo group-hover:translate-x-0.5">
          Explore
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </div>
    </Link>
  );
}
