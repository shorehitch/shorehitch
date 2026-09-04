import type { Metadata } from "next";
import LeadForm from "../components/lead-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ShoreHitch for product, order, partnership, or support questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#4AC9D3]">ShoreHitch Support</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Talk to the team behind the hardware.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
            Product questions, order support, compatibility, partnerships, or something else — send us the details and route it to the right ShoreHitch team.
          </p>
          <div className="mt-10 space-y-4 border-t border-white/10 pt-8 text-sm text-white/55">
            <p>For dealer or distribution inquiries, use our dealer application so we can collect the information needed to review your account.</p>
            <a href="/dealer" className="inline-flex font-semibold text-[#4AC9D3] hover:text-[#6DD8E1]">Dealer & distributor application →</a>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8">
          <LeadForm type="contact" />
        </div>
      </section>
    </main>
  );
}
