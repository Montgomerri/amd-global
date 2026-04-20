"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  Package,
  Loader2,
  CalendarDays,
  MapPin,
  BadgeCheck,
} from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type StoredOrder = {
  id: string;
  reference: string;
  items: OrderItem[];
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = () => {
      try {
        if (typeof window === "undefined") {
          setOrders([]);
          return;
        }

        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        if (!Array.isArray(parsed)) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const now = Date.now();

        const validOrders = parsed.filter((order: StoredOrder) => {
          const createdAt = Number(order?.createdAt || 0);
          return createdAt && now - createdAt < THIRTY_DAYS_MS;
        });

        if (validOrders.length !== parsed.length) {
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(validOrders));
        }

        validOrders.sort((a, b) => b.createdAt - a.createdAt);

        setOrders(validOrders);
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
      case "order_placed":
        return "bg-green-100 text-green-700";
      case "complete":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      case "payment_pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "order_placed":
        return "Order Placed";
      case "complete":
        return "Completed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      case "payment_pending":
        return "Payment Pending";
      default:
        return status || "Processing";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10">
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
            <p className="text-sm text-gray-400 mt-1">
              When you place an order, it will appear here.
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
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-GH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
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
                    <p className="text-xs text-gray-400 pl-15">
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
                        Delivered to {order.city || order.state || "Ghana"}
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Saved locally for 30 days
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