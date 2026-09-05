import type { Metadata } from "next";
import { Suspense } from "react";
import SiteShell from "../../components/storefront/site-shell";
import SearchClient from "../../components/storefront/search-client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search ShoreHitch anchoring systems and marine accessories.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <SiteShell>
      <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-20 text-sm text-white/45 md:px-8">Loading search…</div>}>
        <SearchClient />
      </Suspense>
    </SiteShell>
  );
}
