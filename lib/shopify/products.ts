import { storefrontFetch } from "./storefront";

export type Money = { amount: string; currencyCode: string };
export type ProductImage = { url: string; altText: string | null; width: number | null; height: number | null };
export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice: Money | null;
  image: ProductImage | null;
};
export type StorefrontProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ProductImage | null;
  images: { nodes: ProductImage[] };
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  variants: { nodes: ProductVariant[] };
  options: { name: string; optionValues: { name: string }[] }[];
  seo: { title: string | null; description: string | null };
};

const PRODUCT_FIELDS = `
  id handle title description descriptionHtml availableForSale
  seo { title description }
  featuredImage { url altText width height }
  images(first: 20) { nodes { url altText width height } }
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
  options { name optionValues { name } }
  variants(first: 100) {
    nodes {
      id title availableForSale
      selectedOptions { name value }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      image { url altText width height }
    }
  }
`;

export async function getProduct(handle: string): Promise<StorefrontProduct | null> {
  const data = await storefrontFetch<{ product: StorefrontProduct | null }>(
    `query ProductByHandle($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle },
  );
  return data.product;
}

export async function getProducts(first = 50): Promise<StorefrontProduct[]> {
  const data = await storefrontFetch<{ products: { nodes: StorefrontProduct[] } }>(
    `query Products($first: Int!) { products(first: $first, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } } }`,
    { first },
  );
  return data.products.nodes;
}

export async function getCollection(handle: string, first = 50) {
  const data = await storefrontFetch<{ collection: null | { id: string; handle: string; title: string; description: string; seo: { title: string | null; description: string | null }; products: { nodes: StorefrontProduct[] } } }>(
    `query Collection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        id handle title description seo { title description }
        products(first: $first) { nodes { ${PRODUCT_FIELDS} } }
      }
    }`,
    { handle, first },
  );
  return data.collection;
}
