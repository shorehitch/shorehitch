import type { MetadataRoute } from "next";
import { getProducts } from "../lib/shopify/products";

const STATIC_PATHS = ["/", "/shop", "/compare", "/which-shorehitch", "/how-it-works", "/about", "/faq", "/dealer", "/contact", "/reviews", "/anchor-education"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.com";
  const now = new Date();
  const products = await getProducts(100).catch(() => []);

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
