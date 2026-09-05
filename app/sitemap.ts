import type { MetadataRoute } from "next";
import { getProducts } from "../lib/shopify/products";

const STATIC_PATHS = [
  "/",
  "/shop",
  "/why-shorehitch",
  "/which-shorehitch",
  "/how-it-works",
  "/about",
  "/faq",
  "/dealer",
  "/contact",
  "/reviews",
  "/anchor-education",
  "/anchor-education/how-to-anchor-at-a-sandbar",
  "/anchor-education/shoreline-vs-deep-water-anchoring",
  "/anchor-education/choosing-an-anchor-for-your-boat",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.com";
  const now = new Date();
  const products = await getProducts(100).catch(() => []);

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : path.startsWith("/anchor-education/") ? 0.65 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
