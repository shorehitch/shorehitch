"use client";
import Image from "next/image";
import { useState } from "react";
import type { FigmaMediaItem } from "../../lib/figma-media";

export default function ProductGallery({media,title}:{media:FigmaMediaItem[];title:string}){
 const[index,setIndex]=useState(0),active=media[index]||media[0];
 if(!active)return <div className="aspect-[4/3] max-h-[560px] rounded-xl border border-white/10 bg-[#111]"/>;
 return <div className="min-w-0 w-full lg:max-w-[650px]">
  <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] aspect-[4/3] max-h-[590px]">
   {active.type==="video"?<video key={active.src} src={active.src} autoPlay muted loop playsInline controls className="premium-media h-full w-full object-contain"/>:<Image src={active.src} alt={title} fill priority sizes="(max-width:1024px) 100vw,620px" className="premium-media object-contain p-2 sm:p-4"/>}
  </div>
  {media.length>1&&<div className="mt-3 flex gap-2 overflow-x-auto pb-1">{media.map((item,i)=><button key={`${item.src}-${i}`} type="button" onClick={()=>setIndex(i)} aria-label={`View ${title} media ${i+1}`} className={`relative h-16 w-16 flex-none overflow-hidden rounded-md border transition sm:h-[72px] sm:w-[72px] ${index===i?"border-[#4AC9D3] opacity-100":"border-white/10 opacity-60 hover:opacity-100"}`}>{item.type==="video"?<><video src={item.src} muted playsInline className="h-full w-full object-cover"/><span className="absolute inset-0 flex items-center justify-center bg-black/35 text-xs text-white">▶</span></>:<Image src={item.src} alt="" fill sizes="72px" className="object-cover"/>}</button>)}</div>}
 </div>
}
