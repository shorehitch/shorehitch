import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../../components/storefront/site-shell";
import { getProduct } from "../../lib/shopify/products";

export const metadata: Metadata = {
  title: "Which ShoreHitch Is Right for Me?",
  description: "Compare ShoreHitch anchor systems and choose the right setup for your boat and boating environment.",
  alternates: { canonical: "/which-shorehitch" },
};

const PRODUCTS = [
  { handle: "baby-hitch-18-12", label: "Baby ShoreHitch", bestFor: "PWC, compact vessels and smaller setups" },
  { handle: "shorehitch", label: "ShoreHitch OG", bestFor: "Primary shoreline and sandbar anchoring" },
  { handle: "shorehitch-bucket-pre-order-today", label: "Bucket Anchor", bestFor: "Deep-water anchoring and larger boating setups" },
];

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

export default async function WhichShoreHitchPage() {
  const products = await Promise.all(PRODUCTS.map(async (item) => ({ ...item, product: await getProduct(item.handle).catch(() => null) })));
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Product selector</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Which ShoreHitch is right for you?</h1>
          <p className="mt-5 text-base leading-7 text-white/55 md:text-lg">Start with where you boat and how you plan to anchor. Pricing and availability below come directly from Shopify.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {products.map(({ handle, label, bestFor, product }) => (
            <div key={handle} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#111]">
                {product?.featuredImage ? <img src={product.featuredImage.url} alt={product.featuredImage.altText || label} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#4AC9D3]">{bestFor}</div>
              <h2 className="mt-2 text-2xl font-black">{product?.title || label}</h2>
              {product && <div className="mt-3 font-black text-white">From {money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</div>}
              <p className="mt-3 text-sm leading-6 text-white/45">{product?.description || "Explore this ShoreHitch setup to see current specifications and options."}</p>
              <Link href={`/products/${handle}`} className="mt-6 inline-flex rounded-lg bg-[#4AC9D3] px-5 py-3 text-xs font-black uppercase tracking-wider text-black">View product</Link>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 text-sm leading-7 text-white/50">
          <strong className="text-white">Still deciding?</strong> Choose based on your actual use case rather than boat length alone. Shoreline/sandbar anchoring, compact PWC setups, and deep-water anchoring place different demands on the system.
        </div>
      </section>
    </SiteShell>
  );
}
