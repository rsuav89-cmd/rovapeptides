import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl;
  const staticRoutes = [
    "",
    "/shop",
    "/coas",
    "/faq",
    "/contact",
    "/about",
    "/shipping",
    "/privacy",
    "/terms",
    "/wholesale",
    "/track-order",
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/shop/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
