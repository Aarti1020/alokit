"use client";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { user } = useAuth();
  const { products } = useWishlist();

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50">
      <Heart className="w-16 h-16 text-amber-200" />
      <h2 className="font-cinzel text-2xl font-bold text-stone-800">Please Login</h2>
      <p className="font-jost text-stone-500">Login to view your wishlist</p>
      <Link href="/auth/login?redirect=/wishlist" className="bg-amber-800 text-white font-jost font-semibold px-8 py-3 rounded-xl">Login</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-cinzel text-3xl font-bold text-stone-800">My Wishlist</h1>
          <span className="text-stone-500 font-jost text-sm">{products.length} items</span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Heart className="w-16 h-16 text-amber-200" />
            <h2 className="font-cinzel text-xl font-bold text-stone-700">Your Wishlist is Empty</h2>
            <p className="text-stone-500 font-jost">Save products you love and find them here later.</p>
            <Link href="/products" className="flex items-center gap-2 bg-amber-800 text-white font-jost font-semibold px-8 py-3 rounded-xl">
              <ShoppingBag className="w-4 h-4" /> Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
