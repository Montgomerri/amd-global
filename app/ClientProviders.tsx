"use client";
import { CartProvider } from "@/lib/cartContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}