"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  Package,
  Loader2,
  CalendarDays,
  MapPin,
  BadgeCheck,
  Search,
} from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  reference: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
  email: string;
  address: string;
  state: string;
  city: string;
  payment_method: string;
};

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!email) return alert("Please enter your email");

    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const res = await fetch(`/api/get-orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
        setSearched(true);
      } else {
        setError(data.error || "Failed to load orders.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "order_placed": return "bg-green-100 text-green-700";
      case "complete": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-600";
      case "payment_pending": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "order_placed": return "Order Placed";
      case "complete": return "Completed";
      case "pending": return "Pending";
      case "cancelled": return "Cancelled";
      case "payment_pending": return "Payment Pending";
      default: return status || "Processing";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track and view all your past orders</p>
          </div>
        </div>

        {/* Email Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Enter the email you used at checkout
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#9AE600] transition"
            />
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-gray-900 disabled:opacity-60 transition hover:opacity-90"
              style={{ backgroundColor: "#9AE600" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl p-6 text-center text-sm mb-4">
            {error}
          </div>
        )}

        {/* No orders found */}
        {searched && !loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">
              No orders found for <span className="font-semibold">{email}</span>
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-gray-900 hover:opacity-90 transition"
              style={{ backgroundColor: "#9AE600" }}
            >
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Order #{order.reference || order.id?.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("en-GH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items?.slice(0, 3).map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.name || "Product"}
                        </p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ₵{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {order.items?.length > 3 && (
                    <p className="text-xs text-gray-400">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Total paid</p>
                    <p className="text-base font-black text-gray-900">
                      ₵{(order.total || order.subtotal || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    {order.city || order.address ? (
                      <>
                        <MapPin className="h-3.5 w-3.5" />
                        {order.city || order.state || "Ghana"}
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Order confirmed
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}