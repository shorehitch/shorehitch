"use client";

import dynamic from "next/dynamic";

const LegacyStorefront = dynamic(() => import("../src/App"), {
  ssr: false,
  loading: () => <main className="min-h-screen bg-black" aria-busy="true" />,
});

export default function StorefrontShell() {
  return <LegacyStorefront />;
}
