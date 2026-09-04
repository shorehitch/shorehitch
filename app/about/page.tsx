import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../../components/storefront/site-shell";

export const metadata: Metadata = {
  title: "About ShoreHitch",
  description: "Learn the story and product philosophy behind ShoreHitch marine anchoring systems.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Born on the water</div>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Anchoring gear should work better — and look like it belongs on your boat.</h1>
            <p className="mt-6 text-base leading-8 text-white/55">ShoreHitch is a family-owned marine brand focused on premium anchoring systems and accessories designed in the USA. The product line grew from a simple idea: make boating setup easier, more intuitive, more customizable and worthy of the boats people work hard to own.</p>
            <p className="mt-4 text-base leading-8 text-white/55">That same approach carries across the ShoreHitch OG, Baby ShoreHitch, Bucket Anchor and supporting accessories — build purposefully, protect the customer experience and keep improving the gear.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="rounded-lg bg-[#4AC9D3] px-6 py-4 text-xs font-black uppercase tracking-wider text-black">Shop ShoreHitch</Link><Link href="/how-it-works" className="rounded-lg border border-white/15 px-6 py-4 text-xs font-black uppercase tracking-wider text-white">How it works</Link></div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-7">
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
              <div><div className="text-2xl font-black text-[#4AC9D3]">USA</div><div className="mt-1 text-sm text-white/50">Designed with a premium marine-first approach.</div></div>
              <div><div className="text-2xl font-black text-[#4AC9D3]">Lifetime</div><div className="mt-1 text-sm text-white/50">Warranty on ShoreHitch anchor systems.</div></div>
              <div><div className="text-2xl font-black text-[#4AC9D3]">Custom</div><div className="mt-1 text-sm text-white/50">Color and engraving options on selected products.</div></div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
