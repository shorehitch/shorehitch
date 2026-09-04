# ShoreHitch Headless Launch Checklist

This file tracks owner-level launch inputs that cannot be safely guessed in code. The production-build branch should not be merged or assigned to shorehitch.com until these are resolved and QA is complete.

## Required before production cutover

- [ ] Confirm contact/dealer lead destination and configure `LEADS_WEBHOOK_URL` in Vercel. Optional `LEADS_WEBHOOK_BEARER` if the endpoint requires it.
- [ ] Confirm the production Storefront API public token is present in Vercel as `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` for Production and Preview.
- [ ] Confirm `NEXT_PUBLIC_SITE_URL=https://shorehitch.com` for Production only.
- [ ] Confirm free-shipping threshold and shipping-promise copy before displaying either globally.
- [ ] Confirm return-policy language and fulfillment/ship SLA.
- [ ] Confirm any performance claims used in marketing copy, especially timing, capacity, holding, current/side-load, and "first" claims.
- [ ] Confirm engraving workflow for uploaded logos. Text engraving attributes are supported; logo files require a durable uploaded-file URL before checkout.
- [ ] Verify checkout receives product variants, quantities, and engraving attributes correctly.
- [ ] Verify Shopify packing/order workflow exposes line attributes to fulfillment.
- [ ] Verify mobile and desktop navigation, PDPs, cart, search, and checkout on the final preview.
- [ ] Confirm complete redirect inventory from the current live storefront / Search Console before DNS cutover.

## Analytics / lifecycle marketing

- [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` when the GA4 property is confirmed.
- [ ] Add `NEXT_PUBLIC_META_PIXEL_ID` when the correct Meta dataset/pixel is confirmed.
- [ ] Add `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY` when the ShoreHitch Klaviyo account key is confirmed.
- [ ] Confirm purchase attribution through Shopify checkout and decide whether server-side Meta CAPI is required at launch or immediately after.
- [ ] Confirm Judge.me live widget/API strategy if continuing beyond the imported published-review dataset.

## Domain cutover — last step only

- [ ] Keep current Shopify storefront live until production candidate passes QA.
- [ ] Do not change `shorehitch.com` DNS until approved.
- [ ] Add production domain to Vercel, verify DNS records, then validate HTTPS and canonical URLs.
- [ ] Re-crawl sitemap/robots/canonicals/structured data after cutover.
- [ ] Submit final sitemap to Google Search Console.
