"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const klaviyoKey = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY;

function RouteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    const pageLocation = `${window.location.origin}${pagePath}`;

    if (gaId && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: pageLocation,
        page_path: pagePath,
      });
    }

    if (metaPixelId && window.fbq) window.fbq("track", "PageView");

    window.klaviyo?.track?.("Viewed Page", {
      URL: pageLocation,
      Path: pagePath,
      Title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('config', '${gaId}', { send_page_view: true });
          `}</Script>
        </>
      )}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixelId}'); fbq('track', 'PageView');
        `}</Script>
      )}
      {klaviyoKey && (
        <Script
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${klaviyoKey}`}
          strategy="afterInteractive"
        />
      )}
      <Suspense fallback={null}><RouteAnalytics /></Suspense>
    </>
  );
}
