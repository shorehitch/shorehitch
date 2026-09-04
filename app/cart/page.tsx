import type { Metadata } from "next";
import SiteShell from "../../components/storefront/site-shell";
import CartClient from "../../components/cart/cart-client";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your ShoreHitch cart and continue to secure Shopify checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <SiteShell>
      <CartClient />
    </SiteShell>
  );
}
