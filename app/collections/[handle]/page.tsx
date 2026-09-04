import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "../../../components/storefront/site-shell";
import { getCollection } from "../../../lib/shopify/products";

export const revalidate = 900;

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return { title: "Collection Not Found" };
  const title = collection.seo.title || collection.title;
  const description = collection.seo.description || collection.description;
  return { title, description, alternates: { canonical: `/collections/${collection.handle}` } };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 md:px-8 md:pt-20">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">ShoreHitch collection</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">{collection.title}</h1>
        {collection.description && <p className="mt-5 max-w-3xl text-base leading-7 text-white/55">{collection.description}</p>}
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collection.products.nodes.map((product) => (
            <Link key={product.id} href={`/products/${product.handle}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition hover:border-[#4AC9D3]/50">
              <div className="aspect-square overflow-hidden bg-[#111]">
                {product.featuredImage ? <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold">{product.title}</h2>
                <div className="mt-4 font-black">{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
