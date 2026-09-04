import Link from "next/link";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/95">
        <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center px-5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Designed in the USA · Lifetime warranty on ShoreHitch anchor systems
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="text-lg font-black uppercase tracking-[0.16em] text-white">ShoreHitch</Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/70 md:flex">
            <Link className="transition hover:text-white" href="/shop">Shop</Link>
            <Link className="transition hover:text-white" href="/which-shorehitch">Which ShoreHitch?</Link>
            <Link className="transition hover:text-white" href="/how-it-works">How It Works</Link>
            <Link className="transition hover:text-white" href="/reviews">Reviews</Link>
          </nav>
          <Link href="/cart" className="rounded-md border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#4AC9D3] hover:text-[#4AC9D3]">Cart</Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-20 border-t border-white/10 bg-[#070707]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3 md:px-8">
          <div>
            <div className="text-lg font-black uppercase tracking-[0.16em]">ShoreHitch</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">Premium marine anchoring equipment designed for boaters who expect their gear to work as hard as they do.</p>
          </div>
          <div className="text-sm text-white/55">
            <div className="mb-3 font-bold uppercase tracking-wider text-white">Explore</div>
            <div className="flex flex-col gap-2"><Link href="/shop">Shop</Link><Link href="/faq">FAQ</Link><Link href="/dealer">Dealers</Link><Link href="/contact">Contact</Link></div>
          </div>
          <div className="text-sm text-white/55">
            <div className="mb-3 font-bold uppercase tracking-wider text-white">Built for the water</div>
            <p>Anchoring Redefined.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
