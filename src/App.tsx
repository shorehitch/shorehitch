import { useState, useEffect, useRef } from "react";

// ─── Shopify Storefront API ────────────────────────────────────────────────────
const SHOPIFY_DOMAIN = "b5h2ta-gg.myshopify.com";
const SHOPIFY_TOKEN = "a9d45ddae6597544b32573bd7bd13a13";

// Maps app product ID → Shopify product GID (variant fetched at runtime)
const SHOPIFY_PRODUCT_GIDS: Record<number, string> = {
  1: "gid://shopify/Product/15117737951598",
  2: "gid://shopify/Product/15117738180974",
  3: "gid://shopify/Product/15117738344814",
  4: "gid://shopify/Product/15117738541422",
  5: "gid://shopify/Product/15117738738030",
  6: "gid://shopify/Product/15117738869102",
  7: "gid://shopify/Product/15117739229550",
  8: "gid://shopify/Product/15117739393390",
};

async function storefrontFetch(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

type Page = "home" | "catalog" | "product" | "cart" | "contact" | "dealer";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  badge?: string;
  media: MediaItem[];   // first item = card thumbnail
  tag: string;
  stars: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  shopifyVariantId?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "ShoreHitch OG",
    price: 329.99,
    originalPrice: 399.99,
    badge: "Best Seller",
    media: [
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Blue_Shorehitch.png?v=1787847178" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Black_Shorehitch.jpg?v=1787846954" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Red_Shorehitch.png?v=1787847502" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Green_shorehitch.png?v=1787847521" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Purple-Logo.jpg?v=1787847715" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/821DC6A6-DB87-4EAE-92D1-C51540E32FA4.jpg?v=1787844821" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/new_arrival_png.jpg?v=1787844781" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/shorehitch-2025-tom-leigh--37.jpg?v=1783627028" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Shore_Hitch_in_vibrant_teal_water.png?v=1785512458" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Dynamic_yellow_splash_with_Shore_Hitch_anchor.jpg?v=1785513923" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Shore_Hitch_with_chocolate_splashes.png?v=1785512477" },
    ],
    tag: "Flagship Anchor",
    stars: 5,
    reviews: 18,
    description: "America's first custom anchor system, engineered for boaters who refuse to compromise. Precision-machined from 316 mirror-polish stainless steel with an Intelligent Exit System™ that digs, holds, and releases on command.",
    features: [
      "Aerospace grade aluminum for lightweight use & 316 mirror-polish stainless steel construction for corrosion-proof trust",
      "Intelligent Exit System™ — Dig. Hold. Release. Repeat.",
      "Customizable. 1 unit is rated to up to 40 ft vessels",
      "Lifetime warranty — no questions asked",
      "🇺🇸 Designed in USA — family owned & operated",
    ],
    inStock: true,
  },
  {
    id: 2,
    name: "Baby ShoreHitch",
    price: 309.99,
    originalPrice: 349.99,
    badge: "Jet Ski Ready",
    media: [
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/White_-_Logo_Close_Up_2.png?v=1787845710" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Blue_Shorehitch.png?v=1787847178" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Black_Shorehitch.jpg?v=1787846954" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Red_Shorehitch.png?v=1787847502" },
      // { type: "video", src: "/src/imports/your-baby-hitch-video.mp4" },
    ],
    tag: "PWC Anchor",
    stars: 5,
    reviews: 7,
    description: "Same Intelligent Exit System™ in a compact form factor — strong holds, slim profile. The little sibling that punches way above its weight.",
    features: [
      "15\" spike — compact powerhouse (vs. OG's 24\") built for tight spaces",
      "Ideal for vessels under 21 ft: jet skis, PWCs, kayaks, canoes & tent stakes",
      "Aerospace grade aluminum for lightweight use & 316 mirror-polish stainless steel construction for corrosion-proof trust",
      "Intelligent Exit System™ — Dig. Hold. Release. Repeat.",
      "Lifetime warranty — no questions asked",
      "🇺🇸 Designed in USA — family owned & operated",
    ],
    inStock: true,
  },
  {
    id: 3,
    name: "360° Anchor Swivel",
    price: 49.99,
    originalPrice: 79.99,
    badge: "Essential Add-On",
    media: [
      { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/b9deff88544d4ca2a996fe289e8ef050.mov" },
      { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/681ed9a1e32344099428bfccded9b933.mp4" },
      // { type: "image", src: "/src/imports/your-swivel-image.jpg" },
    ],
    tag: "Accessory",
    stars: 5,
    reviews: 4,
    description: "Eliminate anchor line twist forever. Full 360° ball-bearing rotation keeps your boat riding true in shifting wind and current.",
    features: [
      "Full 360° ball-bearing rotation",
      "Marine-grade stainless steel",
      "Fits all ShoreHitch models",
      "1-year manufacturer warranty",
      "🇺🇸 Designed in USA",
    ],
    inStock: true,
  },
  {
    id: 4,
    name: "Custom Dock Lines — Pair",
    price: 149.99,
    originalPrice: 189.99,
    badge: "Custom Engraved",
    media: [
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/6969862802ec93f027e0a328.png?v=1783102737" },
      // { type: "video", src: "/src/imports/your-dock-lines-video.mp4" },
    ],
    tag: "Dock Lines",
    stars: 4.9,
    reviews: 3,
    description: "Double-braid nylon dock lines hand-spliced and custom laser-engraved with your boat name. Built to outlast the boat.",
    features: [
      "Double-braid nylon construction",
      "Custom laser engraving included",
      "Hand-spliced eyes",
      "UV and abrasion resistant",
      "1-year manufacturer warranty",
      "🇺🇸 Designed in USA",
    ],
    inStock: true,
  },
  {
    id: 5,
    name: "ShoreHook Tether Adjuster",
    price: 49.99,
    originalPrice: 59.99,
    media: [
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/6980745766e7cafbcee57142.png?v=1783102736" },
    ],
    tag: "Accessory",
    stars: 4.8,
    reviews: 2,
    description: "Infinitely adjustable tether system for precise boat positioning. Never re-tie a dock line again.",
    features: [
      "Tool-free infinite adjustment",
      "Stainless steel hardware",
      "2,000 lb working load",
      "1-year manufacturer warranty",
      "🇺🇸 Designed in USA",
    ],
    inStock: true,
  },
  {
    id: 6,
    name: "Hard Case",
    price: 79.99,
    originalPrice: 89.99,
    media: [
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/698074571fd82749a7a2a7ff.png?v=1783102733" },
    ],
    tag: "Storage",
    stars: 5,
    reviews: 1,
    description: "Military-spec hard case with custom foam insert. Waterproof IP67-rated protection for your ShoreHitch system.",
    features: [
      "Waterproof IP67 rating",
      "Custom foam insert",
      "Pressure relief valve",
      "Stainless steel latches",
      "🇺🇸 Designed in USA",
    ],
    inStock: true,
  },
  {
    id: 7,
    name: "ShoreHitch Bucket Anchor",
    price: 999.99,
    originalPrice: 999.99,
    badge: "PRE-ORDER",
    media: [
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260202_000624_ec4a2448-a882-4a52-9fe5-d866947da597_4.png?v=1787845811" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260201_225635_1dd60d40-2020-4e07-9f72-b20972ec2441_5.jpg?v=1787845762" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260202_005819_5012b37a-2249-4771-a264-7b3300abbd74_1_4.png?v=1787845816" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260201_204053_6e52e1f3-4b2e-4e62-9581-7000ea883dd4_3.png?v=1787845721" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260201_005724_bb7ef5b1-269d-45ed-96f6-01a96d32158f_4.png?v=1787845720" },
    ],
    tag: "Pre-Order",
    stars: 5,
    reviews: 0,
    description: "The Next Evolution in Boat Anchoring is Here. Pre-order the ShoreHitch Bucket Anchor today and be first to experience the most innovative anchoring system we have ever built. Pre-orders ship in order received — reserve yours today.",
    features: [
      "Revolutionary new anchoring technology — the most innovative system we've ever built",
      "Pre-order now — limited first run availability",
      "Pre-orders ship in order received. Reserve yours today.",
      "Available in 20lb & 40lb sizes",
      "Rated for freshwater & offshore use — any depth",
      "Full 316 stainless steel construction",
      "Mirror polish finish",
      "Lifetime warranty — no questions asked",
      "🇺🇸 Designed in USA — family owned & operated",
    ],
    inStock: true,
  },
  {
    id: 8,
    name: "Custom Engraving",
    price: 59.99,
    originalPrice: 59.99,
    badge: "Made to Order",
    media: [
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/IMG_1200_4.jpg?v=1787845291" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/IMG_1199_4.jpg?v=1787845292" },
      { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/shorehitch-2024-tom-leigh-8278.jpg?v=1783105014" },
    ],
    tag: "Personalization",
    stars: 5,
    reviews: 14,
    description: "Make it yours. Our engineers hand-engrave your ShoreHitch with precision laser etching — permanent, crisp, and corrosion-resistant. Choose text, a logo, or both. Each engraving is a one-of-a-kind addition to your gear.",
    features: [
      "Precision laser engraving",
      "Text or logo options",
      "Corrosion-resistant finish",
      "Completed by our in-house engineers",
      "Ships with your order",
      "🇺🇸 Designed in USA",
    ],
    inStock: true,
  },
];

const REVIEWS = [
  // ── Photo reviews first ──
  {
    name: "Donnie Jones",
    location: "Phoenix, AZ",
    stars: 5,
    date: "Aug 2025",
    text: "Seen a Facebook ad and reached out on a weekend and Fernando replied right away. I ordered 2 custom Shore Hitches — Candy Blue and Pearl White with my boat logo engraved. They came fast and Fernando's team went out of their way to make sure we had them for the weekend in Havasu. They work awesome on my 32' Sunsation on the sandbars!",
    product: "ShoreHitch OG",
    verified: true,
    photos: [
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1754354314__img_2059__original.jpeg",
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1754354317__img_2066__original.jpeg",
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1754354310__img_2063__original.jpeg",
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1754354320__img_2128__original.jpeg",
    ],
  },
  {
    name: "Ryan T.",
    location: "Lake Havasu City, AZ",
    stars: 5,
    date: "Aug 2025",
    text: "Fernando has treated us as family from day one. This being the newest version 3 — just when I didn't think it could get any better they delivered amazing upgrades. Thicker handle, raised guide block for easier penetration, and a polished finish to match your boat colors!! So easy even my wife can anchor the boat!",
    product: "ShoreHitch OG",
    verified: true,
    photos: [
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1755960942__img_6323__original.jpeg",
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1755960936__img_6322__original.jpeg",
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1755960931__img_6321__original.jpeg",
    ],
  },
  {
    name: "Jeff Harrison",
    location: "Farmington, NM",
    stars: 4,
    date: "Jul 2025",
    text: "Our ShoreHitches have come in handy on Lake Havasu, McPhee Reservoir and Lake Powell — securely holding our Barletta Cabrio Tritoon despite battling surf boat wakes, jet boats, wind and other vessels. We bought two for shore hitching our stern points. Once I communicated with Fernando and Kelsey, they handled everything above and beyond. If you're thinking about getting one, Nike said it best: \"Just Do It\"",
    product: "ShoreHitch OG",
    verified: true,
    photos: [
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1753744868__img_9100__original.jpeg",
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1753744870__img_9098__original.jpeg",
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1753744873__img_9106__original.jpeg",
    ],
  },
  {
    name: "Scott B.",
    location: "Idaho",
    stars: 5,
    date: "Jun 2025",
    text: "I run Jet boats in the state of Idaho — we have fast flowing water and this is by far the best sand stake I've ever used! The ease of use is unmatched, and it is a beautiful piece as well. The ShoreHitch guys even put my boat name on it for me!",
    product: "ShoreHitch OG",
    verified: true,
    photos: [
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1750340784__img_0642__original.jpeg",
    ],
  },
  {
    name: "Ty P.",
    location: "Portales, NM",
    stars: 5,
    date: "Jul 2025",
    text: "For good quality American made products I will always be patient for production lead times.",
    product: "ShoreHitch OG",
    verified: true,
    photos: [
      "https://s3.amazonaws.com/me.judge.review-images/shorehitch/1751957244__1751957242571-img_4398__original.jpeg",
    ],
  },
  // ── Text reviews ──
  {
    name: "Joseph A.",
    location: "Sacramento, CA",
    stars: 5,
    date: "Jul 2026",
    text: "WOW!!!! I purchased the first gen unit and loved the look and ease of use. Every time I pulled it out everyone would ask me about it. After a year and a half I had an issue come up and sent customer service an email while I was on the beach. The next morning I got a call from the owner personally. Most companies with a beautiful product don't worry about support — these guys are BOTH. Looks like I know what I'm getting my boating family for Christmas!!",
    product: "ShoreHitch OG",
    verified: true,
    photos: [],
  },
  {
    name: "Michael K.",
    location: "Florida",
    stars: 5,
    date: "May 2025",
    text: "We have a 29' center console and used this the first time Memorial Day weekend. Current was ripping so we used our traditional stern anchor first — it lifted out of the sand a few times. I switched to the ShoreHitch. It didn't pull out once. Held the boat perfectly. It also looks great color matched with the boat name on it. Highly recommend!",
    product: "ShoreHitch OG",
    verified: true,
    photos: [],
  },
  {
    name: "Jeff F.",
    location: "South Florida / Bahamas",
    stars: 5,
    date: "May 2025",
    text: "We met Fernando & Kelsee at a boat show in Miami. We have a 35ft center console and use it for our stern anchor. WOW! Not only is this the best I've personally used in wet sands and sandbars but having my logo on it was a real head turner. We are happy this is made in USA. We'll definitely be buying another for our smaller tender.",
    product: "ShoreHitch OG",
    verified: true,
    photos: [],
  },
  {
    name: "Mike P.",
    location: "Canyon Lake, CA",
    stars: 5,
    date: "Jan 2025",
    text: "The quality of material and the engraving are 🔥🔥🔥",
    product: "Custom Engraving",
    verified: true,
    photos: [],
  },
  {
    name: "Mike P.",
    location: "Chino, CA",
    stars: 5,
    date: "Feb 2025",
    text: "The product, engraving, and customer service are all 5 Stars. I'd recommend the ShoreHitch to any and everyone.",
    product: "Baby ShoreHitch",
    verified: true,
    photos: [],
  },
  {
    name: "Jeromie C.",
    location: "Paradise, TX",
    stars: 5,
    date: "May 2025",
    text: "Love the lightweight but very well built anchor. Plus it looks great.",
    product: "ShoreHitch OG",
    verified: true,
    photos: [],
  },
  {
    name: "Jeff S.",
    location: "Mullica Hill, NJ",
    stars: 5,
    date: "Mar 2026",
    text: "Love it! Great holding strength!",
    product: "Baby ShoreHitch",
    verified: true,
    photos: [],
  },
  {
    name: "Jarrod B.",
    location: "Greenville, SC",
    stars: 5,
    date: "Dec 2025",
    text: "Very well made, great finish.",
    product: "ShoreHitch OG",
    verified: true,
    photos: [],
  },
  {
    name: "Kaden S.",
    location: "Verified Buyer",
    stars: 5,
    date: "Jul 2026",
    text: "The family behind the company is incredibly customer-focused. Their attention to detail is impressive, as shown by the awesome custom logo they added to our ShoreHitch.",
    product: "ShoreHitch OG",
    verified: true,
    photos: [],
  },
  {
    name: "Josh S.",
    location: "Verified Buyer",
    stars: 5,
    date: "Jul 2026",
    text: "After purchasing a ShoreHitch, we all decided it's by far the best purchase we've made for our boat. Lightweight, easy to use and even easier to customize to match our boat.",
    product: "Baby ShoreHitch",
    verified: true,
    photos: [],
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconAnchor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="22" />
      <path d="M5 15H2a10 10 0 0 0 20 0h-3" />
      <line x1="12" y1="7" x2="5" y2="11" />
      <line x1="12" y1="7" x2="19" y2="11" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconStar({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg className={className ?? "w-4 h-4"} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconFlag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="15" x2="4" y2="22" />
      <path d="M4 4h12l-2 5.5 2 5.5H4" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconShipping({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v4h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconCart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function Stars({ count, size = "sm" }: { count: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <span className="flex gap-0.5 star-fill">
      {[1, 2, 3, 4, 5].map((i) => (
        <IconStar key={i} filled={i <= Math.round(count)} className={sz} />
      ))}
    </span>
  );
}

// ─── Media helpers (image + video) ───────────────────────────────────────────
function MediaThumb({ item, alt, className }: { item: MediaItem; alt: string; className?: string }) {
  if (item.type === "video") {
    return (
      <video
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
        className={className}
      />
    );
  }
  return <img src={item.src} alt={alt} className={className} />;
}

function MediaStripBtn({ item, active, onClick }: { item: MediaItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${active ? "border-[#4AC9D3]" : "border-transparent opacity-40 hover:opacity-70"}`}
    >
      {item.type === "video" ? (
        <>
          <video src={item.src} muted className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </>
      ) : (
        <img src={item.src} alt="" className="w-full h-full object-cover" />
      )}
    </button>
  );
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────
function AnnouncementBar() {
  const items = [
    "🇺🇸  Designed in USA — Family Owned & Operated",
    "🛡️  Lifetime Warranty on ShoreHitch Anchor Units",
    "⭐  4.97 / 5 Stars from Verified Boaters",
    "🚚  Free Shipping on Orders Over $599",
    "🔩  Intelligent Exit System™ — Patent Pending",
    "🎁  Sign up for exclusive deals & your first-order discount",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="bg-[#4AC9D3] text-[#000000] text-xs font-semibold tracking-widest uppercase overflow-hidden py-2">
      <div className="flex ticker-track whitespace-nowrap items-center">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6">
            <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-02.png?v=1783443368" alt="ShoreHitch" className="h-8 w-auto flex-shrink-0" />
            <span>{item}</span>
            <span className="text-black/20 ml-4">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Shop", page: "catalog" },
    { label: "Become a Dealer", page: "dealer" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/60" : "bg-black"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-03.png?v=1783102739"
            alt="ShoreHitch — Anchoring Redefined"
            className="h-48 w-auto"
          />
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => setPage(l.page)}
              className={`text-sm font-medium tracking-wide transition-colors ${page === l.page ? "text-[#4AC9D3]" : "text-white/60 hover:text-white"}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:flex items-center gap-1.5 text-white/50 text-xs font-bold tracking-widest uppercase border border-white/10 rounded px-2.5 py-1">
            🇺🇸 Designed in USA
          </span>
          <button className="p-2 text-white/50 hover:text-white transition-colors hidden md:flex">
            <IconSearch className="w-4 h-4" />
          </button>
          <button onClick={() => setPage("cart")} className="relative p-2 text-white/50 hover:text-[#4AC9D3] transition-colors">
            <IconCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0044FE] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setPage("catalog")}
            className="hidden md:flex items-center gap-1.5 bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black text-sm font-bold px-4 py-2 rounded transition-colors"
          >
            Shop Now
          </button>
          <button className="md:hidden p-2 text-white/70" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <button key={l.label} onClick={() => { setPage(l.page); setMobileOpen(false); }} className="text-left text-white font-medium py-1">
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { setPage("catalog"); setMobileOpen(false); }}
            className="mt-2 bg-[#4AC9D3] text-black font-bold py-2.5 rounded text-sm"
          >
            Shop Now — Free Shipping $599+
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setPage, viewProduct, addToCart }: { setPage: (p: Page) => void; viewProduct: (id: number) => void; addToCart: (p: Product) => void }) {
  return (
    <div>
      {/* Fixed video background — pins behind all sections */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/b_roll_clip_5.m4v?v=1787844877"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Anchoring Redefined — floats over fixed video background */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#4AC9D3]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#4AC9D3]" />
                <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.25em] uppercase">America's #1 Custom Anchor System</span>
              </div>
              <h1 className="font-extrabold text-white leading-[0.92] tracking-tight mb-5" style={{ fontSize: "clamp(54px, 7.5vw, 104px)" }}>
                Anchoring<br />
                <span className="cyan-shimmer">Redefined.</span>
              </h1>
              <p className="text-white/75 text-lg leading-relaxed mb-5 max-w-lg">
                Patent-pending Intelligent Exit System™ engineered by boaters who refused to accept "good enough." Because anchoring your boat should never be as embarrassing as you launching it.
              </p>
              <div className="flex flex-wrap gap-2 mb-9">
                {["Designed in USA 🇺🇸", "Lifetime Warranty on Anchors", "4.97★ Rated", "Patent Pending"].map((t) => (
                  <span key={t} className="text-xs font-medium text-white/70 border border-white/20 bg-white/5 px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setPage("catalog")} className="cta-pulse bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold text-base px-8 py-4 rounded flex items-center gap-2 transition-colors">
                  Shop ShoreHitch <IconArrow className="w-4 h-4" />
                </button>
                <button onClick={() => viewProduct(1)} className="border border-white/30 hover:border-[#4AC9D3] text-white font-medium text-base px-8 py-4 rounded transition-colors">
                  View Flagship
                </button>
              </div>
          </div>
        </div>
      </section>

      {/* All sections below scroll over the fixed video with solid backgrounds */}

      {/* Trust Strip */}
      <section className="relative z-10 bg-[#0A0A0A] border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <IconFlag className="w-4 h-4" />, label: "🇺🇸 Designed in USA", sub: "Family owned & operated" },
              { icon: <IconShield className="w-4 h-4" />, label: "Lifetime Warranty", sub: "On ShoreHitch anchor units" },
              { icon: <IconStar filled className="w-4 h-4" />, label: "4.97 / 5 Stars", sub: "29 verified reviews" },
              { icon: <IconShipping className="w-4 h-4" />, label: "Free Shipping", sub: "On orders $599+" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="text-[#4AC9D3] flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="text-white font-semibold text-sm">{item.label}</div>
                  <div className="text-white/40 text-xs">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative z-10 bg-black max-w-full px-0 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#4AC9D3]" />
              <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Our Products</span>
            </div>
            <h2 className="font-bold text-white text-4xl md:text-5xl leading-tight tracking-tight">
              Built to Last.<br />Backed for Life.
            </h2>
          </div>
          <button
            onClick={() => setPage("catalog")}
            className="hidden md:flex items-center gap-2 text-[#4AC9D3] text-sm font-medium hover:gap-3 transition-all"
          >
            View all <IconArrow className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={viewProduct}
              onAdd={() => addToCart(product)}
            />
          ))}
        </div>

        <div className="mt-8 flex md:hidden justify-center">
          <button onClick={() => setPage("catalog")} className="border border-[#4AC9D3]/40 text-[#4AC9D3] font-medium px-6 py-2.5 rounded text-sm">
            View all products
          </button>
        </div>
      </div>
      </section>

      {/* ── Leave Spikes & Augers Behind ── */}
      <section className="relative z-10 bg-[#0A0A0A] border-y border-white/8 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left — old way */}
          <div className="relative">
            <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/shorehitch-2025-tom-leigh--37.jpg?v=1783627028" alt="Old anchor methods" className="w-full h-72 md:h-96 object-cover grayscale opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="font-bold text-white text-2xl md:text-3xl tracking-tight mb-5">Leave Spikes &amp; Augers Behind.</h3>
              <div className="flex flex-col gap-3">
                {[
                  { bold: "Slow to set.", rest: "Requires minutes of twisting and turning." },
                  { bold: "Fails in hard/soft sand.", rest: "Unreliable in varied bottom conditions." },
                  { bold: "Rusts and corrodes.", rest: "Cheap materials degrade quickly in saltwater." },
                  { bold: "Messy storage.", rest: "Awkward shapes that bring sand and mud aboard." },
                ].map((item) => (
                  <div key={item.bold} className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold text-sm mt-0.5 flex-shrink-0">✕</span>
                    <p className="text-white/70 text-sm leading-snug"><strong className="text-white">{item.bold}</strong> {item.rest}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — ShoreHitch */}
          <div className="relative bg-black">
            <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Blue_Shorehitch.png?v=1787847178" alt="ShoreHitch" className="w-full h-72 md:h-96 object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/85" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="font-bold text-white text-2xl md:text-3xl tracking-tight mb-5">Embrace the Future.</h3>
              <div className="flex flex-col gap-3">
                {[
                  { bold: "Sets in seconds.", rest: "Patented slide-hammer does the work for you." },
                  { bold: "Works in all sand types.", rest: "Grips hard pack, soft mud, and everything in between." },
                  { bold: "Corrosion resistant.", rest: "316 stainless and marine-grade materials for lifetime use." },
                  { bold: "Clean storage with mount.", rest: "Dedicated system keeps your boat clean and tidy." },
                ].map((item) => (
                  <div key={item.bold} className="flex items-start gap-2.5">
                    <span className="text-[#4AC9D3] font-bold text-sm mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-white/70 text-sm leading-snug"><strong className="text-white">{item.bold}</strong> {item.rest}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shop Now bar */}
        <div className="bg-black border-t border-white/8 py-6 flex justify-center">
          <button
            onClick={() => setPage("catalog")}
            className="bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold px-12 py-4 rounded tracking-wide transition-colors cta-pulse"
          >
            SHOP NOW
          </button>
        </div>
      </section>

      {/* ── Comparison Chart: ShoreHitch vs Spikes vs Augers ── */}
      <section className="relative z-10 bg-black py-20 border-b border-white/8">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-bold text-white text-3xl md:text-4xl tracking-tight text-center mb-12">
            Why Upgrade From Traditional Spikes &amp; Fluke Anchors?
          </h2>

          {/* Column headers */}
          <div className="grid grid-cols-4 gap-4 mb-6 items-stretch">
            <div className="col-span-1" />

            {/* ShoreHitch */}
            <div className="flex flex-col items-center bg-[#4AC9D3]/10 border-2 border-[#4AC9D3]/40 rounded-xl overflow-hidden">
              <div className="w-full bg-black flex items-center justify-center p-5 flex-1">
                <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-03.png?v=1783102739" alt="ShoreHitch" className="w-full h-auto object-contain" />
              </div>
              <span className="text-[#4AC9D3] text-xs font-bold tracking-widest uppercase py-3">ShoreHitch</span>
            </div>

            {/* Traditional Spikes */}
            <div className="flex flex-col items-center bg-white/3 border border-white/10 rounded-xl overflow-hidden">
              <div className="w-full flex flex-col items-center justify-center p-5 gap-2 flex-1">
                <span className="text-4xl">🔩</span>
                <span className="text-white/30 text-[10px] text-center leading-snug">Many competitors, no warranties</span>
              </div>
              <span className="text-white/50 text-xs font-bold tracking-widest uppercase py-3">Traditional Spikes</span>
            </div>

            {/* Augers or Fluke Anchors */}
            <div className="flex flex-col items-center bg-white/3 border border-white/10 rounded-xl overflow-hidden">
              <div className="w-full flex flex-col items-center justify-center p-5 gap-2 flex-1">
                <span className="text-4xl">⚓</span>
                <span className="text-white/30 text-[10px] text-center leading-snug">Bulky &amp; heavy. Drags and slides over time. Multiple adjustments during anchoring.</span>
              </div>
              <span className="text-white/50 text-xs font-bold tracking-widest uppercase py-3">Augers / Fluke Anchors</span>
            </div>
          </div>

          {/* Rows */}
          {[
            {
              label: "Setup",
              sh: "In seconds — slide hammer",
              spike: "Hammer or push required",
              auger: "Slow & tiring twisting into sand",
              shGood: true,
            },
            {
              label: "Holding Power",
              sh: "Holds up to 40ft vessels with one unit — lifetime warranty backed",
              spike: "Too heavy for finer sands — sinks, falls, and drags over time",
              auger: "Struggles in packed or coarse sand",
              shGood: true,
            },
            {
              label: "Durability",
              sh: "Aerospace grade aluminum & 316 stainless steel — lifetime warranty",
              spike: "Steel bends or rusts easily in saltwater",
              auger: "Threads and handles seize or strip",
              shGood: true,
            },
            {
              label: "Storage",
              sh: "Dedicated mount & dry bag",
              spike: "Bulky, often tossed in lockers",
              auger: "Muddy & awkward to store",
              shGood: true,
            },
            {
              label: "Aesthetic",
              sh: "Premium customizable design",
              spike: "Plain utility look",
              auger: "Basic hardware store appearance",
              shGood: true,
            },
          ].map((row, i) => (
            <div key={row.label} className={`grid grid-cols-4 gap-4 py-4 border-b border-white/8 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
              <div className="flex items-center">
                <span className="text-[#4AC9D3] text-xs font-bold tracking-widest uppercase">{row.label}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#4AC9D3]/5 rounded-lg px-3 py-2">
                <span className="text-[#4AC9D3] text-sm font-bold flex-shrink-0">✓</span>
                <span className="text-white font-semibold text-sm">{row.sh}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-red-400 text-sm flex-shrink-0">✕</span>
                <span className="text-white/45 text-sm">{row.spike}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-red-400 text-sm flex-shrink-0">✕</span>
                <span className="text-white/45 text-sm">{row.auger}</span>
              </div>
            </div>
          ))}

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setPage("catalog")}
              className="bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold px-12 py-4 rounded tracking-wide transition-colors cta-pulse"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </section>

      {/* Why ShoreHitch */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#4AC9D3]/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#4AC9D3]" />
              <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Why ShoreHitch</span>
            </div>
            <h2 className="font-bold text-white text-4xl md:text-5xl leading-tight tracking-tight mb-6">
              We Build What the<br />
              <span className="steel-text">Industry Won't.</span>
            </h2>
            <p className="text-white/55 leading-relaxed mb-8">
              Every ShoreHitch product starts from a real problem we lived as boaters. From the garage to our shorelines, Dragging anchors. Awkward lifts. Generic hardware that quits. We engineered something better — patent-pending, Designed in the USA, and backed with a lifetime warranty.
            </p>
            <div className="flex flex-col gap-3.5">
              {[
                "Intelligent Slide Hammer tech using aerospace grade materials.",
                "Freshwater and saltwater approved — built to last in any environment.",
                "ECO friendly and safe for ocean reefs and sea grass.",
                "Lifetime warranty. Not 1 year. Not 5. Lifetime.",
                "Only customizable anchor system in the market.",
                "Designed, machined & assembled in the USA 🇺🇸",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#4AC9D3]/15 border border-[#4AC9D3]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconCheck className="w-3 h-3 text-[#4AC9D3]" />
                  </div>
                  <span className="text-white font-semibold text-lg leading-snug">{point}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setPage("catalog")}
              className="mt-10 bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold px-8 py-4 rounded flex items-center gap-2 transition-colors cta-pulse"
            >
              Shop the Collection <IconArrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="relative z-10 bg-[#0A0A0A] border-y border-white/8 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#4AC9D3]" />
              <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Verified Reviews</span>
              <div className="w-6 h-px bg-[#4AC9D3]" />
            </div>
            <h2 className="font-bold text-white text-4xl md:text-5xl tracking-tight mb-4">
              Don't Take Our Word for It.
            </h2>
            <div className="flex items-center justify-center gap-2">
              <Stars count={5} size="md" />
              <span className="text-white/80 font-semibold">4.97</span>
              <span className="text-white/35 text-sm">· 29 verified reviews</span>
            </div>
          </div>

          {/* Photo reviews — featured row */}
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            {REVIEWS.filter(r => r.photos && r.photos.length > 0).slice(0, 3).map((review, i) => (
              <div key={i + review.name} className="bg-[#0A0A0A] border border-white/8 rounded-xl overflow-hidden flex flex-col hover:border-[#4AC9D3]/30 transition-colors">
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-1 h-44">
                    {review.photos.slice(0, 2).map((url, i) => (
                      <img key={i} src={url} alt="" className={`object-cover ${review.photos!.length > 1 ? "w-1/2" : "w-full"} h-full`} />
                    ))}
                  </div>
                )}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between">
                    <Stars count={review.stars} />
                    <span className="text-[10px] font-bold text-[#4AC9D3] border border-[#4AC9D3]/30 px-2 py-0.5 rounded">VERIFIED</span>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed flex-1">"{review.text}"</p>
                  <div className="rule-cyan" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4AC9D3]/20 border border-[#4AC9D3]/30 flex items-center justify-center text-[#4AC9D3] font-bold text-xs flex-shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{review.name}</div>
                      <div className="text-white/35 text-xs">{review.location} · {review.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Text reviews — secondary grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.filter(r => !r.photos || r.photos.length === 0).slice(0, 6).map((review, i) => (
              <div key={i + review.name} className="bg-[#0A0A0A] border border-white/8 rounded-xl p-5 flex flex-col gap-3 hover:border-[#4AC9D3]/20 transition-colors">
                <div className="flex items-start justify-between">
                  <Stars count={review.stars} />
                  <span className="text-[10px] font-bold text-[#4AC9D3] border border-[#4AC9D3]/30 px-2 py-0.5 rounded">VERIFIED</span>
                </div>
                <p className="text-white/65 text-sm leading-relaxed flex-1">"{review.text}"</p>
                <div className="rule-cyan" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0044FE]/20 border border-[#0044FE]/30 flex items-center justify-center text-[#4AC9D3] font-bold text-xs flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{review.name}</div>
                    <div className="text-white/35 text-xs">{review.location} · {review.date}</div>
                    <div className="text-[#4AC9D3]/60 text-xs mt-0.5">{review.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="relative z-10 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0044FE]/20 via-black to-[#4AC9D3]/10" />
        <div className="absolute inset-0 border-y border-[#4AC9D3]/15" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-02.png?v=1783443368" alt="" className="w-24 h-24 mx-auto mb-4 opacity-80" />
          <h2 className="font-bold text-white text-3xl md:text-4xl mb-3 tracking-tight">
            Join the ShoreHitch Fleet
          </h2>
          <p className="text-white/50 mb-8">
            Get 10% off your first order, plus early access to new products and exclusive drops.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/5 text-white placeholder-white/25 border border-white/15 focus:border-[#4AC9D3] rounded px-4 py-3 text-sm outline-none transition-colors"
            />
            <button className="bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold px-6 py-3 rounded text-sm whitespace-nowrap transition-colors">
              Get 10% Off
            </button>
          </div>
          <p className="text-white/30 text-xs mt-3">10% off your first order · $59.99 minimum</p>
        </div>
      </section>

      <div className="relative z-10">
        <Footer setPage={setPage} />
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onView, onAdd }: { product: Product; onView: (id: number) => void; onAdd: () => void }) {
  const savings = product.originalPrice - product.price;
  return (
    <div className="product-card bg-[#0A0A0A] border border-white/8 rounded-xl overflow-hidden flex flex-col group">
      <div className="relative aspect-square bg-[#111] overflow-hidden cursor-pointer" onClick={() => onView(product.id)}>
        <MediaThumb item={product.media[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100" />
        {product.badge && (
          <div className={`absolute top-3 left-3 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded ${
            product.badge === "PRE-ORDER"
              ? "bg-[#4AC9D3] text-black animate-pulse"
              : "bg-[#0044FE] text-white"
          }`}>
            {product.badge}
          </div>
        )}
        {product.badge !== "PRE-ORDER" && (
          <div className="absolute top-3 right-3 bg-[#4AC9D3] text-black text-[10px] font-bold px-2.5 py-1 rounded">
            −${savings.toFixed(0)} off
          </div>
        )}
        {/* CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => onView(product.id)}
            className="w-full bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold text-sm py-3 transition-colors"
          >
            {product.badge === "PRE-ORDER"
              ? "Pre-Order Now →"
              : [1, 2, 8].includes(product.id)
              ? "Customize & Buy →"
              : "View & Add to Cart →"}
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-[#4AC9D3]/70 text-[10px] font-bold tracking-widest uppercase">{product.tag}</div>
        <button onClick={() => onView(product.id)} className="text-white font-semibold text-sm leading-snug text-left hover:text-[#4AC9D3] transition-colors">
          {product.name}
        </button>
        <div className="flex items-center gap-1.5">
          <Stars count={product.stars} />
          <span className="text-white/35 text-xs">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-white font-bold">${product.price.toFixed(2)}</span>
          <span className="text-white/30 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Catalog Page ─────────────────────────────────────────────────────────────
function CatalogPage({ setPage, viewProduct, addToCart }: { setPage: (p: Page) => void; viewProduct: (id: number) => void; addToCart: (p: Product) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-px bg-[#4AC9D3]" />
          <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Full Catalog</span>
        </div>
        <h1 className="font-bold text-white text-4xl md:text-5xl mb-2 tracking-tight">The Collection</h1>
        <p className="text-white/45 max-w-xl">Every product built from real on-water experience. ShoreHitch anchor units backed by a lifetime warranty.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/8 rounded-lg px-5 py-3 flex flex-wrap gap-4 mb-10 text-xs text-white/50">
        <span className="flex items-center gap-1.5"><IconFlag className="w-3.5 h-3.5 text-[#4AC9D3]" /> 🇺🇸 Designed in USA</span>
        <span className="flex items-center gap-1.5"><IconShield className="w-3.5 h-3.5 text-[#4AC9D3]" /> Lifetime Warranty on Anchors</span>
        <span className="flex items-center gap-1.5"><IconShipping className="w-3.5 h-3.5 text-[#4AC9D3]" /> Free shipping over $599</span>
        <span className="flex items-center gap-1.5 ml-auto text-[#4AC9D3] font-semibold cursor-pointer">
          Sign up to unlock your first-order discount
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={viewProduct}
            onAdd={() => addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────
const ALL_COLORS = [
  { name: "Nautical Blue", hex: "#0044FE" },
  { name: "Totally Teal",  hex: "#4AC9D3" },
  { name: "Black",         hex: "#1a1a1a" },
  { name: "Red",           hex: "#DC2626" },
  { name: "Orange",        hex: "#EA580C" },
  { name: "Yellow",        hex: "#EAB308" },
  { name: "Purple",        hex: "#7C3AED" },
  { name: "Arctic White",  hex: "#F0F4F8" },
];

const BABY_COLORS = ALL_COLORS.filter((c) =>
  ["Nautical Blue", "Black", "Arctic White", "Red"].includes(c.name)
);

const PRODUCT_COLORS: Record<number, typeof ALL_COLORS> = {
  1: ALL_COLORS,   // ShoreHitch OG — all 8
  2: BABY_COLORS,  // Baby ShoreHitch — 4 only
};

function ProductPage({ productId, addToCart }: { productId: number; addToCart: (p: Product) => void }) {
  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
  const isPreOrder = product.id === 7;
  const isEngraving = product.id === 8;
  const isAccessory = [3, 4, 5, 6].includes(product.id);

  // Engraving-specific state
  const [engravingProductType, setEngravingProductType] = useState<"text" | "logo" | "both">("text");
  const [engravingProductText, setEngravingProductText] = useState("");
  const [engravingProductFile, setEngravingProductFile] = useState<File | null>(null);
  const [engravingProductNotes, setEngravingProductNotes] = useState("");
  const colors = PRODUCT_COLORS[product.id] ?? ALL_COLORS;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [preOrderSize, setPreOrderSize] = useState<"20lb" | "40lb">("20lb");
  const [preOrderPayment, setPreOrderPayment] = useState<"full" | "deposit">("full");
  const [activeTab, setActiveTab] = useState<"features" | "description" | "warranty">("features");

  // Color
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Add-ons
  const [engravingEnabled, setEngravingEnabled] = useState(false);
  const [engravingType, setEngravingType] = useState<"text" | "logo">("text");
  const [engravingText, setEngravingText] = useState("");
  const [engravingNotes, setEngravingNotes] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [softTopEnabled, setSoftTopEnabled] = useState(false);
  const [hardCaseEnabled, setHardCaseEnabled] = useState(false);

  // Reset all selections when switching products
  useEffect(() => {
    setSelectedColor(null);
    setEngravingEnabled(false);
    setEngravingText("");
    setEngravingNotes("");
    setLogoFile(null);
    setSoftTopEnabled(false);
    setHardCaseEnabled(false);
    setActiveIdx(0);
    setQty(1);
    setPreOrderSize("20lb");
    setPreOrderPayment("full");
    setEngravingProductType("text");
    setEngravingProductText("");
    setEngravingProductFile(null);
    setEngravingProductNotes("");
  }, [productId]);

  const addOnTotal =
    (engravingEnabled ? 59.99 : 0) +
    (softTopEnabled ? 20.99 : 0) +
    (hardCaseEnabled ? 59.99 : 0);

  const lineTotal = (product.price + addOnTotal) * qty;

  const media = product.media;

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">

        {/* Gallery */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            {media.map((item, i) => (
              <MediaStripBtn key={i} item={item} active={activeIdx === i} onClick={() => setActiveIdx(i)} />
            ))}
          </div>
          <div className="flex-1 aspect-square rounded-xl overflow-hidden bg-[#111]">
            <MediaThumb item={media[activeIdx]} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {isPreOrder ? (
              <>
                <span className="bg-[#4AC9D3] text-black text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded animate-pulse">Pre-Order Now</span>
                <span className="bg-white/5 text-white/70 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border border-white/10">🇺🇸 Designed in USA</span>
                <span className="bg-white/5 text-white/70 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border border-white/10">Lifetime Warranty Included</span>
              </>
            ) : isEngraving ? (
              <>
                <span className="bg-[#0044FE] text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded">Made to Order</span>
                <span className="bg-[#4AC9D3]/15 text-[#4AC9D3] text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border border-[#4AC9D3]/30">Laser Engraved</span>
                <span className="bg-white/5 text-white/70 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border border-white/10">🇺🇸 Designed in USA</span>
              </>
            ) : (
              <>
                <span className="bg-[#0044FE] text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded">Best Seller</span>
                <span className="bg-[#4AC9D3]/15 text-[#4AC9D3] text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border border-[#4AC9D3]/30">Patent Pending</span>
                <span className="bg-white/5 text-white/70 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded border border-white/10">🇺🇸 Designed in USA</span>
              </>
            )}
          </div>

          <div>
            <h1 className="font-bold text-white text-3xl md:text-4xl leading-tight tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <Stars count={product.stars} size="md" />
              {product.reviews > 0
                ? <span className="text-white/50 text-sm">{product.reviews} verified reviews</span>
                : <span className="text-[#4AC9D3]/70 text-sm font-medium">Be the first to own one</span>
              }
            </div>
          </div>

          {/* Pre-order urgency callout */}
          {isPreOrder && (
            <div className="bg-gradient-to-r from-[#4AC9D3]/10 to-[#0044FE]/10 border border-[#4AC9D3]/25 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#4AC9D3] animate-pulse flex-shrink-0" />
                <span className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase">Limited First Run Availability</span>
              </div>
              <p className="text-white font-bold text-sm mb-1">The Next Evolution in Boat Anchoring is Here.</p>
              <p className="text-white/55 text-xs leading-relaxed">Be first to experience the most innovative anchoring system we've ever built. Pre-orders ship in order received — <span className="text-white font-semibold">reserve yours today.</span></p>
            </div>
          )}

          {/* Price */}
          {isPreOrder ? (
            <div className="pb-5 border-b border-white/10">
              <div className="flex items-end gap-3 mb-4">
                <span className="font-extrabold text-white text-4xl tracking-tight">$999.99</span>
                <span className="text-[#4AC9D3] text-sm font-semibold mb-1">Full Price</span>
              </div>
              {/* Size selector */}
              <div className="mb-4">
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest block mb-2">Select Size</span>
                <div className="flex gap-3">
                  {(["20lb", "40lb"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPreOrderSize(s)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wide border-2 transition-all ${
                        preOrderSize === s
                          ? "border-[#4AC9D3] bg-[#4AC9D3]/10 text-[#4AC9D3]"
                          : "border-white/15 text-white/50 hover:border-white/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Payment options */}
              <div>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest block mb-2">Payment Option</span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setPreOrderPayment("full")}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                      preOrderPayment === "full"
                        ? "border-[#4AC9D3] bg-[#4AC9D3]/10"
                        : "border-white/10 bg-[#0A0A0A] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${preOrderPayment === "full" ? "border-[#4AC9D3]" : "border-white/30"}`}>
                        {preOrderPayment === "full" && <div className="w-2 h-2 rounded-full bg-[#4AC9D3]" />}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm">Pay in Full</div>
                        <div className="text-white/40 text-xs">Secure your unit — priority fulfillment</div>
                      </div>
                    </div>
                    <span className="text-white font-bold">$999.99</span>
                  </button>
                  <button
                    onClick={() => setPreOrderPayment("deposit")}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                      preOrderPayment === "deposit"
                        ? "border-[#4AC9D3] bg-[#4AC9D3]/10"
                        : "border-white/10 bg-[#0A0A0A] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${preOrderPayment === "deposit" ? "border-[#4AC9D3]" : "border-white/30"}`}>
                        {preOrderPayment === "deposit" && <div className="w-2 h-2 rounded-full bg-[#4AC9D3]" />}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm">50% Deposit</div>
                        <div className="text-white/40 text-xs">Reserve now, pay balance at ship</div>
                      </div>
                    </div>
                    <span className="text-[#4AC9D3] font-bold">$499.99</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-3 pb-5 border-b border-white/10">
              <span className="font-extrabold text-white text-4xl tracking-tight">${product.price.toFixed(2)}</span>
              <span className="text-white/30 text-xl line-through mb-1">${product.originalPrice.toFixed(2)}</span>
              <span className="text-[#4AC9D3] text-sm font-semibold mb-1">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
            </div>
          )}

          {/* ── Engraving Order Form ── */}
          {isEngraving && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-[#4AC9D3]" />
                <span className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase">Engraving Details</span>
              </div>

              {/* Type selector */}
              <div>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest block mb-2">Engraving Type</span>
                <div className="flex gap-2">
                  {(["text", "logo", "both"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setEngravingProductType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                        engravingProductType === t
                          ? "border-[#4AC9D3] bg-[#4AC9D3]/10 text-[#4AC9D3]"
                          : "border-white/10 text-white/50 hover:border-white/25 bg-[#0A0A0A]"
                      }`}
                    >
                      {t === "both" ? "Text + Logo" : t === "logo" ? "Logo Upload" : "Text Only"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text input */}
              {(engravingProductType === "text" || engravingProductType === "both") && (
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-widest block mb-2">Engraving Text</label>
                  <input
                    type="text"
                    value={engravingProductText}
                    onChange={(e) => setEngravingProductText(e.target.value)}
                    placeholder="e.g. boat name, coordinates, initials…"
                    maxLength={60}
                    className="w-full bg-black border border-white/15 focus:border-[#4AC9D3] text-white placeholder-white/25 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                  />
                  <p className="text-white/25 text-[10px] mt-1.5">{engravingProductText.length}/60 characters</p>
                </div>
              )}

              {/* Logo upload */}
              {(engravingProductType === "logo" || engravingProductType === "both") && (
                <div>
                  <label className="text-white/60 text-xs font-semibold uppercase tracking-widest block mb-2">Logo File</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#4AC9D3]/50 rounded-xl p-6 cursor-pointer transition-colors group">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.ai,.pdf,.eps"
                      className="hidden"
                      onChange={(e) => setEngravingProductFile(e.target.files?.[0] ?? null)}
                    />
                    {engravingProductFile ? (
                      <span className="text-[#4AC9D3] text-sm font-semibold">{engravingProductFile.name}</span>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-white/25 group-hover:text-[#4AC9D3] mb-2 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="text-white/40 text-sm font-medium">Upload your logo file</span>
                        <span className="text-white/25 text-xs mt-1">PNG, SVG, AI, PDF, EPS accepted</span>
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-white/60 text-xs font-semibold uppercase tracking-widest block mb-2">Special Instructions</label>
                <textarea
                  value={engravingProductNotes}
                  onChange={(e) => setEngravingProductNotes(e.target.value)}
                  placeholder="e.g. All caps, preferred font style, placement, size notes, serial number location…"
                  rows={4}
                  className="w-full bg-black border border-white/15 focus:border-[#4AC9D3] text-white placeholder-white/25 text-sm px-4 py-3 rounded-xl outline-none transition-colors resize-none"
                />
              </div>

              {/* Price callout */}
              <div className="bg-[#4AC9D3]/5 border border-[#4AC9D3]/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-white/60 text-sm">Per engraving</span>
                <span className="text-[#4AC9D3] font-bold text-lg">$59.99</span>
              </div>

              {/* CTA */}
              <button
                onClick={handleAdd}
                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base transition-all ${
                  added ? "bg-green-500 text-white" : "bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black cta-pulse"
                }`}
              >
                {added ? <><IconCheck className="w-5 h-5" /> Added to Order!</> : <><IconCart className="w-5 h-5" /> Add Engraving — $59.99</>}
              </button>
            </div>
          )}

          {/* ── Color Selection — only for OG & Baby ── */}
          {!isPreOrder && !isEngraving && !isAccessory && <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-sm">Color</span>
              {selectedColor && <span className="text-[#4AC9D3] text-xs">{selectedColor}</span>}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === c.name
                      ? "border-[#4AC9D3] scale-110 shadow-lg shadow-[#4AC9D3]/30"
                      : "border-white/20 hover:border-white/50"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            {!selectedColor && (
              <p className="text-white/30 text-xs mt-2">Please select a color to continue</p>
            )}
          </div>}

          {/* ── Add-Ons — only for OG & Baby ── */}
          {!isPreOrder && !isEngraving && !isAccessory && <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-px bg-[#4AC9D3]" />
              <span className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase">Customize Your Order</span>
            </div>

            {/* Custom Engraving */}
            <div className={`border rounded-xl overflow-hidden transition-colors ${engravingEnabled ? "border-[#4AC9D3]/40 bg-[#4AC9D3]/5" : "border-white/10 bg-[#0A0A0A]"}`}>
              <button
                onClick={() => setEngravingEnabled(!engravingEnabled)}
                className="w-full flex items-center justify-between px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${engravingEnabled ? "bg-[#4AC9D3] border-[#4AC9D3]" : "border-white/30"}`}>
                    {engravingEnabled && <IconCheck className="w-3 h-3 text-black" />}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">Custom Engraving</div>
                    <div className="text-white/40 text-xs">Text or logo engraved by our engineers</div>
                  </div>
                </div>
                <span className="text-[#4AC9D3] font-bold text-sm">+$59.99</span>
              </button>

              {engravingEnabled && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                  {/* Type toggle */}
                  <div className="flex gap-2">
                    {(["text", "logo"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setEngravingType(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                          engravingType === t
                            ? "bg-[#4AC9D3] text-black"
                            : "bg-white/5 text-white/50 hover:text-white border border-white/10"
                        }`}
                      >
                        {t === "text" ? "Text Only" : "Logo File Upload"}
                      </button>
                    ))}
                  </div>

                  {engravingType === "text" ? (
                    <input
                      type="text"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      placeholder="Enter engraving text (e.g. boat name, coordinates)"
                      maxLength={40}
                      className="w-full bg-black border border-white/15 focus:border-[#4AC9D3] text-white placeholder-white/25 text-sm px-3 py-2.5 rounded-lg outline-none transition-colors"
                    />
                  ) : (
                    <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-[#4AC9D3]/50 rounded-lg p-4 cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.ai,.pdf"
                        className="hidden"
                        onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                      />
                      {logoFile ? (
                        <span className="text-[#4AC9D3] text-sm font-medium">{logoFile.name}</span>
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-white/30 group-hover:text-[#4AC9D3] mb-1 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <span className="text-white/40 text-xs">Upload logo file</span>
                          <span className="text-white/25 text-[10px] mt-0.5">PNG, SVG, AI, PDF accepted</span>
                        </>
                      )}
                    </label>
                  )}

                  {/* Engraving notes */}
                  <div>
                    <label className="text-white/50 text-xs font-medium mb-1.5 block">
                      Notes for our engraving engineers <span className="text-white/25">(optional)</span>
                    </label>
                    <textarea
                      value={engravingNotes}
                      onChange={(e) => setEngravingNotes(e.target.value)}
                      placeholder="Preferred font style, placement, size direction, or any special requests..."
                      rows={3}
                      className="w-full bg-black border border-white/15 focus:border-[#4AC9D3] text-white placeholder-white/20 text-xs px-3 py-2.5 rounded-lg outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Soft Top */}
            <button
              onClick={() => setSoftTopEnabled(!softTopEnabled)}
              className={`flex items-center justify-between px-4 py-3.5 border rounded-xl transition-colors ${softTopEnabled ? "border-[#4AC9D3]/40 bg-[#4AC9D3]/5" : "border-white/10 bg-[#0A0A0A] hover:border-white/20"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${softTopEnabled ? "bg-[#4AC9D3] border-[#4AC9D3]" : "border-white/30"}`}>
                  {softTopEnabled && <IconCheck className="w-3 h-3 text-black" />}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">Soft Top Add-On</div>
                  <div className="text-white/40 text-xs">Protective soft cover for transport & storage</div>
                </div>
              </div>
              <span className="text-[#4AC9D3] font-bold text-sm">+$20.99</span>
            </button>

            {/* Hard Case */}
            <button
              onClick={() => setHardCaseEnabled(!hardCaseEnabled)}
              className={`flex items-center justify-between px-4 py-3.5 border rounded-xl transition-colors ${hardCaseEnabled ? "border-[#4AC9D3]/40 bg-[#4AC9D3]/5" : "border-white/10 bg-[#0A0A0A] hover:border-white/20"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${hardCaseEnabled ? "bg-[#4AC9D3] border-[#4AC9D3]" : "border-white/30"}`}>
                  {hardCaseEnabled && <IconCheck className="w-3 h-3 text-black" />}
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">Custom Hard Case Add-On</div>
                  <div className="text-white/40 text-xs">IP67 waterproof case with custom foam insert</div>
                </div>
              </div>
              <span className="text-[#4AC9D3] font-bold text-sm">+$59.99</span>
            </button>
          </div>}

          {/* Running total — OG & Baby only */}
          {!isPreOrder && !isEngraving && !isAccessory && addOnTotal > 0 && (
            <div className="bg-[#0A0A0A] border border-white/8 rounded-lg px-4 py-3 flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-white/50">
                <span>ShoreHitch OG</span><span>${product.price.toFixed(2)}</span>
              </div>
              {engravingEnabled && <div className="flex justify-between text-white/50"><span>Custom Engraving</span><span>+$59.99</span></div>}
              {softTopEnabled && <div className="flex justify-between text-white/50"><span>Soft Top</span><span>+$20.99</span></div>}
              {hardCaseEnabled && <div className="flex justify-between text-white/50"><span>Hard Case</span><span>+$59.99</span></div>}
              {qty > 1 && <div className="flex justify-between text-white/50"><span>Qty</span><span>× {qty}</span></div>}
              <div className="border-t border-white/10 mt-1 pt-1.5 flex justify-between text-white font-bold">
                <span>Total</span><span>${lineTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Qty + CTA — hidden for engraving (has its own CTA above) */}
          {!isEngraving && <div className="flex gap-3">
            {(!isPreOrder) && (
              <div className="flex items-center border border-white/15 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 text-white hover:bg-white/5 transition-colors text-lg">−</button>
                <span className="w-10 text-center text-white font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-12 text-white hover:bg-white/5 transition-colors text-lg">+</button>
              </div>
            )}
            {isPreOrder ? (
              <button
                onClick={handleAdd}
                className={`flex-1 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base transition-all ${
                  added ? "bg-green-500 text-white" : "bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black cta-pulse"
                }`}
              >
                {added
                  ? <><IconCheck className="w-5 h-5" /> Pre-Order Confirmed!</>
                  : <>Reserve My {preOrderSize} — ${preOrderPayment === "full" ? "999.99" : "499.99 Deposit"}</>
                }
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className={`flex-1 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  added ? "bg-green-500 text-white" : "bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black cta-pulse"
                }`}
              >
                {added ? <><IconCheck className="w-4 h-4" /> Added!</> : <><IconCart className="w-4 h-4" /> Add to Cart — ${lineTotal.toFixed(2)}</>}
              </button>
            )}
          </div>}

          {/* Baby ShoreHitch — spike size callout */}
          {product.id === 2 && (
            <div className="bg-gradient-to-r from-[#4AC9D3]/10 to-[#0044FE]/10 border border-[#4AC9D3]/25 rounded-xl p-5">
              <div className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase mb-3">Compact by Design</div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-white font-bold text-2xl tracking-tight">15"</div>
                  <div className="text-white/45 text-xs mt-0.5">Baby ShoreHitch spike</div>
                </div>
                <div className="text-center border-l border-white/10">
                  <div className="text-white/40 font-bold text-2xl tracking-tight">24"</div>
                  <div className="text-white/30 text-xs mt-0.5">OG ShoreHitch spike</div>
                </div>
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                Built for <span className="text-white font-semibold">vessels under 21 ft</span> — jet skis, PWCs, kayaks, canoes, and even tent spikes. Same strong hold as the OG in a slimmer, lighter package. If you want strong holds without the bulk, <span className="text-[#4AC9D3] font-semibold">this is your girl.</span>
              </p>
            </div>
          )}

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <IconShield className="w-4 h-4" />, label: [1,2,7].includes(product.id) ? "Lifetime Warranty" : "1-Yr Warranty" },
              { icon: <IconFlag className="w-4 h-4" />, label: "🇺🇸 Designed in USA" },
              { icon: <IconShipping className="w-4 h-4" />, label: "Free Ship $599+" },
            ].map((item) => (
              <div key={item.label} className="bg-[#0A0A0A] border border-white/8 rounded-lg p-3 flex flex-col items-center gap-1.5 text-center hover:border-[#4AC9D3]/25 transition-colors">
                <span className="text-[#4AC9D3]">{item.icon}</span>
                <span className="text-white/60 text-[10px] font-semibold leading-tight">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="flex border-b border-white/10">
              {(["features", "description", "warranty"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-semibold capitalize tracking-wide transition-colors ${
                    activeTab === tab ? "bg-[#4AC9D3]/10 text-[#4AC9D3] border-b-2 border-[#4AC9D3]" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4">
              {activeTab === "description" && <p className="text-white/80 text-base font-semibold leading-relaxed">{product.description}</p>}
              {activeTab === "features" && (
                <ul className="flex flex-col gap-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-base text-white font-semibold">
                      <IconCheck className="w-4 h-4 text-[#4AC9D3] flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "warranty" && (
                <div className="text-sm text-white/60 leading-relaxed">
                  {[1,2,7].includes(product.id) ? (
                    <>
                      <p className="font-semibold text-white mb-2">Lifetime Warranty — No Fine Print.</p>
                      <p>If your ShoreHitch anchor ever fails due to defects in materials or workmanship, we will replace or repair it. Forever. We stand behind our anchors because we use them ourselves.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-white mb-2">1-Year Manufacturer Warranty.</p>
                      <p>This product is covered by a 1-year warranty against defects in materials and workmanship. Lifetime warranty applies to ShoreHitch OG, Baby ShoreHitch, and Bucket Anchor units only.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bucket Anchor Technical Section ── */}
      {isPreOrder && (
        <div className="mt-20 border-t border-white/8 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-6 h-px bg-[#4AC9D3]" />
            <h2 className="font-semibold text-white text-2xl tracking-tight">Technical Overview</h2>
          </div>
          {/* Intro */}
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl mb-10">
            Engineered for every aquatic environment — from shallow freshwater coves to deep offshore passages. The Bucket Anchor's patented geometry creates progressive holding power: the harder the current or wind pulls, the deeper it sets.
          </p>

          {/* Spec cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { label: "Material", value: "Full 316 Stainless Steel" },
              { label: "Finish", value: "Mirror Polish" },
              { label: "Available Sizes", value: "20 lb & 40 lb" },
              { label: "Environment", value: "Freshwater & Offshore" },
              { label: "Depth Rating", value: "Unlimited" },
              { label: "Warranty", value: "Lifetime — No Fine Print" },
            ].map((spec) => (
              <div key={spec.label} className="bg-[#0A0A0A] border border-white/8 rounded-xl p-5 hover:border-[#4AC9D3]/25 transition-colors">
                <div className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase mb-2">{spec.label}</div>
                <div className="text-white font-semibold text-base">{spec.value}</div>
              </div>
            ))}
          </div>

          {/* Tech detail images — full width, side by side */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260202_010759_e366c6fb-3e0e-41f9-9848-9e924d095160_2.jpg?v=1787845742" alt="Bucket Anchor front detail" className="w-full h-auto object-contain" />
              </div>
              <p className="text-white/40 text-xs text-center tracking-wide">Front Profile — 316 Stainless Mirror Finish</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden bg-[#111] border border-white/8">
                <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260201_225635_1dd60d40-2020-4e07-9f72-b20972ec2441_5.jpg?v=1787845762" alt="Pivot handle detail" className="w-full h-auto object-contain" />
              </div>
              <p className="text-white/40 text-xs text-center tracking-wide">180° Pivot Handle — Precision Engineering</p>
            </div>
          </div>

          {/* Pre-order guarantee */}
          <div className="bg-[#4AC9D3]/5 border border-[#4AC9D3]/20 rounded-xl p-6 max-w-2xl">
            <div className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase mb-2">Pre-Order Guarantee</div>
            <p className="text-white/60 text-sm leading-relaxed">50% deposit secures your unit at today's price. Balance collected at time of shipment. Full refund available before fulfillment — no questions asked.</p>
          </div>
        </div>
      )}

      {/* ── Feature Callout + 3-Steps — OG & Baby only ── */}
      {(product.id === 1 || product.id === 2) && (
        <>
          {/* Tired of fighting your anchor? — 4 box callout */}
          <div className="mt-20 border-t border-white/8 pt-16">
            <div className="mb-4">
              <p className="text-white/40 text-xs font-semibold tracking-widest uppercase">Family ran, family owned. Every feature was designed to solve the frustrations we face.</p>
            </div>
            <h2 className="font-bold text-white text-3xl md:text-4xl tracking-tight mb-10">
              Tired of Fighting Your Anchor?<br />
              <span className="steel-text">Meet the One That Actually Holds.</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Baby Hitch photos */}
              <div className="hidden md:flex items-center justify-center gap-3 order-2 md:order-none">
                <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/7740C8BA-0192-49AD-B6D8-7DAA70E45FE1_2.png?v=1787845142" alt="Baby ShoreHitch" className="max-h-80 w-auto object-contain rounded-xl" />
                <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/00852E52-F824-4A41-8548-5AE33530A3CC_2.png?v=1787845143" alt="Baby ShoreHitch" className="max-h-80 w-auto object-contain rounded-xl" />
              </div>
              {/* 2x2 feature boxes */}
              <div className="grid grid-cols-2 gap-4 order-1 md:col-span-1 md:order-none" style={{gridColumn: "1 / -1"}}>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:border-[#4AC9D3]/30 transition-colors">
                  <div className="text-[#4AC9D3] text-xs font-bold tracking-widest uppercase mb-2">Easy to Set</div>
                  <p className="text-white/80 text-base font-semibold leading-relaxed">The slide-hammer drives deep with just a few taps, anchoring securely without strain, whether you're solo or with a crew.</p>
                </div>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:border-[#4AC9D3]/30 transition-colors">
                  <div className="text-[#4AC9D3] text-xs font-bold tracking-widest uppercase mb-2">Holds Steady</div>
                  <p className="text-white/80 text-base font-semibold leading-relaxed">The ShoreHitch is engineered to stay locked tight through wind, waves, and tide, giving you total peace of mind while you relax.</p>
                </div>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:border-[#4AC9D3]/30 transition-colors">
                  <div className="text-[#4AC9D3] text-xs font-bold tracking-widest uppercase mb-2">Built to Last</div>
                  <p className="text-white/80 text-base font-semibold leading-relaxed">Corrosion-resistant aluminum and stainless steel hold strong through rain, salt, sun, and year-round weather.</p>
                </div>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:border-[#4AC9D3]/30 transition-colors">
                  <div className="text-[#4AC9D3] text-xs font-bold tracking-widest uppercase mb-2">Premium Look</div>
                  <p className="text-white/80 text-base font-semibold leading-relaxed">With our custom colors and engraving options, you can make your anchor as distinctive as your equipment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Anchor Smarter in 3 Steps */}
          <div className="mt-16 border-t border-white/8 pt-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-xl overflow-hidden bg-[#111] aspect-[3/4]">
                <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/shorehitch-2025-tom-leigh--37.jpg?v=1783627028" alt="ShoreHitch in use" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div>
                <h2 className="font-bold text-white text-3xl md:text-4xl tracking-tight mb-2">Anchor</h2>
                <h3 className="font-bold text-white/60 text-2xl md:text-3xl tracking-tight mb-8">Smarter in 3 Steps</h3>
                <div className="flex flex-col gap-0">
                  {[
                    {
                      icon: "⬇",
                      label: "Hammer Down",
                      desc: "Use the integrated slide-handle to drive the anchor deep into any sand, mud, or clay bottom. No extra tools needed.",
                    },
                    {
                      icon: "🔗",
                      label: "Clip Your Line",
                      desc: "Attach your anchor line to the heavy-duty loop or clip on your boat, snowmobile, tent, or equipment. It's built to handle serious loads.",
                    },
                    {
                      icon: "😎",
                      label: "Relax All Day",
                      desc: "Your stuff stays put. Enjoy the peace of mind that comes from knowing you're secure, no matter the conditions.",
                    },
                  ].map((step, i) => (
                    <div key={step.label}>
                      <div className="flex items-start gap-4 py-5">
                        <div className="w-10 h-10 rounded-full bg-[#4AC9D3]/10 border border-[#4AC9D3]/30 flex items-center justify-center flex-shrink-0 text-lg">
                          {step.icon}
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm mb-1">{step.label}</div>
                          <p className="text-white/80 text-base font-semibold leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                      {i < 2 && <div className="rule-cyan" />}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {}}
                  className="mt-8 bg-white text-black font-bold px-10 py-4 rounded tracking-wide hover:bg-white/90 transition-colors"
                >
                  SHOP NOW
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reviews */}
      <div className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-[#4AC9D3]" />
          <h2 className="font-semibold text-white text-2xl tracking-tight">Customer Reviews</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/8 rounded-xl overflow-hidden flex flex-col hover:border-[#4AC9D3]/20 transition-colors">
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-0.5 h-36">
                  {review.photos.slice(0, 2).map((url, i) => (
                    <img key={i} src={url} alt="" className={`object-cover ${review.photos!.length > 1 ? "w-1/2" : "w-full"} h-full`} />
                  ))}
                </div>
              )}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between">
                  <Stars count={review.stars} />
                  {review.verified && (
                    <span className="text-[10px] font-bold text-[#4AC9D3] border border-[#4AC9D3]/30 px-2 py-0.5 rounded">VERIFIED</span>
                  )}
                </div>
                <p className="text-white/60 text-sm leading-relaxed flex-1">"{review.text}"</p>
                <div className="rule-cyan" />
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#4AC9D3]/15 border border-[#4AC9D3]/30 flex items-center justify-center text-[#4AC9D3] font-bold text-xs flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{review.name}</div>
                    <div className="text-white/35 text-xs">{review.location} · {review.date}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────
function CartPage({ cart, setPage, removeFromCart, onCheckout }: { cart: { product: Product; qty: number }[]; setPage: (p: Page) => void; removeFromCart: (id: number) => void; onCheckout: () => void }) {
  const subtotal = cart.reduce((s, item) => s + item.product.price * item.qty, 0);
  const shipping = subtotal >= 599 ? 0 : 14.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-02.png?v=1783443368" alt="" className="w-32 h-32 mx-auto mb-4 opacity-30" />
        <h2 className="font-bold text-white text-3xl mb-3 tracking-tight">Your Cart is Empty</h2>
        <p className="text-white/40 mb-8">Discover gear built by boaters, for boaters.</p>
        <button onClick={() => setPage("catalog")} className="bg-[#4AC9D3] text-black font-bold px-8 py-3 rounded-lg">
          Shop the Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-px bg-[#4AC9D3]" />
        <h1 className="font-bold text-white text-3xl tracking-tight">Your Cart</h1>
      </div>

      {/* Shipping progress */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-lg px-5 py-3 mb-8 flex items-center gap-3 text-sm">
        {subtotal >= 599 ? (
          <><IconCheck className="w-4 h-4 text-[#4AC9D3]" /><span className="text-[#4AC9D3] font-semibold">Free shipping unlocked!</span></>
        ) : (
          <><IconShipping className="w-4 h-4 text-[#4AC9D3]" /><span className="text-white/60">Add <span className="text-[#4AC9D3] font-semibold">${(599 - subtotal).toFixed(2)}</span> more for free shipping</span></>
        )}
        <div className="ml-auto h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4AC9D3] rounded-full transition-all"
            style={{ width: `${Math.min(100, (subtotal / 599) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          {cart.map(({ product, qty }) => (
            <div key={product.id} className="bg-[#0A0A0A] border border-white/8 rounded-xl p-4 flex gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#111]">
                <MediaThumb item={product.media[0]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[#4AC9D3]/60 text-[10px] font-bold tracking-widest uppercase">{product.tag}</div>
                    <div className="text-white font-semibold text-sm mt-0.5">{product.name}</div>
                    <div className="text-white/35 text-xs mt-0.5">Qty: {qty}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-white font-bold">${(product.price * qty).toFixed(2)}</div>
                    <button onClick={() => removeFromCart(product.id)} className="text-white/20 hover:text-red-400 text-xs mt-1 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-white mb-4">Order Summary</h3>
          <div className="flex flex-col gap-2 text-sm mb-4">
            <div className="flex justify-between text-white/55">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/55">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-[#4AC9D3]" : ""}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
          </div>
          <div className="rule-cyan mb-4" />
          <div className="flex justify-between font-bold text-white mb-5">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>

          <button onClick={onCheckout} className="w-full bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold py-4 rounded-lg cta-pulse transition-colors text-base">
            Proceed to Checkout
          </button>

          <div className="mt-5 pt-4 border-t border-white/8">
            <div className="text-white/25 text-[10px] text-center mb-2 uppercase tracking-widest">Accepted Payments</div>
            <div className="flex flex-wrap justify-center gap-1.5 text-white/35 text-[10px]">
              {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Shop Pay"].map((p) => (
                <span key={p} className="border border-white/10 rounded px-1.5 py-0.5">{p}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            {[
              { icon: <IconShield className="w-3 h-3" />, text: "Lifetime Warranty on anchor units" },
              { icon: <IconFlag className="w-3 h-3" />, text: "🇺🇸 Designed in the USA" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-white/35 text-xs">
                <span className="text-[#4AC9D3]">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dealer Page ──────────────────────────────────────────────────────────────
function DealerPage({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({
    contactName: "",
    businessName: "",
    businessType: "",
    location: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="relative z-10 bg-black min-h-screen">

      {/* Hero — dock background */}
      <div className="relative overflow-hidden">
        <img
          src="/dealer-hero.jpg"
          alt="ShoreHitch dealer"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-[#4AC9D3]" />
              <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Partner Program</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#4AC9D3]/15 border border-[#4AC9D3]/30 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#4AC9D3] animate-pulse" />
              <span className="text-[#4AC9D3] text-xs font-bold tracking-[0.15em] uppercase">Limited Spots Per Region</span>
            </div>
            <h1 className="font-bold text-white text-4xl md:text-6xl leading-tight tracking-tight mb-6">
              Become the First<br />
              <span className="steel-text">ShoreHitch Dealer</span><br />
              In Your Area.
            </h1>
            <p className="text-white/70 text-lg font-semibold leading-relaxed mb-4 max-w-xl">
              Early release partners gain untapped market visibility — before the competition even knows we exist.
            </p>
            <p className="text-white/45 text-sm font-semibold leading-relaxed mb-8 max-w-xl">
              We're selectively onboarding a limited number of dealers per region. Once your area is claimed, it's closed.
            </p>
            <div className="flex flex-wrap gap-6 mb-10">
              {["🇺🇸 Designed In The USA", "⚙️ Patent Pending", "🛡️ Lifetime Warranty on Anchors"].map((item) => (
                <span key={item} className="text-white/60 text-sm font-semibold flex items-center gap-2">{item}</span>
              ))}
            </div>
            <a href="#apply" className="inline-block bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold px-10 py-4 rounded tracking-widest uppercase text-sm transition-colors">
              Fill Out Your Dealer Info Sheet →
            </a>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="relative bg-[#1a1e24] border-y border-white/8 py-20 overflow-hidden">
        {/* Watermark S */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-5 pointer-events-none select-none">
          <img src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-02.png?v=1783443368" alt="" className="w-96 h-96" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-14">
            <h2 className="font-bold text-white text-3xl md:text-5xl tracking-tight mb-3">
              Dealer Benefits That Drive Sales.
            </h2>
            <p className="text-white/55 font-semibold text-base max-w-xl mx-auto">
              ShoreHitch is more than a product. It's a lifestyle brand, trusted by boaters nationwide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-3xl mx-auto mb-12">
            {[
              { icon: "🚚", text: "Fast shipping and support (international available)" },
              { icon: "📊", text: "MAP pricing enforcement" },
              { icon: "📦", text: "Marketing assets included" },
              { icon: "🎧", text: "Dedicated dealer support team" },
              { icon: "⚡", text: "Store logo engraving on soft top for brand visibility" },
              { icon: "🎓", text: "Product training and onboarding" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-[#4AC9D3] text-lg flex-shrink-0">{item.icon}</span>
                <span className="text-white/70 text-sm leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <a href="#apply" className="bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold px-12 py-4 rounded tracking-widest uppercase text-sm transition-colors">
              Fill Out Your Info Sheet →
            </a>
          </div>
        </div>
      </div>

      {/* Who we partner with */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-b border-white/8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-6 h-px bg-[#4AC9D3]" />
            <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Who We Work With</span>
            <div className="w-6 h-px bg-[#4AC9D3]" />
          </div>
          <h2 className="font-bold text-white text-2xl md:text-3xl tracking-tight">Open to All Industries</h2>
          <p className="text-white/45 text-sm mt-2">Bulk pricing available for qualified partners inside and outside the marine industry.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "⚓", label: "Marinas & Boat Clubs" },
            { icon: "🏪", label: "Marine Retailers" },
            { icon: "🛥️", label: "Boat Dealers" },
            { icon: "🏄", label: "Watersports Shops" },
            { icon: "🏕️", label: "Outdoor & Lifestyle" },
            { icon: "🎁", label: "Gift & Specialty" },
            { icon: "🏆", label: "Tournament Sponsors" },
            { icon: "🌎", label: "International Partners" },
          ].map((item) => (
            <div key={item.label} className="bg-[#0A0A0A] border border-white/8 rounded-xl p-5 flex flex-col items-center gap-3 text-center hover:border-[#4AC9D3]/30 transition-colors">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-white/70 text-xs font-semibold leading-snug">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why Now strip */}
      <div className="bg-gradient-to-r from-[#4AC9D3]/10 via-[#0044FE]/10 to-[#4AC9D3]/10 border-y border-[#4AC9D3]/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#4AC9D3]" />
              <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Why Partner Now?</span>
              <div className="w-6 h-px bg-[#4AC9D3]" />
            </div>
            <h2 className="font-bold text-white text-2xl md:text-3xl tracking-tight">Early Partners Win. Here's Why.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "Territory Exclusivity",
                body: "Be the only authorized ShoreHitch dealer in your market. First to apply, first to lock in. We cap dealers per region — no exceptions.",
              },
              {
                number: "02",
                title: "Ground-Floor Momentum",
                body: "ShoreHitch is in early release. You get in before national retail, before widespread press, and before your competitors realize what they missed.",
              },
              {
                number: "03",
                title: "Untapped Demand",
                body: "Our customers are already searching. Every boater in your area who discovers ShoreHitch should be buying it through you — not online past you.",
              },
            ].map((item) => (
              <div key={item.number} className="bg-black/40 border border-white/10 rounded-2xl p-7 flex flex-col gap-4">
                <span className="text-[#4AC9D3] font-bold text-3xl leading-none opacity-60">{item.number}</span>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#apply" className="inline-block bg-white hover:bg-white/90 text-black font-bold px-10 py-4 rounded tracking-widest uppercase text-sm transition-colors">
              Claim Your Territory →
            </a>
          </div>
        </div>
      </div>

      {/* Application form */}
      <div id="apply" className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-6 h-px bg-[#4AC9D3]" />
            <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Dealer Info Sheet</span>
            <div className="w-6 h-px bg-[#4AC9D3]" />
          </div>
          <h2 className="font-bold text-white text-3xl md:text-4xl tracking-tight mb-2">Fill Out Your Dealer Info Sheet</h2>
          <p className="text-white/45 text-sm">Tell us about your business and we'll reach out within 2 business days. Spots are limited — don't wait.</p>
        </div>

        {submitted ? (
          <div className="bg-[#4AC9D3]/10 border border-[#4AC9D3]/30 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-white font-bold text-2xl mb-2">Application Received!</h3>
            <p className="text-white/55 text-sm leading-relaxed mb-6">Thank you for your interest in becoming a ShoreHitch dealer. Our team will review your application and reach out within 2 business days.</p>
            <button onClick={() => setPage("home")} className="bg-[#4AC9D3] text-black font-bold px-8 py-3 rounded-lg hover:bg-[#6dd8e1] transition-colors">
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-white/8 rounded-2xl p-8 flex flex-col gap-5">

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Contact Name *</label>
                <input
                  type="text" required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  placeholder="Your full name"
                  className="bg-black border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/20 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Business Name *</label>
                <input
                  type="text" required
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  placeholder="Company or store name"
                  className="bg-black border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/20 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Business Type *</label>
              <select
                required
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                className="bg-black border border-white/10 focus:border-[#4AC9D3] text-white text-sm px-4 py-3 rounded-xl outline-none transition-colors appearance-none"
              >
                <option value="" disabled>Select your business type…</option>
                <option>Marina or Boat Club</option>
                <option>Marine Retailer</option>
                <option>Boat Dealer</option>
                <option>Watersports Shop</option>
                <option>Outdoor & Lifestyle Retailer</option>
                <option>Gift & Specialty</option>
                <option>Tournament / Event Sponsor</option>
                <option>International Partner</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Location *</label>
              <input
                type="text" required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, State / Country"
                className="bg-black border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/20 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Email *</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="business@email.com"
                  className="bg-black border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/20 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (000) 000-0000"
                  className="bg-black border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/20 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Notes & Questions</label>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Tell us about your business, estimated volume, questions about bulk pricing, or anything else we should know…"
                className="bg-black border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/20 text-sm px-4 py-3 rounded-xl outline-none transition-colors resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold py-4 rounded-xl text-sm tracking-widest uppercase transition-colors cta-pulse mt-2">
              Submit My Dealer Info Sheet
            </button>

            <p className="text-white/25 text-xs text-center">All applications are subject to review and approval. Submitting does not guarantee a dealership. Expect a response within 2 business days.</p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
function ContactPage({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="relative z-10 bg-black min-h-screen">

      {/* Hero bar */}
      <div className="bg-[#0A0A0A] border-b border-white/8 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-6 h-px bg-[#4AC9D3]" />
          <span className="text-[#4AC9D3] text-xs font-semibold tracking-[0.2em] uppercase">Get in Touch</span>
          <div className="w-6 h-px bg-[#4AC9D3]" />
        </div>
        <h1 className="font-bold text-white text-4xl md:text-5xl tracking-tight">Contact Us</h1>
        <p className="text-white/40 mt-3 text-sm">We're boaters too — we'll get back to you fast.</p>
      </div>

      {/* Contact info + map */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 mb-16">

          {/* Left — contact details */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase mb-3">Phone</div>
              <a href="tel:+14803826402" className="flex items-center gap-3 text-white font-semibold text-lg hover:text-[#4AC9D3] transition-colors">
                <svg className="w-5 h-5 text-[#4AC9D3] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
                </svg>
                +1 480-382-6402
              </a>
              <div className="rule-cyan mt-4" />
            </div>

            <div>
              <div className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase mb-3">Email</div>
              <a href="mailto:Info@ShoreHitch.com" className="flex items-center gap-3 text-white font-semibold text-lg hover:text-[#4AC9D3] transition-colors">
                <svg className="w-5 h-5 text-[#4AC9D3] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                Info@ShoreHitch.com
              </a>
              <div className="rule-cyan mt-4" />
            </div>

            <div>
              <div className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase mb-3">Address</div>
              <div className="flex items-start gap-3 text-white font-semibold text-base leading-relaxed">
                <svg className="w-5 h-5 text-[#4AC9D3] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <div className="text-white font-semibold">ShoreHitch, LLC</div>
                  <div>3370 N. Hayden Rd.</div>
                  <div>Phoenix, AZ 85251</div>
                </div>
              </div>
              <div className="rule-cyan mt-4" />
            </div>

            {/* Contact form */}
            {sent ? (
              <div className="bg-[#4AC9D3]/10 border border-[#4AC9D3]/30 rounded-xl p-6 text-center">
                <div className="text-[#4AC9D3] text-3xl mb-3">✓</div>
                <div className="text-white font-bold text-lg mb-1">Message Sent!</div>
                <p className="text-white/50 text-sm">We'll get back to you within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="text-[#4AC9D3] text-[10px] font-bold tracking-widest uppercase mb-1">Send a Message</div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" required placeholder="Your Name"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-[#0A0A0A] border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/25 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                  />
                  <input
                    type="email" required placeholder="Email Address"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-[#0A0A0A] border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/25 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                  />
                </div>
                <input
                  type="text" placeholder="Subject"
                  value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="bg-[#0A0A0A] border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/25 text-sm px-4 py-3 rounded-xl outline-none transition-colors"
                />
                <textarea
                  required rows={4} placeholder="How can we help?"
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="bg-[#0A0A0A] border border-white/10 focus:border-[#4AC9D3] text-white placeholder-white/25 text-sm px-4 py-3 rounded-xl outline-none transition-colors resize-none"
                />
                <button type="submit" className="bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold py-3.5 rounded-xl transition-colors cta-pulse">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right — map embed */}
          <div className="rounded-xl overflow-hidden border border-white/10 h-[520px] md:h-auto">
            <iframe
              title="ShoreHitch Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.5!2d-111.926!3d33.494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b08c9b0f6b0c7%3A0x0!2s3370+N+Hayden+Rd%2C+Scottsdale%2C+AZ+85251!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Backed for Life strip */}
        <div className="border-t border-white/8 pt-14">
          <h2 className="font-bold text-white text-3xl md:text-4xl tracking-tight text-center mb-3">
            BACKED FOR LIFE. RISK-FREE TO TRY.
          </h2>
          <p className="text-center text-white/50 text-sm font-semibold mb-10">The only custom anchor with a lifetime warranty Designed In The USA.</p>
          <div className="rule-cyan mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🛡️", label: "Lifetime Warranty", sub: "On ShoreHitch & Bucket Anchor Units" },
              { icon: "↩️", label: "30 Day Money-Back", sub: "Guarantee" },
              { icon: "🚚", label: "Ships in 14 Days", sub: "Custom: 3–4 Weeks" },
              { icon: "✅", label: "Trusted By Thousands", sub: "Of Enthusiasts Worldwide" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#4AC9D3]/10 border border-[#4AC9D3]/20 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{item.label}</div>
                  <div className="text-white/40 text-xs mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setPage("catalog")}
              className="bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold px-12 py-4 rounded tracking-wide transition-colors cta-pulse"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-[#050505] border-t border-white/8 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="mb-5">
              <img
                src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-02.png?v=1783443368"
                alt="ShoreHitch — Anchoring Redefined"
                className="h-24 w-auto"
              />
            </div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-5">
              America's first custom anchor system. Built by boaters, for boaters. 🇺🇸 Designed in the USA — backed for life.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-bold text-white border-2 border-[#4AC9D3] bg-[#4AC9D3]/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                🇺🇸 Designed in USA
              </span>
              {["Lifetime Warranty on Anchors", "Patent Pending"].map((badge) => (
                <span key={badge} className="text-xs text-[#4AC9D3]/70 border border-[#4AC9D3]/20 px-3 py-1.5 rounded-lg">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/25 text-[10px] font-bold tracking-widest uppercase mb-4">Shop</div>
            <div className="flex flex-col gap-3">
              {["ShoreHitch OG", "Baby ShoreHitch", "360° Swivel", "Dock Lines", "Accessories"].map((link) => (
                <button key={link} onClick={() => setPage("catalog")} className="text-white/45 hover:text-[#4AC9D3] text-sm text-left transition-colors">
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/25 text-[10px] font-bold tracking-widest uppercase mb-4">Support</div>
            <div className="flex flex-col gap-3">
              {["Contact Us", "Warranty Claim", "Shipping Info", "Returns", "FAQs"].map((link) => (
                <button key={link} onClick={() => link === "Contact Us" ? setPage("contact") : undefined} className="text-white/45 hover:text-[#4AC9D3] text-sm text-left transition-colors">
                  {link}
                </button>
              ))}
              <button onClick={() => setPage("dealer")} className="text-[#4AC9D3] hover:text-white text-sm text-left font-semibold transition-colors">
                Become a Dealer →
              </button>
            </div>
          </div>
        </div>
        <div className="rule-cyan mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-white/20 text-xs">
          <span>© 2025 ShoreHitch. All rights reserved. 🇺🇸 Family Owned & Operated — Designed in the USA.</span>
          <div className="flex gap-4">
            <button className="hover:text-white/40 transition-colors">Privacy Policy</button>
            <button className="hover:text-white/40 transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Welcome Popup ────────────────────────────────────────────────────────────
function WelcomePopup({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim()) return;
    setSubmitted(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText("WELCOME10").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[#0A0A0A] border border-[#4AC9D3]/25 rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
        {/* Cyan top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0044FE] via-[#4AC9D3] to-[#0044FE]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="px-10 py-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/ShoreHitch-03-3.png"
              alt="ShoreHitch — Anchoring Redefined"
              className="h-28 w-auto"
            />
          </div>

          {!submitted ? (
            <>
              {/* Pre-submit */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center gap-2 bg-[#4AC9D3]/10 border border-[#4AC9D3]/25 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-[#4AC9D3] text-sm font-bold tracking-widest uppercase">Exclusive Offer</span>
                </div>
                <h2 className="font-bold text-white text-4xl tracking-tight mb-3">
                  Get 10% Off Your First Order
                </h2>
                <p className="text-white/55 text-base leading-relaxed">
                  Join the ShoreHitch fleet. Unlock your discount code — plus early access to new products and drops.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-black border border-white/15 focus:border-[#4AC9D3] text-white placeholder-white/25 px-5 py-4 rounded-xl text-base outline-none transition-colors"
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email address"
                  className="w-full bg-black border border-white/15 focus:border-[#4AC9D3] text-white placeholder-white/25 px-5 py-4 rounded-xl text-base outline-none transition-colors"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone number (optional)"
                  className="w-full bg-black border border-white/15 focus:border-[#4AC9D3] text-white placeholder-white/25 px-5 py-4 rounded-xl text-base outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold py-4 rounded-xl text-base tracking-wide transition-colors cta-pulse mt-1"
                >
                  Unlock My 10% Discount →
                </button>
              </form>

              <p className="text-white/25 text-sm text-center mt-5">
                No spam. Unsubscribe anytime. 🇺🇸 Proudly Designed in the USA
              </p>
            </>
          ) : (
            <>
              {/* Post-submit — reveal code */}
              <div className="text-center mb-7">
                <div className="w-16 h-16 rounded-full bg-[#4AC9D3]/15 border border-[#4AC9D3]/30 flex items-center justify-center mx-auto mb-5">
                  <IconCheck className="w-8 h-8 text-[#4AC9D3]" />
                </div>
                <h2 className="font-bold text-white text-3xl tracking-tight mb-3">
                  You're In! Here's Your Code
                </h2>
                <p className="text-white/55 text-base">
                  Use this at checkout. Valid on orders $59.99+
                </p>
              </div>

              {/* Code reveal */}
              <div className="bg-black border border-[#4AC9D3]/30 rounded-xl p-5 text-center mb-4">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Your discount code</p>
                <p className="font-extrabold text-white tracking-[0.15em] text-3xl mb-4">
                  WELCOME<span className="text-[#4AC9D3]">10</span>
                </p>
                <button
                  onClick={handleCopy}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-[#4AC9D3]/15 hover:bg-[#4AC9D3]/25 text-[#4AC9D3] border border-[#4AC9D3]/30"
                  }`}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#4AC9D3] hover:bg-[#6dd8e1] text-black font-bold py-3.5 rounded-lg text-sm transition-colors"
              >
                Start Shopping
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [cartItems, setCartItems] = useState<{ product: Product; qty: number }[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [variantMap, setVariantMap] = useState<Record<number, string>>({});
  const variantMapRef = useRef<Record<number, string>>({});

  // Fetch first variant ID for each product on mount
  useEffect(() => {
    const gids = Object.values(SHOPIFY_PRODUCT_GIDS);
    const query = `
      query getVariants($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Product {
            id
            variants(first: 1) { nodes { id } }
          }
        }
      }
    `;
    storefrontFetch(query, { ids: gids }).then((data) => {
      const map: Record<number, string> = {};
      (data?.data?.nodes ?? []).forEach((node: { id: string; variants: { nodes: { id: string }[] } }) => {
        if (!node) return;
        const appId = Object.entries(SHOPIFY_PRODUCT_GIDS).find(([, gid]) => gid === node.id)?.[0];
        if (appId && node.variants?.nodes?.[0]) {
          map[Number(appId)] = node.variants.nodes[0].id;
        }
      });
      variantMapRef.current = map;
      setVariantMap(map);
    }).catch(() => {/* non-blocking */});
  }, []);

  // Show popup 4 seconds after load — once per session
  useEffect(() => {
    if (popupDismissed) return;
    const timer = setTimeout(() => setShowPopup(true), 4000);
    return () => clearTimeout(timer);
  }, [popupDismissed]);

  function dismissPopup() {
    setShowPopup(false);
    setPopupDismissed(true);
  }

  function viewProduct(id: number) {
    setSelectedProductId(id);
    setPage("product");
  }

  async function addToCart(product: Product) {
    // Update local cart display immediately
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });

    const variantId = variantMapRef.current[product.id] ?? variantMap[product.id];
    if (!variantId) return; // Shopify not available, local cart still works

    try {
      if (!shopifyCartId) {
        // Create cart with this item
        const createRes = await storefrontFetch(`
          mutation cartCreate($lines: [CartLineInput!]!) {
            cartCreate(input: { lines: $lines }) {
              cart { id checkoutUrl }
              userErrors { message }
            }
          }
        `, { lines: [{ merchandiseId: variantId, quantity: 1 }] });
        const cart = createRes?.data?.cartCreate?.cart;
        if (cart) {
          setShopifyCartId(cart.id);
          setCheckoutUrl(cart.checkoutUrl);
        }
      } else {
        // Add to existing cart
        const addRes = await storefrontFetch(`
          mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart { id checkoutUrl }
              userErrors { message }
            }
          }
        `, { cartId: shopifyCartId, lines: [{ merchandiseId: variantId, quantity: 1 }] });
        const cart = addRes?.data?.cartLinesAdd?.cart;
        if (cart) setCheckoutUrl(cart.checkoutUrl);
      }
    } catch {/* non-blocking: local cart already updated */}
  }

  function removeFromCart(id: number) {
    setCartItems((prev) => prev.filter((i) => i.product.id !== id));
  }

  function handleCheckout() {
    // Use window.top to break out of the Shopify iframe and navigate the full tab
    const target = window.top ?? window;
    if (checkoutUrl) {
      target.location.href = checkoutUrl;
    } else {
      // Fallback: build Shopify cart URL from variant IDs
      const lines = cartItems.map(({ product, qty }) => {
        const vid = variantMap[product.id];
        if (!vid) return null;
        const numericId = vid.split("/").pop();
        return `${numericId}:${qty}`;
      }).filter(Boolean);
      if (lines.length > 0) {
        target.location.href = `https://${SHOPIFY_DOMAIN}/cart/${lines.join(",")}`;
      }
    }
  }

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {showPopup && <WelcomePopup onClose={dismissPopup} />}
      <AnnouncementBar />
      <Nav page={page} setPage={setPage} cartCount={cartCount} />
      {page === "home" && <HomePage setPage={setPage} viewProduct={viewProduct} addToCart={addToCart} />}
      {page === "catalog" && <CatalogPage setPage={setPage} viewProduct={viewProduct} addToCart={addToCart} />}
      {page === "product" && <ProductPage productId={selectedProductId} addToCart={addToCart} />}
      {page === "cart" && <CartPage cart={cartItems} setPage={setPage} removeFromCart={removeFromCart} onCheckout={handleCheckout} />}
      {page === "contact" && <ContactPage setPage={setPage} />}
      {page === "dealer" && <DealerPage setPage={setPage} />}
    </div>
  );
}
