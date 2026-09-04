import type { Metadata } from "next";
import StorefrontShell from "../storefront-shell";

const META: Record<string, { title: string; description: string }> = {
  "/": { title: "ShoreHitch — Anchoring Redefined", description: "Premium American-designed anchoring systems and marine accessories for sandbars, shorelines, deep water, and beyond." },
  "/shop": { title: "Shop ShoreHitch", description: "Shop ShoreHitch anchors, tethering systems, dock lines, swivels, cases, and marine accessories." },
  "/how-it-works": { title: "How ShoreHitch Works", description: "See how ShoreHitch anchoring systems set, hold, and secure your boat." },
  "/which-shorehitch": { title: "Which ShoreHitch Is Right for Me?", description: "Compare ShoreHitch anchoring systems and find the right setup for your boat and water." },
  "/about": { title: "About ShoreHitch", description: "Learn the story behind ShoreHitch and our approach to premium marine anchoring equipment." },
  "/faq": { title: "ShoreHitch FAQ", description: "Answers to common questions about ShoreHitch products, use, ordering, and ownership." },
  "/dealer": { title: "Become a ShoreHitch Dealer", description: "Apply to join the ShoreHitch dealer and distribution network." },
  "/contact": { title: "Contact ShoreHitch", description: "Contact the ShoreHitch team for product, order, dealer, or general support." },
  "/reviews": { title: "ShoreHitch Reviews", description: "See verified customer feedback and ShoreHitch experiences." },
};

function pathFromSlug(slug?: string[]) {
  return slug?.length ? `/${slug.join("/")}` : "/";
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  const data = META[path];
  const productHandle = path.match(/^\/products\/([^/]+)$/)?.[1];
  const title = data?.title || (productHandle ? productHandle.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") : "ShoreHitch");
  const description = data?.description || "Explore ShoreHitch premium marine anchoring products and accessories.";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
  };
}

export default function StorefrontPage() {
  return <StorefrontShell />;
}
