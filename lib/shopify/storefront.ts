const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "b5h2ta-gg.myshopify.com";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2026-07";

type ShopifyGraphQLError = { message: string };

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyGraphQLError[];
};

export async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (STOREFRONT_TOKEN) headers["X-Shopify-Storefront-Access-Token"] = STOREFRONT_TOKEN;

  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Shopify Storefront API failed with ${response.status}`);

  const json = (await response.json()) as ShopifyResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((error) => error.message).join("; "));
  if (!json.data) throw new Error("Shopify Storefront API returned no data");
  return json.data;
}

export const shopifyConfig = {
  domain: SHOPIFY_DOMAIN,
  apiVersion: API_VERSION,
};
