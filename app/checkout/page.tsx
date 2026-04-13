"use client";

import { useState } from "react";
import { X, ShieldCheck, Lock } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";
import PaystackPop from "@paystack/inline-js";
import swell from "@/lib/swell";

export default function CheckoutClient() {
  const { items, removeItem, clearCart } = useCart();
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    address: "",
    state: "",
    city: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = parseFloat((subtotal * 0.015).toFixed(2));
  const total = subtotal + tax;

  const handlePayment = () => {
    if (!form.email) { alert("Please enter your email"); return; }
    if (items.length === 0) { alert("Your cart is empty"); return; }

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: form.email,
      amount: Math.round(total * 100),
      currency: "GHS",

      onSuccess: async (transaction: any) => {
        setProcessing(true);
        try {
          // Step 1: Add items to Swell cart
          await swell.cart.setItems(
            items.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            }))
          );

          // Step 2: Set billing and shipping info + payment method
          await swell.cart.update({
            billing: {
              method: "paystack",
              email: form.email,
              address1: form.address,
              city: form.city,
              state: form.state,
              country: "GH",
            },
            shipping: {
              email: form.email,
              address1: form.address,
              city: form.city,
              state: form.state,
              country: "GH",
            },
          });

          // Step 3: Submit order to Swell
          const order = await swell.cart.submitOrder();
          console.log("Order submitted:", order);

          // Step 4: Clear local cart
          clearCart();

          // Step 5: Go to success page
          window.location.href = `/success?ref=${transaction.reference}&order=${order?.number || ""}`;

        } catch (err) {
          console.error("Failed to submit order:", err);
          clearCart();
          window.location.href = `/success?ref=${transaction.reference}`;
        } finally {
          setProcessing(false);
        }
      },

      onCancel: () => {
        console.log("Payment cancelled");
      },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">

      {/* Processing overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9AE600] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-700">Confirming your order...</p>
            <p className="text-xs text-gray-400 mt-1">Please don't close this page</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/cart" className="p-1 rounded-full hover:bg-gray-200 transition">
            <X className="h-4 w-4 text-gray-500" />
          </Link>
          <span className="text-sm text-gray-400">
            <Link href="/cart" className="hover:text-gray-700 transition">Shopping Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-semibold">Checkout</span>
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT — Order Summary */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Order Summary</h2>
            <p className="text-sm text-gray-400 mb-6">{items.length} item{items.length !== 1 ? "s" : ""}</p>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="relative flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <button onClick={() => removeItem(item.id)} className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-0.5 hover:bg-gray-700 transition">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty {item.quantity}</p>
                    <p className="mt-2 text-sm font-bold text-gray-900">₵{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Discount code</p>
                </div>
                <button onClick={() => setShowDiscount(!showDiscount)} className="text-sm text-gray-500 hover:text-gray-800">Add code</button>
              </div>
              {showDiscount && (
                <div className="mt-3 flex gap-2">
                  <input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Enter code" />
                  <button className="px-4 py-2 bg-black text-white text-sm rounded-lg">Apply</button>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax</span><span>₵{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t">
                <span>Total</span><span>₵{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Payment */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="text-lg font-bold mb-4">Payment Details</h3>
              <div className="space-y-3">
                <input placeholder="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition" />
                <input placeholder="Delivery Address" value={form.address} onChange={(e) => update("address", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition" />
                <div className="flex gap-2">
                  <input placeholder="Region" value={form.state} onChange={(e) => update("state", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition" />
                  <input placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition" />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="mt-6 w-full flex items-center justify-center gap-2 text-gray-900 font-bold py-4 rounded-xl transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#9AE600" }}
              >
                <Lock className="h-4 w-4" />
                Pay ₵{total.toFixed(2)}
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">Secure payment powered by Paystack</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}