"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#4AC9D3]">ShoreHitch</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Something didn’t load correctly.</h1>
        <p className="mt-5 text-white/60">Your cart and checkout are handled separately, so a page error will not place an order. Try the page again.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="rounded-md bg-[#4AC9D3] px-5 py-3 font-semibold text-black hover:bg-[#6DD8E1]">Try again</button>
          <a href="/shop" className="rounded-md border border-white/15 px-5 py-3 font-semibold text-white hover:border-white/35">Return to shop</a>
        </div>
      </div>
    </main>
  );
}
