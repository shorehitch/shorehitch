import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "../../components/storefront/site-shell";
import { getProducts } from "../../lib/shopify/products";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Shop Anchoring Systems & Marine Accessories",
  description: "Shop ShoreHitch anchoring systems, dock lines, tether adjusters, swivels, storage and customization options for boating and outdoor use.",
  alternates: { canonical: "/shop" },
};

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

export default async function ShopPage() {
  const products = await getProducts(50);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.com";
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ShoreHitch Products",
    itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.title, url: `${siteUrl}/products/${product.handle}` })),
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />

      <section className="relative overflow-hidden border-b border-white/10 bg-[#070707]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_15%,rgba(74,201,211,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3"><span className="h-px w-8 bg-[#4AC9D3]" /><span className="text-[11px] font-black uppercase tracking-[0.26em] text-[#4AC9D3]">ShoreHitch Collection</span></div>
            <h1 className="text-5xl font-extrabold tracking-[-0.04em] md:text-7xl">Anchoring systems built to look as good as they work.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">Shop current ShoreHitch anchors, accessories and personalization options. Product availability, variants and pricing come directly from Shopify.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 py-5 md:px-8">
          {["Anchors", "Accessories", "Personalization", "Storage", "Docking"].map((label) => <span key={label} className="rounded-full border border-white/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white/45">{label}</span>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const price = product.priceRange.minVariantPrice;
            return (
              <Link key={product.id} href={`/products/${product.handle}`} className="product-card group overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] transition hover:border-[#4AC9D3]/50">
                <div className="relative aspect-square overflow-hidden bg-[#111]">
                  {product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} width={product.featuredImage.width || 1200} height={product.featuredImage.height || 1200} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={index < 3} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center text-sm text-white/30">ShoreHitch</div>}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
                  <span className="absolute left-4 top-4 rounded bg-black/70 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#4AC9D3] backdrop-blur-sm">{product.availableForSale ? "Available" : "Currently unavailable"}</span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold tracking-tight text-white">{product.title}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">{product.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
                    <span className="text-lg font-black text-white">{money(price.amount, price.currencyCode)}</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4AC9D3]">View product →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
