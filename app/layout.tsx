import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.vercel.app"),
  title: {
    default: "ShoreHitch — Anchoring Redefined",
    template: "%s — ShoreHitch",
  },
  description: "Premium American-designed anchoring systems and marine accessories built for boaters who expect more.",
  robots: {
    index: process.env.VERCEL_ENV === "production",
    follow: process.env.VERCEL_ENV === "production",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
