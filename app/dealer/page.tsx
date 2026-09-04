import type { Metadata } from "next";
import LeadForm from "../components/lead-form";

export const metadata: Metadata = {
  title: "Dealer & Distributor Program",
  description: "Apply to carry ShoreHitch products as an authorized dealer, marina, OEM, retailer, or distributor.",
  alternates: { canonical: "/dealer" },
};

export default function DealerPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:py-28">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#4AC9D3]">Authorized Partner Program</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Bring ShoreHitch to your customers.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
            We work with marine dealers, marinas, distributors, boat builders, and select outdoor and powersports retailers. Submit your business details and our team can review fit, territory, and product mix.
          </p>
          <div className="mt-10 grid gap-4 text-sm text-white/65 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><strong className="block text-white">Premium product line</strong><span className="mt-2 block">Anchoring systems and accessories designed for a broad range of boating environments.</span></div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><strong className="block text-white">Brand support</strong><span className="mt-2 block">Product education, digital assets, and merchandising support for approved accounts.</span></div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><strong className="block text-white">Protected positioning</strong><span className="mt-2 block">Premium pricing discipline and account review help preserve brand value.</span></div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><strong className="block text-white">Scalable relationships</strong><span className="mt-2 block">Programs can support single-location dealers through larger regional opportunities.</span></div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8">
          <LeadForm type="dealer" />
        </div>
      </section>
    </main>
  );
}
