"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from storage
  useEffect(() => {
    const stored = localStorage.getItem("amd-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  // Persist cart
  const persist = (data: CartItem[]) => {
    setItems(data);
    localStorage.setItem("amd-cart", JSON.stringify(data));
  };

  // Add item (merge if exists)
  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      const updated = existing
        ? prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...prev, { ...item, quantity: 1 }];

      localStorage.setItem("amd-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Remove item
  const removeItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("amd-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Update quantity directly
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeItem(id);

    setItems((prev) => {
      const updated = prev.map((i) =>
        i.id === id ? { ...i, quantity: qty } : i
      );

      localStorage.setItem("amd-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Increase quantity
  const increaseQty = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      );

      localStorage.setItem("amd-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Decrease quantity
  const decreaseQty = (id: string) => {
    setItems((prev) => {
      const updated = prev
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);

      localStorage.setItem("amd-cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("amd-cart");
  };

  // Total items
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Total price
  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        increaseQty,
        decreaseQty,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}