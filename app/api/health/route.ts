import { NextResponse } from "next/server";
import { getProducts } from "../../../lib/shopify/products";
import { shopifyConfig } from "../../../lib/shopify/storefront";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProducts(1);
    return NextResponse.json(
      {
        ok: true,
        storefront: "reachable",
        catalogReadable: products.length > 0,
        apiVersion: shopifyConfig.apiVersion,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, storefront: "unreachable", catalogReadable: false },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
