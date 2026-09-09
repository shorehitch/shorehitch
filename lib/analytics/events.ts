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

type KlaviyoCommand = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    klaviyo?: {
      track?: (event: string, properties?: Record<string, unknown>) => Promise<unknown> | void;
      identify?: (properties: Record<string, unknown>) => Promise<unknown> | void;
      push?: (...args: unknown[]) => void;
    };
    _klOnsite?: KlaviyoCommand[];
  }
}

function klaviyoPayload(payload: CommerceEvent) {
  const firstItem = payload.items?.[0];
  return {
    ProductID: firstItem?.item_id,
    Product: firstItem?.item_name,
    Name: firstItem?.item_name,
    Variant: firstItem?.item_variant,
    Price: firstItem?.price,
    Quantity: firstItem?.quantity,
    Currency: payload.currency,
    Value: payload.value,
    SearchTerm: payload.search_term,
    Items: payload.items,
    URL: typeof window !== "undefined" ? window.location.href : undefined,
  };
}

function trackKlaviyo(event: string, properties: Record<string, unknown>) {
  if (window.klaviyo?.track) {
    window.klaviyo.track(event, properties);
    return;
  }
  window._klOnsite = window._klOnsite || [];
  window._klOnsite.push(["track", event, properties]);
}

export function trackCommerceEvent(name: string, payload: CommerceEvent = {}) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, payload);

  const metaMap: Record<string, string> = {
    view_item: "ViewContent",
    select_item: "ViewContent",
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

  const klaviyoMap: Record<string, string> = {
    view_item: "Viewed Product",
    add_to_cart: "Added to Cart",
    begin_checkout: "Started Checkout",
    search: "Searched Site",
  };
  const klaviyoEvent = klaviyoMap[name];
  if (klaviyoEvent) trackKlaviyo(klaviyoEvent, klaviyoPayload(payload));
}
