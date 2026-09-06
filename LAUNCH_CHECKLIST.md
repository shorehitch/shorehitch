# ShoreHitch Headless Launch Checklist

This file tracks owner-level launch inputs that cannot be safely guessed in code. The production-build branch should not be merged or assigned to shorehitch.com until these are resolved and QA is complete.

## Required before production cutover

- [x] Contact/dealer delivery configured through Resend using the verified `shorehitch.com` domain. Vercel Production and Preview contain `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, and `DEALER_TO_EMAIL`.
- [x] Core product, variant, collection, search, persistent cart, cart recovery, cart update/remove, engraving-text attributes, and Shopify checkout handoff implemented.
- [x] Mobile navigation and persistent live cart count implemented.
- [x] Shopify-backed related product merchandising implemented on PDPs.
- [x] Customer account handoff implemented through Shopify.
- [x] Confirmed indexed legacy URLs mapped to permanent redirects, including collections, products-preview and the existing sandbar education article.
- [x] Next Image optimization added to the homepage, shop, PDPs and collection pages.
- [x] Product, Breadcrumb, FAQ, Organization, WebSite/SearchAction and ItemList structured data implemented where applicable.
- [x] Preview deployments currently build successfully and no preview runtime errors were detected in the latest QA window.
- [x] Vercel Blob store connected for Preview and Production with `BLOB_READ_WRITE_TOKEN`; logo engraving feature flag enabled for both environments.
- [ ] Confirm the production Storefront API public token is present in Vercel as `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` for Production and Preview before enabling token-required Storefront features. Core storefront operations do not require a private Admin credential.
- [ ] Confirm `NEXT_PUBLIC_SITE_URL=https://shorehitch.com` for Production only.
- [ ] Confirm free-shipping threshold and shipping-promise copy before displaying either globally.
- [ ] Confirm return-policy language and fulfillment/ship SLA.
- [ ] Confirm any performance claims used in marketing copy, especially timing, capacity, holding, current/side-load, and "first" claims.
- [ ] Verify a real checkout receives product variants, quantities, text engraving attributes, and logo engraving URLs correctly.
- [ ] Verify Shopify packing/order workflow exposes line attributes to fulfillment.
- [ ] Complete final mobile and desktop visual QA on the production candidate.
- [ ] Confirm any additional redirect inventory available only from Google Search Console before DNS cutover.

## Analytics / lifecycle marketing

- [x] Ecommerce event layer implemented for product views, variant selections, add-to-cart, search and begin-checkout.
- [x] Vercel Analytics and Speed Insights instrumented for production performance monitoring.
- [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` when the GA4 property is confirmed.
- [ ] Add `NEXT_PUBLIC_META_PIXEL_ID` when the correct Meta dataset/pixel is confirmed.
- [ ] Add `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` when the ShoreHitch Klaviyo account key is confirmed.
- [ ] Confirm purchase attribution through Shopify checkout and decide whether server-side Meta CAPI is required at launch or immediately after. Avoid duplicate purchase events between Shopify checkout tracking and headless tracking.
- [ ] Confirm Judge.me live widget/API strategy if continuing beyond the imported published-review dataset.

## Domain cutover — last step only

- [x] Current Shopify storefront remains live while the production candidate is tested.
- [x] Production rebuild PR is currently clean/mergeable but intentionally remains draft.
- [ ] Do not change `shorehitch.com` DNS until approved.
- [ ] Add production domain to Vercel, verify DNS records, then validate HTTPS and canonical URLs.
- [ ] Re-crawl sitemap/robots/canonicals/structured data after cutover.
- [ ] Submit final sitemap to Google Search Console.
