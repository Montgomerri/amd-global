"use client";

import { useEffect, useState } from "react";
import swell from "@/lib/swell";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Package, ChevronRight, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const account = await swell.account.get();
        if (!account) {
          window.location.href = "/auth";
          return;
        }
        const res = await swell.account.listOrders({ limit: 20 });
        setOrders(res?.results || []);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "complete": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-600";
      case "payment_pending": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
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

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl p-6 text-center text-sm">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">When you place an order, it will appear here.</p>
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

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                {/* Order Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Order #{order.number || order.id?.slice(-6)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.date_created ? new Date(order.date_created).toLocaleDateString("en-GH", {
                        year: "numeric", month: "long", day: "numeric"
                      }) : "Date unavailable"}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items?.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                        {item.product?.images?.[0]?.file?.url ? (
                          <img src={item.product.images[0].file.url} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.product_name || "Product"}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">₵{((item.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-xs text-gray-400 pl-15">+{order.items.length - 3} more items</p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Total paid</p>
                    <p className="text-base font-black text-gray-900">₵{(order.grand_total || order.sub_total || 0).toFixed(2)}</p>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    {order.shipping?.address1 && (
                      <>Delivered to {order.shipping.city || "Ghana"}</>
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