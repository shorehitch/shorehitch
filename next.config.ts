import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3.amazonaws.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/catalog", destination: "/shop", permanent: true },
      { source: "/collections", destination: "/shop", permanent: true },
      { source: "/collections/all", destination: "/shop", permanent: true },
      { source: "/collections/frontpage", destination: "/shop", permanent: true },
      { source: "/products-preview", destination: "/shop", permanent: true },
      { source: "/compare", destination: "/which-shorehitch", permanent: true },
      { source: "/why-shorehitch", destination: "/how-it-works", permanent: true },
      { source: "/pages/where-to-buy", destination: "/dealer", permanent: true },
      {
        source: "/blogs/news/how-to-anchor-your-boat-at-a-sandbar-essential-safety-tips-for-beginners-1",
        destination: "/anchor-education/how-to-anchor-at-a-sandbar",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
