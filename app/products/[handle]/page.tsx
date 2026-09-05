import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "../../../components/storefront/site-shell";
import ProductPurchase from "../../../components/cart/product-purchase";
import ProductView from "../../../components/analytics/product-view";
import { getProduct, getProducts } from "../../../lib/shopify/products";

export const revalidate = 900;

const ENGRAVABLE_HANDLES = new Set(["shorehitch", "baby-hitch-18-12"]);
const ANCHOR_HANDLES = new Set(["shorehitch", "baby-hitch-18-12", "shorehitch-bucket-pre-order-today"]);

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product Not Found" };
  const title = product.seo.title || product.title;
  const description = product.seo.description || product.description;
  return { title, description, alternates: { canonical: `/products/${product.handle}` }, openGraph: { title, description, url: `/products/${product.handle}`, images: product.featuredImage ? [{ url: product.featuredImage.url, alt: product.featuredImage.altText || product.title }] : [] } };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [product, catalog] = await Promise.all([getProduct(handle), getProducts(20).catch(() => [])]);
  if (!product) notFound();

  let engravingVariantId: string | null = null;
  if (ENGRAVABLE_HANDLES.has(handle)) {
    const engraving = await getProduct("custom-engraving").catch(() => null);
    engravingVariantId = engraving?.variants.nodes.find((variant) => variant.availableForSale)?.id || engraving?.variants.nodes[0]?.id || null;
  }

  const related = catalog.filter((item) => item.id !== product.id && item.handle !== "custom-engraving" && item.availableForSale).slice(0, 4);
  const minimum = product.priceRange.minVariantPrice;
  const maximum = product.priceRange.maxVariantPrice;
  const hasRange = minimum.amount !== maximum.amount;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.com";
  const productUrl = `${siteUrl}/products/${product.handle}`;
  const logoUploadsEnabled = process.env.NEXT_PUBLIC_ENGRAVING_LOGO_UPLOADS_ENABLED === "true";
  const isAnchor = ANCHOR_HANDLES.has(handle);

  const productJsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.title, description: product.description, image: product.images.nodes.map((image) => image.url), offers: product.variants.nodes.map((variant) => ({ "@type": "Offer", priceCurrency: variant.price.currencyCode, price: variant.price.amount, availability: variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: productUrl })) };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` }, { "@type": "ListItem", position: 3, name: product.title, item: productUrl }] };

  return (
    <SiteShell>
      <ProductView id={product.id} name={product.title} currency={minimum.currencyCode} value={Number(minimum.amount)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35 md:px-8"><Link href="/shop" className="transition hover:text-[#4AC9D3]">Shop</Link><span className="px-2">/</span><span className="text-white/55">{product.title}</span></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 md:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div>
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">
            {product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} width={product.featuredImage.width || 1400} height={product.featuredImage.height || 1400} sizes="(max-width: 1024px) 100vw, 54vw" priority className="aspect-square h-full w-full object-cover" /> : <div className="flex aspect-square items-center justify-center text-white/30">ShoreHitch</div>}
            <div className="absolute left-4 top-4 rounded bg-black/70 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#4AC9D3] backdrop-blur-sm">{product.availableForSale ? "Available" : "Currently unavailable"}</div>
          </div>
          {product.images.nodes.length > 1 ? <div className="mt-4 grid grid-cols-4 gap-3">{product.images.nodes.slice(1, 5).map((image) => <div key={image.url} className="overflow-hidden rounded-lg border border-white/10 bg-[#0A0A0A]"><Image src={image.url} alt={image.altText || product.title} width={image.width || 600} height={image.height || 600} sizes="25vw" className="aspect-square h-full w-full object-cover" /></div>)}</div> : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-4 flex items-center gap-3"><span className="h-px w-7 bg-[#4AC9D3]" /><span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#4AC9D3]">{product.availableForSale ? "Ready to configure" : "Current product details"}</span></div>
          <h1 className="text-4xl font-extrabold tracking-[-0.035em] md:text-6xl">{product.title}</h1>
          <div className="mt-5 text-2xl font-black text-white">{hasRange ? `${money(minimum.amount, minimum.currencyCode)} – ${money(maximum.amount, maximum.currencyCode)}` : money(minimum.amount, minimum.currencyCode)}</div>
          <p className="mt-6 text-base leading-7 text-white/55">{product.description}</p>

          <div className="my-7 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 text-center text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
            <div className="bg-[#0A0A0A] px-3 py-4"><span className="mb-1 block text-[#4AC9D3]">USA</span>Designed</div>
            <div className="bg-[#0A0A0A] px-3 py-4"><span className="mb-1 block text-[#4AC9D3]">{isAnchor ? "Lifetime" : "Current"}</span>{isAnchor ? "Anchor Warranty" : "Product Support"}</div>
            <div className="bg-[#0A0A0A] px-3 py-4"><span className="mb-1 block text-[#4AC9D3]">Secure</span>Shopify Checkout</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#070707] p-5 md:p-6"><ProductPurchase productId={product.id} productName={product.title} variants={product.variants.nodes} enableEngraving={ENGRAVABLE_HANDLES.has(handle)} engravingVariantId={engravingVariantId} logoUploadsEnabled={logoUploadsEnabled} /></div>

          <div className="mt-5 grid gap-3 text-sm text-white/45 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-4"><span className="block text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Commerce data</span><span className="mt-1 block">Price, variants and availability come directly from Shopify.</span></div>
            <div className="rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-4"><span className="block text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Checkout</span><span className="mt-1 block">Taxes, discounts and shipping options are finalized securely in Shopify.</span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0A0A0A] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-3 md:px-8">
          <div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4AC9D3]">01 · Configure</div><h2 className="mt-3 text-xl font-bold">Choose the actual Shopify option.</h2><p className="mt-2 text-sm leading-6 text-white/45">The selected variant—not a visual placeholder—is what moves into cart and checkout.</p></div>
          <div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4AC9D3]">02 · Personalize</div><h2 className="mt-3 text-xl font-bold">Add engraving where supported.</h2><p className="mt-2 text-sm leading-6 text-white/45">Text and logo artwork stay associated with the configured engraving line for fulfillment.</p></div>
          <div><div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4AC9D3]">03 · Checkout</div><h2 className="mt-3 text-xl font-bold">Finish securely with Shopify.</h2><p className="mt-2 text-sm leading-6 text-white/45">Your order continues into Shopify’s native checkout for payment, taxes and shipping.</p></div>
        </div>
      </section>

      {related.length > 0 ? <section className="mx-auto max-w-7xl px-5 py-20 md:px-8"><div className="flex items-end justify-between gap-5"><div><div className="mb-3 flex items-center gap-3"><span className="h-px w-7 bg-[#4AC9D3]" /><span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4AC9D3]">Build your setup</span></div><h2 className="text-3xl font-bold tracking-tight md:text-4xl">More from ShoreHitch</h2></div><Link href="/shop" className="hidden text-sm font-bold text-[#4AC9D3] sm:block">Shop all →</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <Link key={item.id} href={`/products/${item.handle}`} className="product-card group overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]"><div className="relative aspect-square overflow-hidden bg-[#111]">{item.featuredImage ? <Image src={item.featuredImage.url} alt={item.featuredImage.altText || item.title} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" /> : null}</div><div className="p-5"><div className="font-bold text-white">{item.title}</div><div className="mt-2 text-sm font-black text-[#4AC9D3]">{money(item.priceRange.minVariantPrice.amount, item.priceRange.minVariantPrice.currencyCode)}</div></div></Link>)}</div></section> : null}
    </SiteShell>
  );
}
