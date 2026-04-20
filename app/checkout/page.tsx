"use client";

import { useState } from "react";
import {
  X,
  Lock,
  MapPin,
  CreditCard,
  ShieldCheck,
  TicketPercent,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/cartContext";
import Link from "next/link";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type StoredOrder = {
  id: string;
  reference: string;
  items: CheckoutItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "order_placed";
  createdAt: number;
  email: string;
  address: string;
  state: string;
  city: string;
  paymentMethod: "paystack";
};

const ORDERS_STORAGE_KEY = "amd-orders";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);

  const [form, setForm] = useState({
    email: "",
    address: "",
    state: "",
    city: "",
  });

  const [discountCode, setDiscountCode] = useState("");

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

  const readStoredOrders = (): StoredOrder[] => {
    if (typeof window === "undefined") return [];

    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const now = Date.now();

      const validOrders = parsed.filter((order: StoredOrder) => {
        const createdAt = Number(order?.createdAt || 0);
        return createdAt && now - createdAt < THIRTY_DAYS_MS;
      });

      if (validOrders.length !== parsed.length) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(validOrders));
      }

      return validOrders;
    } catch {
      return [];
    }
  };

  const saveOrder = (order: StoredOrder) => {
    if (typeof window === "undefined") return;

    const existingOrders = readStoredOrders();
    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify([order, ...existingOrders])
    );
  };

  const submitOrderToLocalStorage = (transaction: any) => {
    setProcessing(true);

    try {
      const order: StoredOrder = {
        id: transaction?.reference || `${Date.now()}`,
        reference: transaction?.reference || `${Date.now()}`,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        tax,
        total,
        status: "order_placed",
        createdAt: Date.now(),
        email: form.email,
        address: form.address,
        state: form.state,
        city: form.city,
        paymentMethod: "paystack",
      };

      saveOrder(order);
      clearCart();
      window.location.href = `/success?ref=${transaction?.reference || ""}&order=${transaction?.reference || ""}`;
    } catch (err) {
      console.error("Order saving error:", err);
      clearCart();
      window.location.href = `/success?ref=${transaction?.reference || ""}`;
    }
  };

  const handlePayment = async () => {
    if (!form.email) return alert("Please enter your email");
    if (!form.address) return alert("Please enter your delivery address");
    if (items.length === 0) return alert("Your cart is empty");

    try {
      await loadPaystack();

      if (!window.PaystackPop) {
        throw new Error("Paystack not available on window");
      }

      const handler = window.PaystackPop.setup({
        key: "pk_live_9b66796f63600a703d0b0d707d5d766b8179ed42",
        email: form.email,
        amount: Math.round(total * 100),
        currency: "GHS",
        callback: function (transaction: any) {
          submitOrderToLocalStorage(transaction);
        },
        onClose: function () {},
      });

      handler.openIframe();
    } catch (err) {
      console.error("EXACT ERROR:", err);
      alert("Payment system failed to load. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center shadow-xl w-[320px] max-w-[90vw]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#9AE600] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-700">
              Confirming your order...
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Please don't close this page
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto rounded-[2rem] bg-white shadow-[0_18px_70px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="border-b bg-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-400 mt-1">
              Review your order and complete payment securely.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 text-[#9AE600]" />
            Secure payment powered by Paystack
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_380px] gap-6 p-5 sm:p-6">
          <div className="min-w-0 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Delivery details
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Add your delivery information so we can complete your order.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#9AE600] transition"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  <input
                    placeholder="Delivery address"
                    className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#9AE600] transition"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Region"
                      className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#9AE600] transition"
                      value={form.state}
                      onChange={(e) => update("state", e.target.value)}
                    />
                    <input
                      placeholder="City"
                      className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#9AE600] transition"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#f3f9dc] flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-[#6d9300]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Choose how to pay
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Paystack is selected for this checkout.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#dff0b8] bg-[#fbfef2] p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Paystack</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Fast, secure card payment.
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-[#9AE600] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#9AE600]" />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-100 p-4 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#9AE600] shrink-0" />
                  <p className="text-sm text-gray-500">
                    Your payment is handled securely through Paystack.
                  </p>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Check your product before checkout
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Ensure every detail is correct before completing your purchase.
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-[#9AE600]" />
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="p-2 sm:p-4">
                {items.length === 0 ? (
                  <div className="py-14 text-center text-gray-500">
                    Your cart is empty.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex items-center gap-4"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex-none">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="block w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            ₵{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#f3f9dc] flex items-center justify-center shrink-0">
                  <TicketPercent className="h-5 w-5 text-[#6d9300]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Discount code
                  </h3>
                  <p className="text-sm text-gray-400">
                    Add a code if you have one.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {showDiscount ? (
                  <div className="flex gap-2">
                    <input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#9AE600] transition"
                    />
                    <button className="px-4 py-3 rounded-xl bg-[#9AE600] text-gray-900 font-bold text-sm">
                      Apply
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDiscount(true)}
                    className="w-full rounded-xl border border-dashed border-gray-200 py-3 text-sm text-gray-500 hover:border-[#9AE600] hover:text-gray-700 transition"
                  >
                    Add discount code
                  </button>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">
                    You will be informed when delivery is scheduled
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (1.5%)</span>
                  <span>₵{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₵{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || items.length === 0}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-gray-900 disabled:opacity-60 transition hover:opacity-90"
                style={{ backgroundColor: "#9AE600" }}
              >
                <Lock className="h-4 w-4" />
                Pay ₵{total.toFixed(2)}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4 text-[#9AE600]" />
                Secure payment powered by Paystack
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}