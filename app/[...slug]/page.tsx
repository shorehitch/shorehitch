import type { Metadata } from "next";
import StorefrontShell from "../storefront-shell";

function pathFromSlug(slug: string[]) {
  return `/${slug.join("/")}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  return {
    title: "ShoreHitch",
    description: "Explore ShoreHitch premium marine anchoring products and accessories.",
    alternates: { canonical: path },
    robots: { index: false, follow: true },
  };
}

export default function LegacyFallbackPage() {
  return <StorefrontShell />;
}
