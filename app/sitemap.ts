import type { MetadataRoute } from "next";
import { families } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl;
  // Bump when catalog or page content actually changes; a per-deploy timestamp
  // claims every URL changed on every deploy and gets discounted by crawlers.
  const now = new Date("2026-08-02");

  const staticRoutes = [
    "",
    "/shop",
    "/shop/all",
    "/coas",
    "/faq",
    "/contact",
    "/about",
    "/shipping",
    "/privacy",
    "/terms",
    "/wholesale",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.8,
    })),
    // Collection pages (canonical)
    ...collections.map((c) => ({
      url: `${base}/shop/collections/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    // Product-family pages (canonical). Legacy per-SKU URLs 301 → these and are
    // intentionally omitted from the sitemap.
    ...families.map((f) => ({
      url: `${base}/shop/${f.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
