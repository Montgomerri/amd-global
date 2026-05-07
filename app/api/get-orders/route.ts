import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (err) {
    console.error("Get orders error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}