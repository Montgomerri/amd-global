"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessClient() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const order = params.get("order");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-lime-500">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase. We’ll contact you soon.
        </p>

        {order && (
          <div className="bg-gray-50 rounded-xl p-4 mb-3">
            <p className="text-xs text-gray-400">Order Number</p>
            <p className="text-sm font-bold">{order}</p>
          </div>
        )}

        {ref && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400">Payment Reference</p>
            <p className="text-sm font-bold">{ref}</p>
          </div>
        )}

        <Link
          href="/products"
          className="w-full inline-block py-3 rounded-xl font-bold bg-lime-500 text-black mb-3"
        >
          Continue Shopping
        </Link>

        <Link
          href="/"
          className="w-full inline-block py-3 rounded-xl font-bold bg-gray-100 text-gray-700"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}