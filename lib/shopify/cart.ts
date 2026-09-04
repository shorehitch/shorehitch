import { storefrontFetch } from "./storefront";

export type CartAttribute = { key: string; value: string };
export type CartLineInput = { merchandiseId: string; quantity?: number; attributes?: CartAttribute[] };
export type CartLineUpdateInput = { id: string; merchandiseId?: string; quantity?: number; attributes?: CartAttribute[] };

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    nodes {
      id quantity attributes { key value }
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id title availableForSale
          price { amount currencyCode }
          image { url altText width height }
          product { id handle title }
          selectedOptions { name value }
        }
      }
    }
  }
`;

function assertCartPayload<T extends { userErrors: { field: string[] | null; message: string }[] }>(payload: T) {
  if (payload.userErrors?.length) throw new Error(payload.userErrors.map((error) => error.message).join("; "));
  return payload;
}

export async function createCart(lines: CartLineInput[] = []) {
  const data = await storefrontFetch<{ cartCreate: { cart: unknown; userErrors: { field: string[] | null; message: string }[] } }>(
    `mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`,
    { input: { lines } },
  );
  return assertCartPayload(data.cartCreate).cart;
}

export async function getCart(id: string) {
  const data = await storefrontFetch<{ cart: unknown | null }>(`query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`, { id });
  return data.cart;
}

export async function addCartLines(cartId: string, lines: CartLineInput[]) {
  const data = await storefrontFetch<{ cartLinesAdd: { cart: unknown; userErrors: { field: string[] | null; message: string }[] } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`,
    { cartId, lines },
  );
  return assertCartPayload(data.cartLinesAdd).cart;
}

export async function updateCartLines(cartId: string, lines: CartLineUpdateInput[]) {
  const data = await storefrontFetch<{ cartLinesUpdate: { cart: unknown; userErrors: { field: string[] | null; message: string }[] } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`,
    { cartId, lines },
  );
  return assertCartPayload(data.cartLinesUpdate).cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await storefrontFetch<{ cartLinesRemove: { cart: unknown; userErrors: { field: string[] | null; message: string }[] } }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`,
    { cartId, lineIds },
  );
  return assertCartPayload(data.cartLinesRemove).cart;
}
