"use client";

import { useState } from "react";
import { X, Plus, ShieldCheck, Lock } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";

export default function CheckoutClient() {
  const { items, removeItem } = useCart();
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card");
  const [cardType, setCardType] = useState<"card" | "apple" | "google" | "alipay">("card");
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [form, setForm] = useState({
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    country: "Ghana",
    address: "",
    state: "",
    city: "",
    zip: "",
    taxId: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = parseFloat((subtotal * 0.015).toFixed(2));
  const total = subtotal + tax;

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 2 ? digits.slice(0, 2) + " / " + digits.slice(2) : digits;
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
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

            {/* Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="relative flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-0.5 hover:bg-gray-700 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-6">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty {item.quantity}</p>
                    <p className="mt-2 text-sm font-bold text-gray-900">
                      ₵{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Discount code</p>
                    <p className="text-xs text-gray-400">Save 20% with code</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDiscount(!showDiscount)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
                >
                  <Plus className="h-4 w-4" />
                  Add code
                </button>
              </div>
              {showDiscount && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                  <button className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-800 font-medium">₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax</span>
                <span className="text-gray-800 font-medium">₵{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>₵{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Payment Form */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              {/* Pay Method Tabs */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-5">
                <button
                  onClick={() => setPayMethod("card")}
                  className={`flex-1 py-2.5 text-sm font-semibold transition ${
                    payMethod === "card" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Pay by Card
                </button>
                <button
                  onClick={() => setPayMethod("paypal")}
                  className={`flex-1 py-2.5 text-sm font-semibold transition ${
                    payMethod === "paypal" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Pay with PayPal
                </button>
              </div>

              {payMethod === "card" && (
                <>
                  {/* Card Type Icons */}
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                      { key: "card", label: "Card", icon: "💳" },
                      { key: "apple", label: "Apple Pay", icon: "" },
                      { key: "google", label: "Google Pay", icon: "G" },
                      { key: "alipay", label: "Alipay", icon: "A" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setCardType(opt.key as any)}
                        className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-2 text-xs font-medium transition ${
                          cardType === opt.key
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-lg">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Secure Link */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Lock className="h-3 w-3" />
                      <span>Secure payment link</span>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-gray-800">Learn more</button>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Email address</label>
                      <input
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Card number</label>
                      <div className="relative">
                        <input
                          value={form.cardNumber}
                          onChange={(e) => update("cardNumber", formatCardNumber(e.target.value))}
                          placeholder="1234 1234 1234 1234"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 pr-24"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <span className="text-xs font-bold text-blue-600">VISA</span>
                          <span className="text-xs font-bold text-red-500">MC</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Expiration date</label>
                        <input
                          value={form.expiry}
                          onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                          placeholder="MM / YY"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Security code</label>
                        <input
                          value={form.cvv}
                          onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="CVV"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Cardholder name</label>
                      <input
                        value={form.cardName}
                        onChange={(e) => update("cardName", e.target.value)}
                        placeholder="Full name on card"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Country</label>
                      <select
                        value={form.country}
                        onChange={(e) => update("country", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-white"
                      >
                        <option>Ghana</option>
                        <option>Nigeria</option>
                        <option>Kenya</option>
                        <option>South Africa</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="text-xs text-gray-500 mb-1 block">Address</label>
                      <input
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                        placeholder="Street address"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 pr-14"
                      />
                      {form.address && (
                        <button
                          onClick={() => update("address", "")}
                          className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Region / State</label>
                        <input
                          value={form.state}
                          onChange={(e) => update("state", e.target.value)}
                          placeholder="e.g. Greater Accra"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">City</label>
                        <input
                          value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          placeholder="City"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Tax ID number (optional)</label>
                      <input
                        value={form.taxId}
                        onChange={(e) => update("taxId", e.target.value)}
                        placeholder="Tax ID"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Summary + Pay Button */}
                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900">
                      <span>Total</span>
                      <span>₵{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition text-sm">
                    <Lock className="h-4 w-4" />
                    Pay ₵{total.toFixed(2)}
                  </button>

                  <p className="mt-4 text-center text-xs text-gray-400">
                    Powered by AMD Global · <span className="hover:underline cursor-pointer">Terms</span> · <span className="hover:underline cursor-pointer">Privacy</span>
                  </p>
                </>
              )}

              {payMethod === "paypal" && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <p className="text-sm text-gray-500">You will be redirected to PayPal to complete your payment.</p>
                  <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 rounded-xl transition text-sm">
                    Continue with PayPal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}