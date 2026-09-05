import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "../../components/storefront/site-shell";

export const metadata: Metadata = {
  title: "Account",
  description: "Access your ShoreHitch customer account and order history securely through Shopify.",
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "b5h2ta-gg.myshopify.com";
  const accountUrl = `https://${shopDomain}/account`;

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-28">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-[#4AC9D3]">Customer Account</div>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Orders, details and account access.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55">ShoreHitch customer accounts are secured and managed by Shopify. Continue to Shopify to sign in, review eligible order history and manage your customer account.</p>
        <a href={accountUrl} className="mt-8 inline-flex rounded-lg bg-[#4AC9D3] px-7 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#6DD8E1]">Continue to secure account</a>
        <div className="mt-6"><Link href="/shop" className="text-sm font-bold text-white/45 transition hover:text-white">Return to shop</Link></div>
      </section>
    </SiteShell>
  );
}
