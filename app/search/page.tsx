import type { Metadata } from "next";
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
      <SearchClient />
    </SiteShell>
  );
}
