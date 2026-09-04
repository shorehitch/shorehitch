"use client";

type CommerceItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

type CommerceEvent = {
  currency?: string;
  value?: number;
  search_term?: string;
  items?: CommerceItem[];
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    klaviyo?: unknown[] & { push?: (event: unknown) => void };
  }
}

export function trackCommerceEvent(name: string, payload: CommerceEvent = {}) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, payload);

  const metaMap: Record<string, string> = {
    view_item: "ViewContent",
    add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout",
    search: "Search",
  };
  const metaEvent = metaMap[name];
  if (metaEvent && window.fbq) {
    window.fbq("track", metaEvent, {
      currency: payload.currency,
      value: payload.value,
      search_string: payload.search_term,
      content_ids: payload.items?.map((item) => item.item_id),
      contents: payload.items?.map((item) => ({ id: item.item_id, quantity: item.quantity || 1, item_price: item.price })),
      content_type: "product",
    });
  }

  window.klaviyo?.push?.(["track", name, payload]);
}
