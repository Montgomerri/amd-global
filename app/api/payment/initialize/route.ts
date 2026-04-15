import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, items } = await req.json();

    if (!email || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    // 🔒 Call your cart verification API
    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      }
    );

    const verified = await verifyRes.json();

    if (!verified.success) {
      return NextResponse.json(
        { success: false, error: "Cart verification failed" },
        { status: 400 }
      );
    }

    //  Server-controlled amount (VERY IMPORTANT)
    const amount = Math.round(verified.total * 100); // convert to pesewas

    return NextResponse.json({
      success: true,
      email,
      amount,
      items: verified.items, // validated items
    });
  } catch (err: any) {
    console.error("INIT ERROR:", err);

    return NextResponse.json(
      { success: false, error: "Payment init failed" },
      { status: 500 }
    );
  }
}