import Link from "next/link";
import SiteShell from "../components/storefront/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">404</div>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">This page drifted off course.</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45">The page you’re looking for may have moved. Head back to the ShoreHitch collection or use search to find what you need.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop" className="rounded-lg bg-[#4AC9D3] px-6 py-4 text-sm font-black uppercase tracking-wider text-black">Shop ShoreHitch</Link>
          <Link href="/search" className="rounded-lg border border-white/15 px-6 py-4 text-sm font-black uppercase tracking-wider text-white">Search</Link>
        </div>
      </div>
    </SiteShell>
  );
}
