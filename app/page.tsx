import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../components/storefront/site-shell";
import { getProduct, getProducts } from "../lib/shopify/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ShoreHitch — Anchoring Systems for Water & Beyond",
  description: "Explore ShoreHitch anchoring systems for boating, deep water and crossover outdoor applications. Compare models, accessories and customization options.",
  alternates: { canonical: "/" },
};

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

const applications = [
  { title: "Boating & Watersports", copy: "Anchoring systems and accessories for boats, PWCs and your time on the water.", href: "/shop" },
  { title: "Deep-Water Anchoring", copy: "Explore the Bucket Anchor and review the available configuration for your boating setup.", href: "/products/shorehitch-bucket-pre-order-today" },
  { title: "Outdoor & Powersports", copy: "Explore crossover applications for outdoor recreation and powersports setups.", href: "/contact" },
  { title: "Trade Shows & Events", copy: "Discuss compatible anchoring options for displays, events and non-marine setups.", href: "/contact" },
];

export default async function HomePage() {
  const [catalog, og, baby, bucket] = await Promise.all([
    getProducts(12).catch(() => []),
    getProduct("shorehitch").catch(() => null),
    getProduct("baby-hitch-18-12").catch(() => null),
    getProduct("shorehitch-bucket-pre-order-today").catch(() => null),
  ]);
  const anchors = [og, baby, bucket].filter(Boolean);
  const featured = catalog.filter((product) => !anchors.some((anchor) => anchor?.id === product.id)).slice(0, 4);

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(74,201,211,0.14),transparent_34%),radial-gradient(circle_at_10%_90%,rgba(0,68,254,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-20 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.28em] text-[#4AC9D3]">ShoreHitch — Anchoring Redefined</div>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl">From shoreline to deep water. <span className="text-white/45">Beyond boating.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">Explore anchoring systems and accessories for boating, outdoor recreation, powersports and trade-show setups. Find the right system for your application—and make it yours.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/which-shorehitch" className="rounded-lg bg-[#4AC9D3] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#6DD8E1]">Find Your Anchor</Link>
              <Link href="/shop" className="rounded-lg border border-white/20 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:border-white/50">Shop All Products</Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-10 rounded-full bg-[#4AC9D3]/10 blur-3xl" />
            {og?.featuredImage ? <img src={og.featuredImage.url} alt={og.featuredImage.altText || og.title} className="relative mx-auto aspect-square w-full max-w-xl rounded-3xl object-cover" /> : <div className="relative aspect-square rounded-3xl border border-white/10 bg-[#0A0A0A]" />}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="max-w-3xl"><div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Built for more than one kind of day</div><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Start with your application.</h2></div>
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {applications.map((item) => <Link key={item.title} href={item.href} className="group rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 transition hover:-translate-y-0.5 hover:border-[#4AC9D3]/60"><div className="text-lg font-black">{item.title}</div><p className="mt-3 text-sm leading-6 text-white/50">{item.copy}</p><div className="mt-6 text-xs font-black uppercase tracking-wider text-[#4AC9D3]">Explore →</div></Link>)}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#070707]">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Choose your system</div><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Three anchors. Different jobs.</h2></div><Link href="/which-shorehitch" className="text-sm font-bold text-[#4AC9D3]">Compare systems →</Link></div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {anchors.map((product) => product && <Link key={product.id} href={`/products/${product.handle}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-black transition hover:border-[#4AC9D3]/50"><div className="aspect-[4/3] overflow-hidden bg-[#111]">{product.featuredImage && <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />}</div><div className="p-6"><div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4AC9D3]">{product.availableForSale ? "Available" : "Currently unavailable"}</div><h3 className="mt-2 text-2xl font-black">{product.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-white/48">{product.description}</p><div className="mt-5 flex items-center justify-between"><span className="font-black">From {money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</span><span className="text-xs font-black uppercase tracking-wider text-[#4AC9D3]">View →</span></div></div></Link>)}
          </div>
        </div>
      </section>

      {featured.length > 0 && <section className="mx-auto max-w-7xl px-5 py-20 md:px-8"><div className="flex items-end justify-between gap-5"><div><div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Complete the setup</div><h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Accessories & personalization</h2></div><Link href="/shop" className="hidden text-sm font-bold text-[#4AC9D3] sm:block">Shop all →</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{featured.map((product) => <Link key={product.id} href={`/products/${product.handle}`} className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]"><div className="aspect-square overflow-hidden bg-[#111]">{product.featuredImage && <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} className="h-full w-full object-cover" />}</div><div className="p-4"><div className="font-bold">{product.title}</div><div className="mt-2 text-sm text-white/50">{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</div></div></Link>)}</div></section>}

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8"><div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] md:grid-cols-2"><div className="p-8 md:p-12"><div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Engineered to be straightforward</div><h2 className="mt-3 text-3xl font-black md:text-4xl">Position. Set. Connect.</h2><p className="mt-5 max-w-xl text-base leading-7 text-white/55">ShoreHitch systems are designed around a simple deployment process. Your exact setup depends on the anchor model, vessel, bottom conditions and environment.</p><Link href="/how-it-works" className="mt-7 inline-block text-sm font-black uppercase tracking-wider text-[#4AC9D3]">See how it works →</Link></div><div className="grid grid-cols-3 border-t border-white/10 md:border-l md:border-t-0">{["01 Position", "02 Set", "03 Connect"].map((step) => <div key={step} className="flex min-h-36 items-center justify-center border-r border-white/10 p-4 text-center text-xs font-black uppercase tracking-wider last:border-r-0 md:min-h-full">{step}</div>)}</div></div></section>

      <section className="border-y border-white/10 bg-[#070707]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-3 md:px-8"><div><div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">Customer feedback</div><h2 className="mt-3 text-3xl font-black">See what owners say.</h2></div><div className="md:col-span-2"><p className="text-lg leading-8 text-white/60">Read published ShoreHitch customer feedback from our review history, without manufactured ratings or rewritten testimonials.</p><Link href="/reviews" className="mt-5 inline-block text-sm font-black uppercase tracking-wider text-[#4AC9D3]">Read reviews →</Link></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8"><div className="rounded-3xl border border-[#4AC9D3]/25 bg-[linear-gradient(135deg,rgba(74,201,211,0.12),rgba(0,0,0,0)_55%)] p-8 md:p-12"><div className="max-w-3xl"><div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Not sure where to start?</div><h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Find the ShoreHitch built for your setup.</h2><p className="mt-5 text-base leading-7 text-white/55">Compare the current systems or tell us about your boat and application. We’ll keep product-specific suitability tied to the actual configuration rather than guessing.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/which-shorehitch" className="rounded-lg bg-[#4AC9D3] px-5 py-3 text-sm font-black uppercase tracking-wider text-black">Compare Anchors</Link><Link href="/contact" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-black uppercase tracking-wider">Discuss Your Setup</Link></div></div></div></section>
    </SiteShell>
  );
}
