import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../../components/storefront/site-shell";

export const metadata: Metadata = {
  title: "How ShoreHitch Works",
  description: "Learn the basic ShoreHitch setup flow and how to choose the right anchoring approach for your boating environment.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  { n: "01", title: "Position", body: "Choose a secure location and position the anchor system for the shoreline, sandbar or intended use case." },
  { n: "02", title: "Set", body: "Use the integrated ShoreHitch mechanism to drive and set the system into suitable ground. Confirm the hold before loading the line." },
  { n: "03", title: "Connect", body: "Attach and tension your marine line for the boat position you want, then re-check the setup as conditions change." },
];

export default function HowItWorksPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Simple by design</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Set it. Connect it. Enjoy the water.</h1>
          <p className="mt-5 text-base leading-7 text-white/55 md:text-lg">ShoreHitch was designed to make anchoring more intuitive without turning your day on the water into an equipment project.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
              <div className="text-sm font-black text-[#4AC9D3]">{step.n}</div>
              <h2 className="mt-4 text-2xl font-black">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
          <h2 className="text-xl font-black">Conditions still matter.</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/48">Bottom composition, wind, current, vessel position and line angle all affect anchoring. Use the correct product for the environment, inspect your equipment, and re-check the hold throughout the day.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/which-shorehitch" className="rounded-lg bg-[#4AC9D3] px-5 py-3 text-xs font-black uppercase tracking-wider text-black">Choose your ShoreHitch</Link><Link href="/shop" className="rounded-lg border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-wider text-white">Shop all products</Link></div>
        </div>
      </section>
    </SiteShell>
  );
}
