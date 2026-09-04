import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../../components/storefront/site-shell";

export const metadata: Metadata = {
  title: "Anchor Education",
  description: "Practical boating anchor education covering sandbars, shoreline setups, deep water and anchor selection.",
  alternates: { canonical: "/anchor-education" },
};

const ARTICLES = [
  { slug: "how-to-anchor-at-a-sandbar", title: "How to Anchor at a Sandbar", excerpt: "A practical checklist for position, line angle, bottom conditions and re-checking your hold." },
  { slug: "shoreline-vs-deep-water-anchoring", title: "Shoreline vs. Deep-Water Anchoring", excerpt: "Why the right anchoring system depends on where the load is coming from and what you're anchoring into." },
  { slug: "choosing-an-anchor-for-your-boat", title: "Choosing the Right Anchor Setup", excerpt: "Think beyond boat length: vessel position, bottom composition, wind, current and use case all matter." },
];

export default function AnchorEducationPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Learn before you set</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Anchor Education</h1>
          <p className="mt-5 text-base leading-7 text-white/55">Practical boating guidance built around the conditions that actually affect anchoring: bottom type, current, wind, vessel position and line geometry.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/anchor-education/${article.slug}`} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 transition hover:border-[#4AC9D3]/45">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[#4AC9D3]">Guide</div>
              <h2 className="mt-3 text-xl font-black">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">{article.excerpt}</p>
              <div className="mt-6 text-xs font-black uppercase tracking-wider text-white/70">Read guide →</div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
