import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteShell from "../../../components/storefront/site-shell";

const ARTICLES: Record<string, { title: string; description: string; sections: { heading: string; body: string }[] }> = {
  "how-to-anchor-at-a-sandbar": {
    title: "How to Anchor at a Sandbar",
    description: "A practical sandbar anchoring checklist covering position, ground conditions, line angle and ongoing safety checks.",
    sections: [
      { heading: "Choose the setup before you set the anchor", body: "Look at bottom composition, traffic, wind direction, current and the room your boat will need to swing or move. A sandbar that looks calm can still load an anchor differently as boats pass or the wind changes." },
      { heading: "Set for the direction of load", body: "Anchor placement and line angle matter. The goal is a secure hold with the load applied in a predictable direction rather than relying on a shallow or poorly positioned set." },
      { heading: "Test the hold", body: "Apply load gradually and verify that the anchor remains secure before treating the setup as finished. Re-check after major wakes, wind shifts, current changes or repositioning." },
      { heading: "Use the right ShoreHitch product", body: "Shoreline and sandbar anchoring call for a different approach than deep-water anchoring. Use the product selector when deciding between the Baby ShoreHitch, ShoreHitch OG and Bucket Anchor." },
    ],
  },
  "shoreline-vs-deep-water-anchoring": {
    title: "Shoreline vs. Deep-Water Anchoring",
    description: "Understand why shoreline and deep-water anchoring require different equipment and setup decisions.",
    sections: [
      { heading: "The load path is different", body: "A shoreline anchor is often securing a vessel from land or shallow water while a deep-water anchor works through the water column and bottom. That changes deployment, retrieval and how the system carries load." },
      { heading: "Bottom conditions matter", body: "Sand, compacted ground, mud, rock and mixed bottoms behave differently. No anchoring system should be selected from boat length alone." },
      { heading: "Match the product to the environment", body: "The ShoreHitch OG and Baby ShoreHitch serve shoreline and shallow-water applications, while the Bucket Anchor is intended for deep-water anchoring use cases." },
    ],
  },
  "choosing-an-anchor-for-your-boat": {
    title: "Choosing the Right Anchor Setup",
    description: "How to think about boat size, environment, bottom conditions and anchoring style when selecting equipment.",
    sections: [
      { heading: "Boat length is only one input", body: "Vessel weight, windage, current, line geometry and how you plan to position the boat can matter as much as overall length." },
      { heading: "Start with the environment", body: "Decide whether your primary need is shoreline or sandbar anchoring, a compact PWC setup, or deep-water anchoring. That narrows the product choice immediately." },
      { heading: "Plan the full system", body: "Anchor hardware, line, connection hardware, storage and retrieval all contribute to a usable setup. The best system is one you can deploy correctly and inspect consistently." },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Guide Not Found" };
  return { title: article.title, description: article.description, alternates: { canonical: `/anchor-education/${slug}` } };
}

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export default async function EducationArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <Link href="/anchor-education" className="text-xs font-black uppercase tracking-[0.2em] text-[#4AC9D3]">← Anchor Education</Link>
        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{article.title}</h1>
        <p className="mt-5 text-lg leading-8 text-white/55">{article.description}</p>
        <div className="mt-10 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-black">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-white/50">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
          <div className="text-lg font-black">Need help choosing the hardware?</div>
          <p className="mt-2 text-sm leading-6 text-white/45">Compare the ShoreHitch systems based on your boating environment and intended use.</p>
          <Link href="/which-shorehitch" className="mt-5 inline-flex rounded-lg bg-[#4AC9D3] px-5 py-3 text-xs font-black uppercase tracking-wider text-black">Use the selector</Link>
        </div>
      </article>
    </SiteShell>
  );
}
