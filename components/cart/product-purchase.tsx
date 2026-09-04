"use client";

import { useMemo, useState } from "react";

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: { amount: string; currencyCode: string };
};

export default function ProductPurchase({
  variants,
  enableEngraving = false,
  engravingVariantId,
}: {
  variants: Variant[];
  enableEngraving?: boolean;
  engravingVariantId?: string | null;
}) {
  const firstAvailable = useMemo(() => variants.find((variant) => variant.availableForSale) || variants[0], [variants]);
  const [variantId, setVariantId] = useState(firstAvailable?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [engravingEnabled, setEngravingEnabled] = useState(false);
  const [engravingText, setEngravingText] = useState("");
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");

  const selected = variants.find((variant) => variant.id === variantId) || firstAvailable;
  if (!selected) return <p className="text-sm text-white/50">This product is not currently available.</p>;

  async function addToCart() {
    if (!selected.availableForSale || status === "adding") return;
    setStatus("adding");
    try {
      const lines: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[] = [
        { merchandiseId: selected.id, quantity },
      ];

      if (enableEngraving && engravingEnabled && engravingVariantId && engravingText.trim()) {
        lines.push({
          merchandiseId: engravingVariantId,
          quantity,
          attributes: [{ key: "Engraving Text", value: engravingText.trim() }],
        });
      }

      const savedCartId = localStorage.getItem("sh_shopify_cart_id");
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedCartId
          ? { operation: "add", cartId: savedCartId, lines }
          : { operation: "create", lines }),
      });
      if (!response.ok) throw new Error("Unable to update cart");
      const payload = await response.json();
      if (!payload?.cart?.id) throw new Error("Shopify did not return a cart");
      localStorage.setItem("sh_shopify_cart_id", payload.cart.id);
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-5">
      {variants.length > 1 && (
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-white/55">Choose option</span>
          <select value={variantId} onChange={(event) => setVariantId(event.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0A0A0A] px-4 py-3 text-sm text-white outline-none focus:border-[#4AC9D3]">
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                {variant.title}{variant.availableForSale ? "" : " — Sold out"}
              </option>
            ))}
          </select>
        </label>
      )}

      {enableEngraving && engravingVariantId && (
        <div className="rounded-xl border border-[#4AC9D3]/25 bg-[#4AC9D3]/5 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={engravingEnabled} onChange={(event) => setEngravingEnabled(event.target.checked)} className="h-4 w-4 accent-[#4AC9D3]" />
            <span className="text-sm font-bold text-white">Add custom engraving</span>
          </label>
          {engravingEnabled && (
            <div className="mt-4">
              <input value={engravingText} onChange={(event) => setEngravingText(event.target.value.slice(0, 60))} placeholder="Boat name or custom text" className="w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#4AC9D3]" />
              <div className="mt-2 text-right text-[11px] text-white/35">{engravingText.length}/60</div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex items-center rounded-lg border border-white/15 bg-[#0A0A0A]">
          <button aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-4 text-white/60 hover:text-white">−</button>
          <span className="min-w-8 text-center text-sm font-bold">{quantity}</span>
          <button aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(10, value + 1))} className="px-4 py-4 text-white/60 hover:text-white">+</button>
        </div>
        <button onClick={addToCart} disabled={!selected.availableForSale || status === "adding" || (engravingEnabled && !engravingText.trim())} className="flex-1 rounded-lg bg-[#4AC9D3] px-6 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#6DD8E1] disabled:cursor-not-allowed disabled:opacity-45">
          {status === "adding" ? "Adding…" : status === "added" ? "Added to Cart ✓" : "Add to Cart"}
        </button>
      </div>
      {status === "error" && <p className="text-sm text-red-300">We couldn’t update the cart. Please try again.</p>}
    </div>
  );
}
