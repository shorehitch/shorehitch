import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "../../../components/storefront/site-shell";
import ProductGallery from "../../../components/storefront/product-gallery";
import ProductCard from "../../../components/storefront/product-card";
import ProductPurchase from "../../../components/cart/product-purchase";
import ProductView from "../../../components/analytics/product-view";
import { getProduct, getProducts } from "../../../lib/shopify/products";
import { figmaMedia } from "../../../lib/figma-media";

export const revalidate=900;
const ENGRAVABLE_HANDLES=new Set(["shorehitch","baby-hitch-18-12"]);
const ANCHOR_HANDLES=new Set(["shorehitch","baby-hitch-18-12","shorehitch-bucket-pre-order-today"]);
const PRODUCT_META:Record<string,{tag:string;badge:string;rating:string;reviews:string}>={
 shorehitch:{tag:"Flagship Anchor",badge:"Best Seller",rating:"5.0",reviews:"18 verified reviews"},
 "baby-hitch-18-12":{tag:"PWC Anchor",badge:"Jet Ski Ready",rating:"5.0",reviews:"7 verified reviews"},
 "shorehitch-bucket-pre-order-today":{tag:"Deep Water",badge:"Pre-Order",rating:"New",reviews:"Current product"},
 "custom-engraving":{tag:"Personalization",badge:"Made to Order",rating:"5.0",reviews:"14 reviews"},
};
function money(a:string,c:string){return new Intl.NumberFormat("en-US",{style:"currency",currency:c}).format(Number(a))}
export async function generateMetadata({params}:{params:Promise<{handle:string}>}):Promise<Metadata>{const{handle}=await params,p=await getProduct(handle);if(!p)return{title:"Product Not Found"};const title=p.seo.title||p.title,description=p.seo.description||p.description;return{title,description,alternates:{canonical:`/products/${p.handle}`},openGraph:{title,description,url:`/products/${p.handle}`,images:p.featuredImage?[{url:p.featuredImage.url,alt:p.featuredImage.altText||p.title}]:[]}}}

