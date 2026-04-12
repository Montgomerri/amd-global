"use client";

import { useState } from "react";
import { Minus, Plus, X, Tag, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";

const COUPON_CODES: Record<string, number> = {
  MAX500: 2.5,
  SAVE10: 10,
};

export default function CartClient() {
  const { items, removeItem, updateQty } = useCart();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const removeSelected = () => {
    selectedIds.forEach((id) => removeItem(id));
    setSelectedIds(new Set());
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPON_CODES[code]) {
      setAppliedCoupon(code);
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = appliedCoupon ? COUPON_CODES[appliedCoupon] : 0;
  const total = Math.max(0, subtotal - discount);
  const selectedItems = items.filter((i) => selectedIds.has(i.id));

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-0">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="text-xs font-semibold mt-1 text-black">Cart</span>
            </div>
            {/* Line */}
            <div className="w-24 sm:w-40 h-px bg-gray-300 mb-4" />
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-xs text-gray-400 mt-1">Address</span>
            </div>
            {/* Line */}
            <div className="w-24 sm:w-40 h-px bg-gray-300 mb-4" />
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-xs text-gray-400 mt-1">Payment</span>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
            <Link
              href="/products"
              className="mt-2 px-6 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left — Cart Items */}
            <div className="flex-1">
              {/* Selection Bar */}
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-black rounded"
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {selectedIds.size}/{items.length} items selected
                  </span>
                </label>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <button className="hover:text-gray-800 transition">Move to wishlist</button>
                  {selectedIds.size > 0 && (
                    <button
                      onClick={removeSelected}
                      className="hover:text-red-500 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 p-4 ${
                      idx !== items.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-1 w-4 h-4 accent-black rounded shrink-0"
                    />

                    {/* Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded-full hover:bg-gray-100 transition shrink-0"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Meta */}
                      <p className="mt-1 text-xs text-gray-400">
                        Express delivery in <span className="font-semibold text-gray-600">3 days</span>
                      </p>

                      {/* Price + Qty */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                          ₵{(item.price * item.quantity).toFixed(2)}
                        </span>

                        {/* Qty Stepper */}
                        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-black transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-black transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Summary */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">

              {/* Coupons */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Coupons</h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Coupons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-emerald-600">{appliedCoupon}</span>
                      <button onClick={removeCoupon}>
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-3">
                        <Tag className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-1 text-xs text-red-500">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Gifting */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Gifting</h3>
                <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Buying for a loved one?</p>
                    <p className="text-xs text-gray-500 mt-0.5">Send personalized message at ₵20</p>
                    <button className="mt-2 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition">
                      Add gift wrap
                    </button>
                  </div>
                  <span className="text-4xl">🎀</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Price Details</h3>

                <p className="text-xs text-gray-500 mb-3">
                  {items.reduce((sum, i) => sum + i.quantity, 0)} item{items.reduce((sum, i) => sum + i.quantity, 0) !== 1 ? "s" : ""}
                </p>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 truncate max-w-[60%]">
                        {item.quantity} x {item.name}
                      </span>
                      <span className="text-gray-800 font-medium">
                        ₵{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Coupon discount</span>
                      <span className="text-emerald-600 font-semibold">-₵{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Delivery Charges</span>
                    <span className="text-emerald-600 font-semibold">Free Delivery</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Total Amount</span>
                  <span className="text-sm font-bold text-gray-900">₵{total.toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white py-4 text-sm font-semibold hover:bg-gray-800 transition"
                >
                  Place order
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}