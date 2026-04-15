import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Missing reference" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (!data.status || data.data.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Payment not successful" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      reference: data.data.reference,
      amount: data.data.amount,
      email: data.data.customer?.email,
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);

    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}