import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid cart data" },
        { status: 400 }
      );
    }

    const productIds = items.map((i: any) => i.id);

    // Fetch products from Swell PUBLIC API (safe fallback)
    const res = await fetch(
      `https://store-${process.env.NEXT_PUBLIC_SWELL_STORE_ID}.swell.store/products`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    const products = data.results || [];

    let serverTotal = 0;

    const validatedCart = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.id);

      if (!product) {
        throw new Error("Invalid product");
      }

      const realPrice = product.price || 0;
      const quantity = item.quantity || 1;

      serverTotal += realPrice * quantity;

      return {
        id: item.id,
        name: product.name,
        price: realPrice,
        quantity,
        subtotal: realPrice * quantity,
      };
    });

    return NextResponse.json({
      success: true,
      items: validatedCart,
      total: serverTotal,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}