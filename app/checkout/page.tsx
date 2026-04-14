"use client";

import { useState } from "react";
import { X, Lock } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";
import swell from "@/lib/swell";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCart();
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

  const loadPaystack = () =>
    new Promise<void>((resolve, reject) => {
      if (window.PaystackPop) return resolve();
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Paystack script failed to load"));
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!form.email) return alert("Please enter your email");
    if (items.length === 0) return alert("Your cart is empty");

    try {
      await loadPaystack();

      if (!window.PaystackPop) throw new Error("Paystack not available on window");

      const handler = window.PaystackPop.setup({
        key: "pk_live_9b66796f63600a703d0b0d707d5d766b8179ed42",
        email: form.email,
        amount: Math.round(total * 100),
        currency: "GHS",

        callback: async (transaction: any) => {
          setProcessing(true);
          try {
            await swell.cart.setItems(
              items.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
              }))
            );

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
                address1: form.address,
                city: form.city,
                state: form.state,
                country: "GH",
              },
            });

            const order = await swell.cart.submitOrder();
            clearCart();
            window.location.href = `/success?ref=${transaction.reference}&order=${order?.number || ""}`;
          } catch (err) {
            console.error("Order submission error:", err);
            clearCart();
            window.location.href = `/success?ref=${transaction.reference}`;
          } finally {
            setProcessing(false);
          }
        },

        onClose: () => {},
      });

      handler.openIframe();

    } catch (err) {
      console.error("EXACT ERROR:", err);
      alert("Payment system failed to load. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center shadow-xl">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9AE600] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-700">Confirming your order...</p>
            <p className="text-xs text-gray-400 mt-1">Please don't close this page</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

        {/* Order Summary */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Link href="/cart" className="p-1 rounded-full hover:bg-gray-200 transition">
              <X className="h-4 w-4 text-gray-500" />
            </Link>
            <span className="text-sm text-gray-400">
              <Link href="/cart" className="hover:text-gray-700">Shopping Cart</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-semibold">Checkout</span>
            </span>
          </div>

          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-3 items-center relative">
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 bg-gray-900 text-white rounded-full p-0.5 hover:bg-gray-700 transition"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">₵{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <div className="flex justify-between"><span>Subtotal</span><span>₵{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
            <div className="flex justify-between"><span>Tax (1.5%)</span><span>₵{tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span><span>₵{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-5">Payment Details</h3>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            <input
              placeholder="Delivery address"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
            <div className="flex gap-2">
              <input
                placeholder="Region"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
              <input
                placeholder="City"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#9AE600] transition"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="mt-6 w-full flex items-center justify-center gap-2 text-gray-900 font-bold py-3.5 rounded-xl transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#9AE600" }}
          >
            <Lock className="h-4 w-4" />
            Pay ₵{total.toFixed(2)}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">Secure payment powered by Paystack</p>
        </div>

      </div>
    </main>
  );
}