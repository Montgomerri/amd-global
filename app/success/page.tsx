"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const order = params.get("order");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f0ffd6" }}>
            <CheckCircle className="w-10 h-10" style={{ color: "#9AE600" }} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase. Your order has been placed and will be delivered to you across Ghana.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
          {order && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order number</span>
              <span className="font-semibold text-gray-900">#{order}</span>
            </div>
          )}
          {ref && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment reference</span>
              <span className="font-semibold text-gray-900 text-xs break-all">{ref}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery</span>
            <span className="font-semibold text-gray-900">Within Ghana</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-gray-900 hover:opacity-90 transition"
            style={{ backgroundColor: "#9AE600" }}
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
          >
            Go to Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          A confirmation email will be sent to you shortly.
        </p>
      </div>
    </main>
  );
}