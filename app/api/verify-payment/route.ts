import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reference } = await req.json();

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { status: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}