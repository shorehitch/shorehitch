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
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: `${siteUrl}/products/${product.handle}`,
    })),
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }} />
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 md:px-8 md:pt-20">
        <div className="max-w-3xl">
          <div className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-[#4AC9D3]">Built for boaters</div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Shop ShoreHitch</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/55 md:text-lg">Anchoring systems and marine accessories engineered for shoreline, sandbar, deep-water and everyday boating use.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            const price = product.priceRange.minVariantPrice;
            return (
              <Link key={product.id} href={`/products/${product.handle}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition hover:-translate-y-0.5 hover:border-[#4AC9D3]/50">
                <div className="aspect-square overflow-hidden bg-[#111]">
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      width={product.featuredImage.width || 1200}
                      height={product.featuredImage.height || 1200}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/30">ShoreHitch</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#4AC9D3]">{product.availableForSale ? "Available" : "Currently unavailable"}</div>
                  <h2 className="text-xl font-bold text-white">{product.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg font-black text-white">{money(price.amount, price.currencyCode)}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4AC9D3]">View product →</span>
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
