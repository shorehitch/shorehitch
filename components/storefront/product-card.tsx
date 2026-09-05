import Image from "next/image";
import Link from "next/link";
import { figmaCardImage } from "../../lib/figma-media";
import type { StorefrontProduct } from "../../lib/shopify/products";

const META: Record<string,{tag:string;badge?:string}>={
  shorehitch:{tag:"Flagship Anchor",badge:"Best Seller"},
  "baby-hitch-18-12":{tag:"PWC Anchor",badge:"Jet Ski Ready"},
  "360-anchor-swivel":{tag:"Accessory",badge:"Essential Add-On"},
  "custom-dock-lines-pair":{tag:"Dock Lines",badge:"Custom Engraved"},
  "shorehook-tether-adjuster":{tag:"Accessory"},
  "dry-bag-storage":{tag:"Storage"},
  "shorehitch-bucket-pre-order-today":{tag:"Pre-Order",badge:"PRE-ORDER"},
  "custom-engraving":{tag:"Personalization",badge:"Made to Order"},
  "soft-top-handle-dek-x":{tag:"Accessory",badge:"Add-On"},
};
function money(a:string,c:string){return new Intl.NumberFormat("en-US",{style:"currency",currency:c}).format(Number(a))}
export default function ProductCard({product,priority=false}:{product:StorefrontProduct;priority?:boolean}){const meta=META[product.handle]||{tag:"ShoreHitch"},img=figmaCardImage(product.handle,product.featuredImage?.url),price=product.priceRange.minVariantPrice,compare=product.variants.nodes.find(v=>v.compareAtPrice)?.compareAtPrice;const savings=compare?Number(compare.amount)-Number(price.amount):0;const cta=meta.badge==="PRE-ORDER"?"Pre-Order Now →":["shorehitch","baby-hitch-18-12","custom-engraving"].includes(product.handle)?"Customize & Buy →":"View & Add to Cart →";return <div className="product-card group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]"><Link href={`/products/${product.handle}`} className="relative block aspect-square overflow-hidden bg-[#111]">{img?<Image src={img} alt={product.title} fill priority={priority} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" className="premium-media object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"/>:null}{meta.badge?<div className={`absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${meta.badge==="PRE-ORDER"?"bg-[#4AC9D3] text-black":"bg-[#0044FE] text-white"}`}>{meta.badge}</div>:null}{savings>0?<div className="absolute right-3 top-3 rounded bg-[#4AC9D3] px-2.5 py-1 text-[10px] font-black text-black">−{money(String(savings),price.currencyCode)} off</div>:null}<div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0"><span className="block w-full bg-[#4AC9D3] py-3 text-center text-sm font-black text-black">{cta}</span></div></Link><div className="flex flex-1 flex-col gap-2 p-4"><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#4AC9D3]/80">{meta.tag}</div><Link href={`/products/${product.handle}`} className="text-sm font-bold leading-snug text-white hover:text-[#4AC9D3]">{product.title}</Link><div className="mt-auto flex items-center gap-2 pt-2"><span className="font-black text-white">{money(price.amount,price.currencyCode)}</span>{compare&&Number(compare.amount)>Number(price.amount)?<span className="text-sm text-white/35 line-through">{money(compare.amount,compare.currencyCode)}</span>:null}</div></div></div>}
