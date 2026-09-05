"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { trackCommerceEvent } from "@/lib/analytics/events";

type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

export default function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() || "";
  const [query, setQuery] = useState(urlQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!urlQuery) {
      setProducts([]);
      setSearched(false);
      return;
    }

    let active = true;
    setQuery(urlQuery);
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(urlQuery)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { products: [] })
      .then((payload) => {
        if (!active) return;
        setProducts(payload.products || []);
        setSearched(true);
        trackCommerceEvent("search", { search_term: urlQuery });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [urlQuery]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-8 md:py-20">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">Find your gear</div>
      <h1 className="mt-3 text-4xl font-black md:text-5xl">Search ShoreHitch</h1>
      <form onSubmit={submit} className="mt-8 flex gap-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anchors, dock lines, accessories…" className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#0A0A0A] px-5 py-4 text-white outline-none placeholder:text-white/25 focus:border-[#4AC9D3]" />
        <button className="rounded-lg bg-[#4AC9D3] px-6 py-4 text-sm font-black uppercase tracking-wider text-black">{loading ? "Searching…" : "Search"}</button>
      </form>

      {searched && products.length === 0 && <p className="mt-10 text-white/45">No matching products found.</p>}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.handle}`} className="flex gap-4 rounded-xl border border-white/10 bg-[#0A0A0A] p-4 transition hover:border-[#4AC9D3]/45">
            <div className="h-24 w-24 flex-none overflow-hidden rounded-lg bg-[#111]">{product.featuredImage ? <Image src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} width={192} height={192} sizes="96px" className="h-full w-full object-cover" /> : null}</div>
            <div className="min-w-0">
              <h2 className="font-bold text-white">{product.title}</h2>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">{product.description}</p>
              <div className="mt-2 text-sm font-black text-[#4AC9D3]">{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
