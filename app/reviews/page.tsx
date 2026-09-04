import type { Metadata } from "next";
import SiteShell from "../../components/storefront/site-shell";

export const metadata: Metadata = {
  title: "ShoreHitch Reviews",
  description: "Read published ShoreHitch customer reviews and feedback.",
  alternates: { canonical: "/reviews" },
};

const REVIEWS = [
  { name: "Josh Santiago", title: "Best Purchase We Have Made", body: "After purchasing a ShoreHitch, we all decided it's by far the best purchase we've made for our boat. Lightweight, easy to use and even easier to customize to match our boat.", rating: 5 },
  { name: "Kaden Scott", title: "Incredible Customer Service and Quality", body: "The family behind the company is incredibly customer-focused. Their attention to detail is impressive, as shown by the awesome custom logo they added to our ShoreHitch.", rating: 5 },
  { name: "Cary S.", title: "Perfect for My Jet Ski", body: "ShoreHitch is truly a work of Art. I bought the Shore Hitch for my M33R. Loved that I was able to buy a blue ShoreHitch to match the colors of my boat.", rating: 5 },
  { name: "Cary S.", title: "Best Dock Lines We Have Owned", body: "The quality and innovation behind every product they make is second to none.", rating: 5 },
  { name: "Josh Santiago", title: "Game Changer Accessory", body: "A smart addition to the ShoreHitch setup and exactly the kind of accessory that makes a day on the water easier.", rating: 5 },
  { name: "Kaden Scott", title: "So Simple and So Useful", body: "Simple, useful and built with the same attention to detail we expected from ShoreHitch.", rating: 5 },
];

export default function ReviewsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4AC9D3]">Customer feedback</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Built to earn the spot on your boat.</h1>
          <p className="mt-5 text-base leading-7 text-white/55">The current published review export contains 29 reviews with an average rating of 4.97 out of 5.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <article key={`${review.name}-${index}`} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
              <div className="text-[#4AC9D3]">{"★".repeat(review.rating)}</div>
              <h2 className="mt-4 text-lg font-black">{review.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/48">“{review.body}”</p>
              <div className="mt-5 text-xs font-bold uppercase tracking-wider text-white/35">{review.name}</div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
