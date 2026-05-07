"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type Status = "verifying" | "success" | "error";

export default function SuccessClient() {
  const params = useSearchParams();
  const ref = params.get("ref");

  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!ref) {
      setStatus("error");
      setErrorMsg("No payment reference found.");
      return;
    }

    const saveOrder = async () => {
      try {
        const raw = sessionStorage.getItem("pending-order");

        if (!raw) {
          setStatus("error");
          setErrorMsg("Order data expired. Please contact support with your reference.");
          return;
        }

        const orderData = JSON.parse(raw);

        const res = await fetch("/api/save-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: ref, ...orderData }),
        });

        const data = await res.json();

        if (data.success) {
          sessionStorage.removeItem("pending-order");
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Failed to confirm order.");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMsg("Something went wrong. Please contact support.");
      }
    };

    saveOrder();
  }, [ref]);

  if (status === "verifying") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#9AE600] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Confirming your order...</h1>
          <p className="text-gray-400 text-sm mt-2">Please don't close this page.</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 text-sm mb-4">{errorMsg}</p>
          {ref && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-400">Your payment reference</p>
              <p className="text-sm font-bold">{ref}</p>
            </div>
          )}
          <Link
            href="/products"
            className="w-full inline-block py-3 rounded-xl font-bold bg-[#9AE600] text-black"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-lime-500 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase. We'll contact you soon.
        </p>
        {ref && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400">Payment Reference</p>
            <p className="text-sm font-bold">{ref}</p>
          </div>
        )}
        <Link
          href="/products"
          className="w-full inline-block py-3 rounded-xl font-bold bg-[#9AE600] text-black mb-3"
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