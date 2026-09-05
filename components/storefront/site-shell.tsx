import Image from "next/image";
import Link from "next/link";
import BrandHeader from "./brand-header";

function InstagramIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.8" r=".8" fill="currentColor" stroke="none"/></svg>}
function FacebookIcon(){return <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true"><path d="M13.6 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V13h2.8v8h3.4Z"/></svg>}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <BrandHeader />
      <main>{children}</main>
      <footer className="border-t border-white/10 bg-[#070707]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr] md:px-8">
          <div>
            <Link href="/" aria-label="ShoreHitch home" className="inline-flex">
              <Image src="https://cdn.shopify.com/s/files/1/0934/6668/9902/files/ShoreHitch-03.png?v=1783102739" alt="ShoreHitch" width={360} height={140} className="h-32 w-auto max-w-[300px] object-contain object-left md:h-36 md:max-w-[340px]" />
            </Link>
            <p className="-mt-2 max-w-sm text-sm leading-6 text-white/45">Premium anchoring systems and accessories designed for boaters who expect more from their gear.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45"><span className="rounded-full border border-white/10 px-3 py-1.5">Designed in USA</span><span className="rounded-full border border-white/10 px-3 py-1.5">Patent Pending</span><span className="rounded-full border border-white/10 px-3 py-1.5">Lifetime Anchor Warranty</span></div>
            <div className="mt-5 flex items-center gap-3"><a href="https://www.instagram.com/shore_hitch/" target="_blank" rel="noopener noreferrer" aria-label="ShoreHitch on Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#4AC9D3]/60 hover:text-[#4AC9D3]"><InstagramIcon/></a><a href="https://www.facebook.com/share/1H4Hmcc3RK/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="ShoreHitch on Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#4AC9D3]/60 hover:text-[#4AC9D3]"><FacebookIcon/></a><span className="text-xs text-white/35">Follow ShoreHitch</span></div>
          </div>
          <div className="text-sm text-white/55"><div className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#4AC9D3]">Shop</div><div className="flex flex-col gap-2.5"><Link href="/shop">All Products</Link><Link href="/which-shorehitch">Which ShoreHitch?</Link><Link href="/how-it-works">How It Works</Link><Link href="/reviews">Reviews</Link></div></div>
          <div className="text-sm text-white/55"><div className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#4AC9D3]">Support</div><div className="flex flex-col gap-2.5"><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/account">Customer Account</Link><Link href="/anchor-education">Anchor Education</Link></div></div>
          <div className="text-sm text-white/55"><div className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#4AC9D3]">Company</div><div className="flex flex-col gap-2.5"><Link href="/about">About</Link><Link href="/dealer">Become a Dealer</Link><Link href="/search">Search</Link></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/25">Anchoring Redefined.</p></div>
        </div>
        <div className="border-t border-white/8 px-5 py-5 text-center text-[10px] uppercase tracking-[0.18em] text-white/25">© ShoreHitch. All rights reserved.</div>
      </footer>
    </div>
  );
}
