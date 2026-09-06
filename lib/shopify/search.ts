import { storefrontFetch } from "./storefront";
import type { StorefrontProduct } from "./products";

const SEARCH_PRODUCT_FIELDS = `
  id handle title description availableForSale
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
  variants(first: 25) {
    nodes {
      id title availableForSale
      selectedOptions { name value }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      image { url altText width height }
    }
  }
`;

export async function searchProducts(query: string, first = 20): Promise<StorefrontProduct[]> {
  const normalized = query.trim();
  if (!normalized) return [];
  const data = await storefrontFetch<{ search: { nodes: StorefrontProduct[] } }>(
    `query SearchProducts($query: String!, $first: Int!) {
      search(query: $query, first: $first, types: [PRODUCT]) {
        nodes {
          ... on Product { ${SEARCH_PRODUCT_FIELDS} }
        }
      }
    }`,
    { query: normalized, first },
    { cache: "no-store" },
  );
  return data.search.nodes;
}
