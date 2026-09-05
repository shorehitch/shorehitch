"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartLink() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function refresh() {
      const id = localStorage.getItem("sh_shopify_cart_id");
      if (!id) {
        if (active) setCount(0);
        return;
      }

      try {
        const response = await fetch(`/api/cart?id=${encodeURIComponent(id)}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load cart count");
        const payload = await response.json();
        if (!payload?.cart) {
          localStorage.removeItem("sh_shopify_cart_id");
          if (active) setCount(0);
          return;
        }
        if (active) setCount(payload.cart.totalQuantity || 0);
      } catch {
        if (active) setCount(0);
      }
    }

    function onUpdated(event: Event) {
      const custom = event as CustomEvent<{ totalQuantity?: number }>;
      if (typeof custom.detail?.totalQuantity === "number") setCount(custom.detail.totalQuantity);
      else void refresh();
    }

    void refresh();
    window.addEventListener("shorehitch:cart-updated", onUpdated);
    return () => {
      active = false;
      window.removeEventListener("shorehitch:cart-updated", onUpdated);
    };
  }, []);

  return (
    <Link href="/cart" aria-label={count ? `Cart with ${count} item${count === 1 ? "" : "s"}` : "Cart"} className="rounded-md border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#4AC9D3] hover:text-[#4AC9D3]">
      Cart{typeof count === "number" && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
