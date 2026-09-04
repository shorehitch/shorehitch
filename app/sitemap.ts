import type { MetadataRoute } from "next";

const STATIC_PATHS = ["/", "/shop", "/compare", "/which-shorehitch", "/how-it-works", "/about", "/faq", "/dealer", "/contact", "/reviews", "/anchor-education"];
const PRODUCT_HANDLES = ["shorehitch", "baby-hitch-18-12", "shorehitch-bucket-pre-order-today", "360-anchor-swivel", "shorehook-tether-adjuster", "custom-dock-lines-pair", "dry-bag-storage", "custom-engraving", "soft-top-handle-dek-x"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.com";
  const now = new Date();
  return [
    ...STATIC_PATHS.map((path) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency: path === "/" ? "weekly" as const : "monthly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...PRODUCT_HANDLES.map((handle) => ({ url: `${siteUrl}/products/${handle}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
}
