import { NextResponse } from "next/server";
import { getProduct } from "../../../../lib/shopify/products";

export async function GET(_request: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  try {
    const product = await getProduct(handle);
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product API error", error);
    return NextResponse.json({ error: "Product data is temporarily unavailable." }, { status: 502 });
  }
}
