import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "../../../components/storefront/site-shell";

const PAGES: Record<string, { eyebrow: string; title: string; copy: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }> = {
  "find-your-anchor": {
    eyebrow: "ShoreHitch — Anchoring Redefined",
    title: "Find the right anchoring system for your setup.",
    copy: "Compare ShoreHitch systems for shoreline, sandbar and deep-water use, then review the current Shopify configuration before ordering.",
    primary: { label: "Compare Anchors", href: "/which-shorehitch" },
    secondary: { label: "Shop All", href: "/shop" },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: "Page Not Found", robots: { index: false, follow: true } };
  return { title: page.title, description: page.copy, alternates: { canonical: `/lp/${slug}` } };
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return <SiteShell><section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 py-20 md:px-8"><div className="max-w-4xl"><div className="text-xs font-black uppercase tracking-[0.25em] text-[#4AC9D3]">{page.eyebrow}</div><h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight md:text-7xl">{page.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/58">{page.copy}</p><div className="mt-8 flex flex-wrap gap-3"><Link href={page.primary.href} className="rounded-lg bg-[#4AC9D3] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black">{page.primary.label}</Link>{page.secondary && <Link href={page.secondary.href} className="rounded-lg border border-white/20 px-6 py-3.5 text-sm font-black uppercase tracking-wider">{page.secondary.label}</Link>}</div></div></section></SiteShell>;
}
