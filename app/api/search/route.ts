import { NextResponse } from "next/server";
import { searchProducts } from "../../../lib/shopify/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  if (!query) return NextResponse.json({ products: [] });

  try {
    const products = await searchProducts(query, 20);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search API error", error);
    return NextResponse.json({ error: "Search is temporarily unavailable." }, { status: 502 });
  }
}
