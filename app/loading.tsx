export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
        <div className="mt-5 h-12 max-w-xl animate-pulse rounded bg-white/10" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </main>
  );
}
