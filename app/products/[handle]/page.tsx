import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "../../../components/storefront/site-shell";
import ProductPurchase from "../../../components/cart/product-purchase";
import ProductView from "../../../components/analytics/product-view";
import { getProduct } from "../../../lib/shopify/products";

export const revalidate = 900;

const ENGRAVABLE_HANDLES = new Set(["shorehitch", "baby-hitch-18-12"]);

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product Not Found" };
  const title = product.seo.title || product.title;
  const description = product.seo.description || product.description;
  return {
    title,
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title,
      description,
      url: `/products/${product.handle}`,
      images: product.featuredImage ? [{ url: product.featuredImage.url, alt: product.featuredImage.altText || product.title }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  let engravingVariantId: string | null = null;
  if (ENGRAVABLE_HANDLES.has(handle)) {
    const engraving = await getProduct("custom-engraving").catch(() => null);
    engravingVariantId = engraving?.variants.nodes.find((variant) => variant.availableForSale)?.id || engraving?.variants.nodes[0]?.id || null;
  }

  const minimum = product.priceRange.minVariantPrice;
  const maximum = product.priceRange.maxVariantPrice;
  const hasRange = minimum.amount !== maximum.amount;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.com";
  const productUrl = `${siteUrl}/products/${product.handle}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.nodes.map((image) => image.url),
    offers: product.variants.nodes.map((variant) => ({
      "@type": "Offer",
      priceCurrency: variant.price.currencyCode,
      price: variant.price.amount,
      availability: variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: productUrl,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
      { "@type": "ListItem", position: 3, name: product.title, item: productUrl },
    ],
  };

  return (
    <SiteShell>
      <ProductView id={product.id} name={product.title} currency={minimum.currencyCode} value={Number(minimum.amount)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-16 lg:gap-16">
        <div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]">
            {product.featuredImage ? (
              <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} className="aspect-square h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-white/30">ShoreHitch</div>
            )}
          </div>
          {product.images.nodes.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.nodes.slice(1, 5).map((image) => (
                <div key={image.url} className="overflow-hidden rounded-lg border border-white/10 bg-[#0A0A0A]">
                  <img src={image.url} alt={image.altText || product.title} className="aspect-square h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:pt-4">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">{product.availableForSale ? "Available to order" : "Currently unavailable"}</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{product.title}</h1>
          <div className="mt-5 text-2xl font-black text-white">
            {hasRange ? `${money(minimum.amount, minimum.currencyCode)} – ${money(maximum.amount, maximum.currencyCode)}` : money(minimum.amount, minimum.currencyCode)}
          </div>
          <p className="mt-6 text-base leading-7 text-white/58">{product.description}</p>

          <div className="my-7 grid grid-cols-3 gap-2 border-y border-white/10 py-5 text-center text-[10px] font-bold uppercase tracking-wider text-white/55">
            <div><span className="block text-[#4AC9D3]">USA</span>Designed</div>
            <div><span className="block text-[#4AC9D3]">Lifetime</span>Anchor Warranty</div>
            <div><span className="block text-[#4AC9D3]">Secure</span>Shopify Checkout</div>
          </div>

          <ProductPurchase variants={product.variants.nodes} enableEngraving={ENGRAVABLE_HANDLES.has(handle)} engravingVariantId={engravingVariantId} />

          <div className="mt-8 space-y-3 text-sm text-white/48">
            <div className="rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-3">Product availability and pricing are pulled directly from Shopify.</div>
            <div className="rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-3">Checkout, taxes, discounts and final shipping options are handled securely by Shopify.</div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