export default async function ProductPage({params}:{params:Promise<{handle:string}>}){
 const{handle}=await params;
 const[product,catalog]=await Promise.all([getProduct(handle),getProducts(20).catch(()=>[])]);
 if(!product)notFound();
 let engravingVariantId:string|null=null,softTop=null,hardCase=null;
 if(ENGRAVABLE_HANDLES.has(handle)){
  const[e,s,h]=await Promise.all([getProduct("custom-engraving").catch(()=>null),getProduct("soft-top-handle-dek-x").catch(()=>null),getProduct("dry-bag-storage").catch(()=>null)]);
  engravingVariantId=e?.variants.nodes.find(v=>v.availableForSale)?.id||e?.variants.nodes[0]?.id||null;
  const sv=s?.variants.nodes.find(v=>v.availableForSale)||s?.variants.nodes[0];const hv=h?.variants.nodes.find(v=>v.availableForSale)||h?.variants.nodes[0];
  if(s&&sv)softTop={variantId:sv.id,title:s.title,price:sv.price.amount,currencyCode:sv.price.currencyCode};
  if(h&&hv)hardCase={variantId:hv.id,title:h.title,price:hv.price.amount,currencyCode:hv.price.currencyCode};
 }
 const related=catalog.filter(i=>i.id!==product.id&&i.handle!=="custom-engraving"&&i.availableForSale).slice(0,4);
 const minimum=product.priceRange.minVariantPrice,maximum=product.priceRange.maxVariantPrice,hasRange=minimum.amount!==maximum.amount;
 const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||"https://shorehitch.com",productUrl=`${siteUrl}/products/${product.handle}`;
 const logoUploadsEnabled=process.env.NEXT_PUBLIC_ENGRAVING_LOGO_UPLOADS_ENABLED==="true",isAnchor=ANCHOR_HANDLES.has(handle),meta=PRODUCT_META[handle]||{tag:"ShoreHitch",badge:"Available",rating:"",reviews:""};
 const curated=figmaMedia(handle),fallback=product.images.nodes.map(i=>({type:"image" as const,src:i.url})),media=curated.length?curated:fallback;
 const productJsonLd={"@context":"https://schema.org","@type":"Product",name:product.title,description:product.description,image:media.filter(m=>m.type==="image").map(m=>m.src),offers:product.variants.nodes.map(v=>({"@type":"Offer",priceCurrency:v.price.currencyCode,price:v.price.amount,availability:v.availableForSale?"https://schema.org/InStock":"https://schema.org/OutOfStock",url:productUrl}))};
 const reviews=[
  {name:"Donnie Jones",location:"Phoenix, AZ",stars:5,text:"They work awesome on my 32' Sunsation on the sandbars!",photos:["https://s3.amazonaws.com/me.judge.review-images/shorehitch/1754354314__img_2059__original.jpeg","https://s3.amazonaws.com/me.judge.review-images/shorehitch/1754354317__img_2066__original.jpeg"]},
  {name:"Ryan T.",location:"Lake Havasu City, AZ",stars:5,text:"Just when I didn't think it could get any better they delivered amazing upgrades.",photos:["https://s3.amazonaws.com/me.judge.review-images/shorehitch/1755960942__img_6323__original.jpeg","https://s3.amazonaws.com/me.judge.review-images/shorehitch/1755960936__img_6322__original.jpeg"]},
  {name:"Scott B.",location:"Idaho",stars:5,text:"The ease of use is unmatched, and it is a beautiful piece as well.",photos:["https://s3.amazonaws.com/me.judge.review-images/shorehitch/1750340784__img_0642__original.jpeg"]}
 ];
 return <SiteShell>
  <ProductView id={product.id} name={product.title} currency={minimum.currencyCode} value={Number(minimum.amount)}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(productJsonLd).replace(/</g,"\\u003c")}}/>
  <section className="border-b border-white/10 bg-black"><div className="mx-auto max-w-7xl px-5 py-4 text-xs font-bold uppercase tracking-[.16em] text-white/50 md:px-8"><Link href="/shop" className="hover:text-[#4AC9D3]">Shop</Link><span className="px-2">/</span><span className="text-white/70">{product.title}</span></div></section>
  <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
   <ProductGallery media={media} title={product.title}/>
   <div className="lg:sticky lg:top-32 lg:self-start">
    <div className="mb-4 flex flex-wrap gap-2"><span className="rounded bg-[#0044FE] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">{meta.badge}</span>{isAnchor&&<span className="rounded border border-[#4AC9D3]/30 bg-[#4AC9D3]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#4AC9D3]">Patent Pending</span>}<span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white/70">🇺🇸 Designed in USA</span></div>
    <div className="text-xs font-black uppercase tracking-[.18em] text-[#4AC9D3]">{meta.tag}</div>
    <h1 className="mt-2 text-4xl font-extrabold tracking-[-.035em] md:text-5xl">{product.title}</h1>
    {meta.rating&&<div className="mt-3 flex items-center gap-3"><span className="text-[#4AC9D3]">★★★★★</span><span className="text-sm font-semibold text-white/60">{meta.rating} · {meta.reviews}</span></div>}
    <div className="mt-5 text-3xl font-black">{hasRange?`${money(minimum.amount,minimum.currencyCode)} – ${money(maximum.amount,maximum.currencyCode)}`:money(minimum.amount,minimum.currencyCode)}</div>
    <p className="mt-5 text-base font-medium leading-7 text-white/70">{product.description}</p>
    <div className="mt-6 rounded-xl border border-white/10 bg-[#070707] p-5 md:p-6"><ProductPurchase productId={product.id} productName={product.title} variants={product.variants.nodes} enableEngraving={ENGRAVABLE_HANDLES.has(handle)} engravingVariantId={engravingVariantId} logoUploadsEnabled={logoUploadsEnabled} softTop={softTop} hardCase={hardCase}/></div>
    {handle==="baby-hitch-18-12"&&<div className="mt-4 rounded-xl border border-[#4AC9D3]/25 bg-gradient-to-r from-[#4AC9D3]/10 to-[#0044FE]/10 p-5"><div className="text-[10px] font-black uppercase tracking-widest text-[#4AC9D3]">Compact by Design</div><div className="mt-3 grid grid-cols-2 gap-4 text-center"><div><div className="text-2xl font-black">Baby Hitch</div><div className="text-xs text-white/50">Compact ShoreHitch format</div></div><div className="border-l border-white/10"><div className="text-2xl font-black text-white/50">OG</div><div className="text-xs text-white/40">Full-size format</div></div></div></div>}
    <div className="mt-4 grid grid-cols-3 gap-3">{[[isAnchor?"Lifetime Warranty":"Product Support","🛡️"],["Designed in USA","🇺🇸"],["Shopify Checkout","✓"]].map(([label,icon])=><div key={label} className="rounded-lg border border-white/10 bg-[#0A0A0A] p-3 text-center"><div className="text-[#4AC9D3]">{icon}</div><div className="mt-1 text-[10px] font-bold text-white/60">{label}</div></div>)}</div>
   </div>
  </section>
  {isAnchor&&<section className="mx-auto max-w-7xl border-t border-white/10 px-5 py-16 md:px-8"><div className="mb-4 text-xs font-black uppercase tracking-[.18em] text-white/50">Family run, family owned. Every feature was designed around real on-water frustrations.</div><h2 className="text-3xl font-black md:text-4xl">Tired of Fighting Your Anchor?<br/><span className="steel-text">Meet the ShoreHitch approach.</span></h2>{handle==="baby-hitch-18-12"&&<div className="mt-8 grid grid-cols-2 gap-4"><div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"><Image src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/7740C8BA-0192-49AD-B6D8-7DAA70E45FE1_2.png?v=1787845142" alt="Baby ShoreHitch" fill sizes="50vw" className="premium-media object-cover"/></div><div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"><Image src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/00852E52-F824-4A41-8548-5AE33530A3CC_2.png?v=1787845143" alt="Baby ShoreHitch" fill sizes="50vw" className="premium-media object-cover"/></div></div>}<div className="mt-8 grid grid-cols-2 gap-4">{[["Easy to Set","Integrated slide-handle design keeps setup straightforward."],["Holds Steady","Purpose-built geometry is designed for a secure ShoreHitch setup."],["Built to Last","Marine-focused materials and finishes are selected for long-term use."],["Premium Look","Color and engraving options let the system match your boat and setup."]].map(([t,c])=><div key={t} className="rounded-xl border border-white/10 bg-[#0A0A0A] p-5"><div className="text-xs font-black uppercase tracking-widest text-[#4AC9D3]">{t}</div><p className="mt-2 text-base font-semibold leading-7 text-white/75">{c}</p></div>)}</div></section>}
  {isAnchor&&<section className="border-y border-white/10 bg-[#0A0A0A]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8"><div className="relative aspect-[3/4] overflow-hidden rounded-xl"><Image src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/shorehitch-2025-tom-leigh--37.jpg?v=1783627028" alt="ShoreHitch in use" fill sizes="50vw" className="premium-media object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/></div><div className="flex flex-col justify-center"><h2 className="text-4xl font-black">Anchor</h2><h3 className="text-3xl font-black text-white/60">Smarter in 3 Steps</h3><div className="mt-7">{[["01","Position","Place the ShoreHitch where your setup calls for it."],["02","Set","Use the integrated mechanism to establish the anchor in suitable bottom conditions."],["03","Connect","Secure your line and finish the setup for the conditions around you."]].map(([n,t,c],i)=><div key={n} className={`py-5 ${i<2?"border-b border-white/10":""}`}><div className="flex gap-4"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#4AC9D3]/30 bg-[#4AC9D3]/10 text-xs font-black text-[#4AC9D3]">{n}</div><div><div className="font-black">{t}</div><p className="mt-1 text-base font-semibold leading-7 text-white/70">{c}</p></div></div></div>)}</div><Link href="/how-it-works" className="mt-6 inline-flex w-fit rounded bg-white px-8 py-4 text-sm font-black text-black">SEE HOW IT WORKS</Link></div></div></section>}
  <section className="mx-auto max-w-7xl px-5 py-16 md:px-8"><div className="mb-8 flex items-center gap-3"><span className="h-px w-6 bg-[#4AC9D3]"/><h2 className="text-2xl font-black">Customer Reviews</h2></div><div className="grid gap-5 md:grid-cols-3">{reviews.map(r=><article key={r.name} className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">{r.photos.length?<div className="flex h-36 gap-px">{r.photos.map((src,i)=><div key={src} className="relative flex-1"><Image src={src} alt="" fill sizes="33vw" className="object-cover"/></div>)}</div>:null}<div className="p-5"><div className="flex items-center justify-between"><span className="text-[#4AC9D3]">{"★".repeat(r.stars)}</span><span className="rounded border border-[#4AC9D3]/30 px-2 py-0.5 text-[10px] font-black text-[#4AC9D3]">VERIFIED</span></div><p className="mt-3 text-sm leading-6 text-white/70">“{r.text}”</p><div className="mt-4 border-t border-white/10 pt-4"><div className="font-bold">{r.name}</div><div className="text-xs text-white/45">{r.location}</div></div></div></article>)}</div><Link href="/reviews" className="mt-7 inline-flex text-sm font-black text-[#4AC9D3]">Read all reviews →</Link></section>
  {related.length>0&&<section className="border-t border-white/10 bg-[#0A0A0A]"><div className="mx-auto max-w-7xl px-5 py-20 md:px-8"><div className="flex items-end justify-between"><div><div className="text-xs font-black uppercase tracking-[.2em] text-[#4AC9D3]">Build your setup</div><h2 className="mt-3 text-3xl font-bold md:text-4xl">More from ShoreHitch</h2></div><Link href="/shop" className="text-sm font-bold text-[#4AC9D3]">Shop all →</Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map(i=><ProductCard key={i.id} product={i}/>)}</div></div></section>}
 </SiteShell>
}
