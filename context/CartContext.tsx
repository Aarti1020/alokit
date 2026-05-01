"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { cartApi } from "@/lib/api";
import { Cart } from "@/types";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  total: number;
  addToCart: (productId: string, quantity?: number, variant?: { label: string; value: string }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    try {
      setLoading(true);
      const res = await cartApi.get();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1, variant?: { label: string; value: string }) => {
    if (!user) { toast.error("Please login to add items to cart"); return; }
    try {
      const res = await cartApi.add(productId, quantity, variant);
      setCart(res.data);
      toast.success("Added to cart!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to add to cart");
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      const res = await cartApi.updateItem(itemId, quantity);
      setCart(res.data);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update cart");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await cartApi.removeItem(productId);
      setCart(res.data);
      toast.success("Item removed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to clear cart");
    }
  };

  const itemCount =
    cart?.totals?.itemCount ??
    cart?.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ??
    0;
  const total = cart?.totals?.total ?? cart?.pricing?.total ?? 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, total, addToCart, updateItem, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
