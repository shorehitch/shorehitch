"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartLine = {
  id: string;
  quantity: number;
  attributes: { key: string; value: string }[];
  cost: { totalAmount: { amount: string; currencyCode: string } };
  merchandise: {
    id: string;
    title: string;
    image: { url: string; altText: string | null } | null;
    product: { id: string; handle: string; title: string };
    selectedOptions: { name: string; value: string }[];
  };
};

type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { nodes: CartLine[] };
};

function money(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(Number(amount));
}

export default function CartClient() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyLine, setBusyLine] = useState<string | null>(null);

  async function loadCart() {
    const id = localStorage.getItem("sh_shopify_cart_id");
    if (!id) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/cart?id=${encodeURIComponent(id)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load cart");
      const payload = await response.json();
      if (!payload.cart) {
        localStorage.removeItem("sh_shopify_cart_id");
        setCart(null);
      } else {
        setCart(payload.cart);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCart(); }, []);

  async function mutate(operation: "update" | "remove", body: Record<string, unknown>, lineId: string) {
    if (!cart?.id) return;
    setBusyLine(lineId);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, cartId: cart.id, ...body }),
      });
      if (!response.ok) throw new Error("Unable to update cart");
      const payload = await response.json();
      setCart(payload.cart);
      if (!payload.cart?.totalQuantity) localStorage.removeItem("sh_shopify_cart_id");
    } catch (error) {
      console.error(error);
    } finally {
      setBusyLine(null);
    }
  }

  if (loading) return <div className="py-24 text-center text-sm text-white/45">Loading your cart…</div>;

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">Your cart</div>
        <h1 className="mt-3 text-4xl font-black">Ready when you are.</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/45">Your cart is empty. Explore ShoreHitch anchoring systems and accessories built for the water.</p>
        <Link href="/shop" className="mt-8 inline-flex rounded-lg bg-[#4AC9D3] px-7 py-4 text-sm font-black uppercase tracking-wider text-black">Shop the collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="mb-8">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">Secure Shopify cart</div>
        <h1 className="mt-2 text-4xl font-black">Your Cart</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.lines.nodes.map((line) => {
            const color = line.merchandise.selectedOptions.find((option) => option.name.toLowerCase() === "color")?.value;
            const engraving = line.attributes.find((attribute) => attribute.key === "Engraving Text")?.value;
            return (
              <div key={line.id} className="flex gap-4 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                <div className="h-24 w-24 flex-none overflow-hidden rounded-lg bg-[#111]">
                  {line.merchandise.image ? <img src={line.merchandise.image.url} alt={line.merchandise.image.altText || line.merchandise.product.title} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${line.merchandise.product.handle}`} className="font-bold text-white hover:text-[#4AC9D3]">{line.merchandise.product.title}</Link>
                  {color && <div className="mt-1 text-xs text-white/40">Color: <span className="text-white/70">{color}</span></div>}
                  {engraving && <div className="mt-1 text-xs text-[#4AC9D3]">Engraving: “{engraving}”</div>}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-md border border-white/10">
                      <button disabled={busyLine === line.id || line.quantity <= 1} onClick={() => mutate("update", { lines: [{ id: line.id, quantity: line.quantity - 1 }] }, line.id)} className="px-3 py-2 text-white/55 disabled:opacity-25">−</button>
                      <span className="min-w-8 text-center text-sm font-bold">{line.quantity}</span>
                      <button disabled={busyLine === line.id} onClick={() => mutate("update", { lines: [{ id: line.id, quantity: line.quantity + 1 }] }, line.id)} className="px-3 py-2 text-white/55 disabled:opacity-25">+</button>
                    </div>
                    <button disabled={busyLine === line.id} onClick={() => mutate("remove", { lineIds: [line.id] }, line.id)} className="text-xs font-bold text-white/35 transition hover:text-red-300 disabled:opacity-25">Remove</button>
                  </div>
                </div>
                <div className="text-right font-black text-white">{money(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}</div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-xl border border-white/10 bg-[#0A0A0A] p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-black">Order Summary</h2>
          <div className="mt-5 flex justify-between text-sm text-white/50"><span>Items</span><span>{cart.totalQuantity}</span></div>
          <div className="mt-3 flex justify-between text-sm text-white/50"><span>Subtotal</span><span>{money(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}</span></div>
          <div className="my-5 h-px bg-white/10" />
          <div className="flex justify-between font-black"><span>Cart total</span><span>{money(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</span></div>
          <p className="mt-3 text-xs leading-5 text-white/35">Taxes, discounts and final shipping options are calculated by Shopify at checkout.</p>
          <button onClick={() => { window.location.href = cart.checkoutUrl; }} className="mt-6 w-full rounded-lg bg-[#4AC9D3] px-6 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#6DD8E1]">Checkout Securely</button>
          <Link href="/shop" className="mt-3 block text-center text-xs font-bold text-white/40 hover:text-white">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
