import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference, items, subtotal, tax, total, email, phone, address, city, state } = body;

    if (!reference) {
      return NextResponse.json({ success: false, error: "Missing reference" }, { status: 400 });
    }

    // 1. Verify payment with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== "success") {
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Check for duplicate order
    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("reference", reference)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, message: "Order already saved" });
    }

    // 3. Save to Supabase
    const { error } = await supabaseAdmin.from("orders").insert({
      reference,
      email,
      phone,
      items,
      subtotal,
      tax,
      total,
      address,
      city,
      state,
      payment_method: "paystack",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: "Failed to save order" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save order error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}