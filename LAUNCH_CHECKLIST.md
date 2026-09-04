# ShoreHitch Headless Launch Checklist

This file tracks owner-level launch inputs that cannot be safely guessed in code. The production-build branch should not be merged or assigned to shorehitch.com until these are resolved and QA is complete.

## Required before production cutover

- [x] Contact/dealer delivery configured through Resend using the verified `shorehitch.com` domain. Vercel Production and Preview contain `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL`, and `DEALER_TO_EMAIL`.
- [ ] Confirm the production Storefront API public token is present in Vercel as `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` for Production and Preview before enabling token-required Storefront features. Core product/cart flows currently use supported storefront access without a private Admin credential.
- [ ] Confirm `NEXT_PUBLIC_SITE_URL=https://shorehitch.com` for Production only.
- [ ] Confirm free-shipping threshold and shipping-promise copy before displaying either globally.
- [ ] Confirm return-policy language and fulfillment/ship SLA.
- [ ] Confirm any performance claims used in marketing copy, especially timing, capacity, holding, current/side-load, and "first" claims.
- [ ] Confirm engraving workflow for uploaded logos. Text engraving attributes are supported; logo files require a durable uploaded-file URL before checkout.
- [ ] Verify checkout receives product variants, quantities, and engraving attributes correctly with a real test checkout/order.
- [ ] Verify Shopify packing/order workflow exposes line attributes to fulfillment.
- [ ] Verify mobile and desktop navigation, PDPs, cart, search, and checkout on the final preview.
- [ ] Confirm complete redirect inventory from the current live storefront / Search Console before DNS cutover.

## Analytics / lifecycle marketing

- [x] Ecommerce event layer implemented for product views, add-to-cart, search and begin-checkout.
- [x] Vercel Analytics and Speed Insights instrumented for production performance monitoring.
- [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` when the GA4 property is confirmed.
- [ ] Add `NEXT_PUBLIC_META_PIXEL_ID` when the correct Meta dataset/pixel is confirmed.
- [ ] Add `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` when the ShoreHitch Klaviyo account key is confirmed.
- [ ] Confirm purchase attribution through Shopify checkout and decide whether server-side Meta CAPI is required at launch or immediately after. Avoid duplicate purchase events between Shopify checkout tracking and headless tracking.
- [ ] Confirm Judge.me live widget/API strategy if continuing beyond the imported published-review dataset.

## Domain cutover — last step only

- [x] Current Shopify storefront remains live while the production candidate is tested.
- [ ] Do not change `shorehitch.com` DNS until approved.
- [ ] Add production domain to Vercel, verify DNS records, then validate HTTPS and canonical URLs.
- [ ] Re-crawl sitemap/robots/canonicals/structured data after cutover.
- [ ] Submit final sitemap to Google Search Console.
