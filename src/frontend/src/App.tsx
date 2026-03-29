import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import Storefront from "./components/Storefront";
import type { Product } from "./types";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Page = "store" | "admin";

export default function App() {
  const [page, setPage] = useState<Page>("store");
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
      );
    }
  };

  const clearCart = () => setCart([]);

  return (
    <>
      {page === "store" && (
        <Storefront
          cart={cart}
          onAddToCart={addToCart}
          onUpdateCartItem={updateCartItem}
          onClearCart={clearCart}
          onNavigateAdmin={() => setPage("admin")}
        />
      )}
      {page === "admin" && (
        <AdminPanel onNavigateStore={() => setPage("store")} />
      )}
      <Toaster richColors position="top-right" />
    </>
  );
}
