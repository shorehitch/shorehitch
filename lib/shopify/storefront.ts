const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "b5h2ta-gg.myshopify.com";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
// Pinned to Shopify's latest stable Storefront API version as of Sep 2026.
const API_VERSION = "2026-07";

type ShopifyGraphQLError = { message: string };
type ShopifyResponse<T> = { data?: T; errors?: ShopifyGraphQLError[] };

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}, options: { cache?: RequestCache; revalidate?: number } = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (STOREFRONT_TOKEN) headers["X-Shopify-Storefront-Access-Token"] = STOREFRONT_TOKEN;

  const request = () => fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: options.cache ?? (options.revalidate ? undefined : "no-store"),
    next: options.revalidate ? { revalidate: options.revalidate } : undefined,
  });

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await request();
      if (RETRYABLE_STATUS.has(response.status) && attempt < 2) {
        await sleep(150 * 2 ** attempt);
        continue;
      }
      if (!response.ok) throw new Error(`Shopify Storefront API failed with ${response.status}`);
      const json = (await response.json()) as ShopifyResponse<T>;
      if (json.errors?.length) throw new Error(json.errors.map((error) => error.message).join("; "));
      if (!json.data) throw new Error("Shopify Storefront API returned no data");
      return json.data;
    } catch (error) {
      lastError = error;
      if (attempt >= 2) break;
      await sleep(150 * 2 ** attempt);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Shopify Storefront API request failed");
}

export const shopifyConfig = { domain: SHOPIFY_DOMAIN, apiVersion: API_VERSION };
