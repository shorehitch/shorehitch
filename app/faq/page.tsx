import type { Metadata } from "next";
import SiteShell from "../../components/storefront/site-shell";

export const metadata: Metadata = {
  title: "ShoreHitch FAQ",
  description: "Answers to common ShoreHitch product, ordering, warranty and use questions.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  ["Where can ShoreHitch be used?", "ShoreHitch products are designed for different boating environments, including shoreline and sandbar anchoring, compact PWC setups, and deep-water applications. Choose the product that matches the actual environment rather than relying on one anchor for every scenario."],
  ["Does ShoreHitch have a warranty?", "ShoreHitch anchor systems are backed by a lifetime warranty. Accessory warranty terms can vary by product, so the product page and current store policy remain the controlling source."],
  ["Can I customize my ShoreHitch?", "Selected ShoreHitch anchor products support custom engraving. The production cart passes engraving text into Shopify as a line attribute so it can stay attached to the order through checkout."],
  ["How is checkout handled?", "Checkout is completed through Shopify. Taxes, discounts, shipping methods, payment processing and the final order are handled by Shopify's checkout flow."],
  ["How quickly will my order ship?", "Processing times can vary by product and customization. We are removing conflicting hard-coded shipping promises from the new storefront; the current product/store shipping policy should be treated as the source of truth."],
  ["Which ShoreHitch should I buy?", "Use the product selector to compare the Baby ShoreHitch, ShoreHitch OG and Bucket Anchor based on your intended boating environment and setup."],
];

export default function FAQPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20">
        <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Questions, answered</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">ShoreHitch FAQ</h1>
        <div className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0A0A0A] px-6">
          {FAQS.map(([question, answer]) => (
            <details key={question} className="group py-5">
              <summary className="cursor-pointer list-none pr-6 text-lg font-bold text-white">{question}</summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/48">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
