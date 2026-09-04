export default function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shorehitch.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShoreHitch",
    url: siteUrl,
    description: "Premium marine anchoring systems and accessories designed in the USA.",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
