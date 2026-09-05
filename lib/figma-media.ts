export type FigmaMediaItem = { type: "image" | "video"; src: string };

const MEDIA: Record<string, FigmaMediaItem[]> = {
  shorehitch: [
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
  "baby-hitch-18-12": [
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/White_-_Logo_Close_Up_2.png?v=1787845710" },
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Blue_Shorehitch.png?v=1787847178" },
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Black_Shorehitch.jpg?v=1787846954" },
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/Red_Shorehitch.png?v=1787847502" },
  ],
  "360-anchor-swivel": [
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/698074571f68d17cc2037417.png?v=1783102734" },
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260201_204053_6e52e1f3-4b2e-4e62-9581-7000ea883dd4_3.png?v=1787845721" },
    { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/5cb79124da0b47c48840f644f534fa4e.mp4" },
    { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/6aafb256f2ab47a08e666a4d54774d91.mp4" },
  ],
  "custom-dock-lines-pair": [
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/6969862802ec93f027e0a328.png?v=1783102737" },
  ],
  "shorehook-tether-adjuster": [
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/6980745766e7cafbcee57142.png?v=1783102736" },
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260201_042036_2e16c0e0-f9db-41cd-80a3-c12f1aa4e6c6_2.png?v=1787845738" },
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260201_003419_8f479eac-2b3e-49e7-a573-6c79bf7ab74e_3.png?v=1787845706" },
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260129_180858_3eb81f72-0ea5-4f77-9f27-16f792ed8472_2.jpg?v=1787845671" },
  ],
  "dry-bag-storage": [
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/IMG_3503.jpg?v=1787855328" },
  ],
  "shorehitch-bucket-pre-order-today": [
    { type: "image", src: "https://cdn.shopify.com/s/files/1/0934/6668/9902/files/hf_20260202_000624_ec4a2448-a882-4a52-9fe5-d866947da597_4.png?v=1787845811" },
  ],
};

export function figmaMedia(handle: string): FigmaMediaItem[] { return MEDIA[handle] || []; }
export function figmaCardImage(handle: string, fallback?: string | null): string | null { return MEDIA[handle]?.find((item) => item.type === "image")?.src || fallback || null; }
