import { NextResponse } from "next/server";
import swell from "@/lib/swell";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid cart data" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await swell.products.get(item.id);

      if (!product) continue;

      const price = Number(product.price || 0);
      const quantity = Number(item.quantity || 1);

      const lineTotal = price * quantity;

      subtotal += lineTotal;

      validatedItems.push({
        id: product.id,
        name: product.name,
        price,
        quantity,
        lineTotal,
      });
    }

    // optional business rules
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    return NextResponse.json({
      items: validatedItems,
      summary: {
        subtotal,
        shipping,
        tax,
        total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error validating cart" },
      { status: 500 }
    );
  }
}