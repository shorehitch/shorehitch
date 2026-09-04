import { NextRequest, NextResponse } from "next/server";
import { addCartLines, createCart, getCart, removeCartLines, updateCartLines } from "../../../lib/shopify/cart";

export async function GET(request: NextRequest) {
  try {
    const cartId = request.nextUrl.searchParams.get("id");
    if (!cartId) return NextResponse.json({ error: "Missing cart id" }, { status: 400 });
    return NextResponse.json({ cart: await getCart(cartId) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cart request failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const operation = body?.operation as string | undefined;

    if (operation === "create") return NextResponse.json({ cart: await createCart(body.lines || []) });
    if (operation === "add") return NextResponse.json({ cart: await addCartLines(body.cartId, body.lines || []) });
    if (operation === "update") return NextResponse.json({ cart: await updateCartLines(body.cartId, body.lines || []) });
    if (operation === "remove") return NextResponse.json({ cart: await removeCartLines(body.cartId, body.lineIds || []) });

    return NextResponse.json({ error: "Unsupported cart operation" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cart request failed" }, { status: 500 });
  }
}
