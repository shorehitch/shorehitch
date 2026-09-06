"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { trackCommerceEvent } from "@/lib/analytics/events";
import { figmaCardImage } from "@/lib/figma-media";

type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
};
function money(amount:string,currencyCode:string){return new Intl.NumberFormat("en-US",{style:"currency",currency:currencyCode}).format(Number(amount))}
export default function SearchClient(){const router=useRouter(),searchParams=useSearchParams(),urlQuery=searchParams.get("q")?.trim()||"";const[query,setQuery]=useState(urlQuery),[products,setProducts]=useState<Product[]>([]),[loading,setLoading]=useState(false),[searched,setSearched]=useState(false);useEffect(()=>{if(!urlQuery){setProducts([]);setSearched(false);return}let active=true;setQuery(urlQuery);setLoading(true);fetch(`/api/search?q=${encodeURIComponent(urlQuery)}`,{cache:"no-store"}).then(r=>r.ok?r.json():{products:[]}).then(payload=>{if(!active)return;setProducts(payload.products||[]);setSearched(true);trackCommerceEvent("search",{search_term:urlQuery})}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[urlQuery]);function submit(event:FormEvent){event.preventDefault();const q=query.trim();if(q)router.push(`/search?q=${encodeURIComponent(q)}`)}return <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20"><div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">Find your gear</div><h1 className="mt-3 text-4xl font-black md:text-5xl">Search ShoreHitch</h1><form onSubmit={submit} className="mt-8 flex gap-3"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search anchors, dock lines, accessories…" className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#0A0A0A] px-5 py-4 text-white outline-none placeholder:text-white/25 focus:border-[#4AC9D3]"/><button className="rounded-lg bg-[#4AC9D3] px-6 py-4 text-sm font-black uppercase tracking-wider text-black">{loading?"Searching…":"Search"}</button></form>{searched&&products.length===0&&<p className="mt-10 text-white/45">No matching products found.</p>}<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map(product=>{const image=figmaCardImage(product.handle,product.featuredImage?.url);return <Link key={product.id} href={`/products/${product.handle}`} className="group overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] transition hover:border-[#4AC9D3]/45"><div className="relative aspect-square overflow-hidden bg-[#111]">{image?<Image src={image} alt={product.featuredImage?.altText||product.title} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" className="premium-media object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"/>:null}<div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#4AC9D3] py-3 text-center text-sm font-black text-black transition-transform duration-300 group-hover:translate-y-0">View Product →</div></div><div className="p-5"><div className="text-[10px] font-black uppercase tracking-[.17em] text-[#4AC9D3]">ShoreHitch</div><h2 className="mt-2 text-lg font-black text-white">{product.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">{product.description}</p><div className="mt-4 text-base font-black text-white">{money(product.priceRange.minVariantPrice.amount,product.priceRange.minVariantPrice.currencyCode)}</div></div></Link>})}</div></div>}
