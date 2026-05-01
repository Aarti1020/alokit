"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { wishlistApi } from "@/lib/api";
import { Product } from "@/types";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface WishlistContextType {
  wishlistIds: Set<string>;
  toggle: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  products: Product[];
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setProducts([]);
        setWishlistIds(new Set());
      });
      return;
    }

    wishlistApi.get()
      .then((res) => {
        const prods = res.data?.items?.map((item) => item.product) ?? [];
        setProducts(prods);
        setWishlistIds(new Set(prods.map((p: Product) => p._id)));
      })
      .catch(() => {});
  }, [user]);

  const toggle = async (productId: string) => {
    if (!user) { toast.error("Please login first"); return; }
    try {
      if (wishlistIds.has(productId)) {
        const res = await wishlistApi.remove(productId);
        const prods = res.data?.items?.map((item) => item.product) ?? [];
        setProducts(prods);
        setWishlistIds(new Set(prods.map((p: Product) => p._id)));
        toast.success("Removed from wishlist");
      } else {
        const res = await wishlistApi.add(productId);
        const prods = res.data?.items?.map((item) => item.product) ?? [];
        setProducts(prods);
        setWishlistIds(new Set(prods.map((p: Product) => p._id)));
        toast.success("Added to wishlist");
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, isWishlisted, products }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
