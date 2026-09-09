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
        <>
          <Script id="klaviyo-bootstrap" strategy="beforeInteractive">{`
            !function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise(function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))});return e}}})}catch(n){window.klaviyo=window.klaviyo||{},window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();
          `}</Script>
          <Script src={`https://static.klaviyo.com/onsite/js/${klaviyoKey}/klaviyo.js`} strategy="afterInteractive" />
        </>
      )}
      <Suspense fallback={null}><RouteAnalytics /></Suspense>
    </>
  );
}
