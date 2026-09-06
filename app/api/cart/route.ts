import { NextRequest, NextResponse } from "next/server";
import { addCartLines, createCart, getCart, removeCartLines, updateCartLines } from "../../../lib/shopify/cart";

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function GET(request: NextRequest) {
  try {
    const cartId = request.nextUrl.searchParams.get("id")?.trim();
    if (!cartId) return badRequest("Missing cart id");
    return NextResponse.json({ cart: await getCart(cartId) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cart request failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const operation = typeof body?.operation === "string" ? body.operation : "";
    const cartId = typeof body?.cartId === "string" ? body.cartId.trim() : "";

    if (operation === "create") {
      if (body.lines !== undefined && !Array.isArray(body.lines)) return badRequest("Cart lines must be an array");
      return NextResponse.json({ cart: await createCart(body.lines || []) });
    }

    if (!cartId) return badRequest("Missing cart id");

    if (operation === "add") {
      if (!Array.isArray(body.lines) || body.lines.length === 0) return badRequest("At least one cart line is required");
      return NextResponse.json({ cart: await addCartLines(cartId, body.lines) });
    }

    if (operation === "update") {
      if (!Array.isArray(body.lines) || body.lines.length === 0) return badRequest("At least one cart line update is required");
      return NextResponse.json({ cart: await updateCartLines(cartId, body.lines) });
    }

    if (operation === "remove") {
      if (!Array.isArray(body.lineIds) || body.lineIds.length === 0) return badRequest("At least one cart line id is required");
      return NextResponse.json({ cart: await removeCartLines(cartId, body.lineIds) });
    }

    return badRequest("Unsupported cart operation");
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("Invalid JSON body");
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cart request failed" }, { status: 500 });
  }
}
