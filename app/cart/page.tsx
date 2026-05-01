"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50">
      <ShoppingBag className="w-16 h-16 text-amber-300" />
      <h2 className="font-cinzel text-2xl font-bold text-stone-800">Please Login</h2>
      <p className="font-jost text-stone-500">Login to view your cart</p>
      <Link href="/auth/login?redirect=/cart" className="bg-amber-800 text-white font-jost font-semibold px-8 py-3 rounded-xl">Login</Link>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-amber-800" />
    </div>
  );

  const items = cart?.items || [];

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50">
      <ShoppingBag className="w-16 h-16 text-amber-200" />
      <h2 className="font-cinzel text-2xl font-bold text-stone-800">Your Cart is Empty</h2>
      <p className="font-jost text-stone-500">Discover our sacred collection</p>
      <Link href="/products" className="flex items-center gap-2 bg-amber-800 text-white font-jost font-semibold px-8 py-3 rounded-xl">
        Shop Now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );

  const subtotal = cart?.totals?.subtotal ?? cart?.pricing?.subtotal ?? total;
  const freeShippingThreshold = 2999;
  const shippingFee = cart?.totals?.shippingCharge ?? cart?.pricing?.shippingCharge ?? (subtotal >= freeShippingThreshold ? 0 : 199);
  const grandTotal = cart?.totals?.total ?? cart?.pricing?.total ?? subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-cinzel text-3xl font-bold text-stone-800">Shopping Cart</h1>
          <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-jost flex items-center gap-1 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const img = item.product?.primaryImage || item.product?.featuredImage || item.product?.thumbnail || "";
              const price = item.finalPrice || item.unitPrice;
              return (
                <div key={item._id} className="bg-white rounded-2xl border border-amber-100 p-5 flex gap-5">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-amber-50 shrink-0">
                    {img
                      ? <Image src={img} alt={item.product?.name || ""} fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🔮</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product?.slug}`} className="font-cinzel text-stone-800 font-semibold hover:text-amber-700 transition-colors block truncate">
                      {item.product?.name}
                    </Link>
                    {item.selectedVariant && (
                      <p className="text-xs text-stone-400 font-jost mt-0.5">
                        {(item.selectedVariant as { label: string; value: string }).label}: {(item.selectedVariant as { label: string; value: string }).value}
                      </p>
                    )}
                    <p className="text-amber-800 font-cinzel font-bold mt-1">₹{price.toLocaleString("en-IN")}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-amber-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateItem(item._id, Math.max(1, item.quantity - 1))} className="px-3 py-1.5 text-amber-800 hover:bg-amber-50 transition-colors">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1.5 font-jost font-semibold text-stone-800 border-x border-amber-200 text-sm">{item.quantity}</span>
                        <button onClick={() => updateItem(item._id, item.quantity + 1)} className="px-3 py-1.5 text-amber-800 hover:bg-amber-50 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-cinzel font-bold text-stone-800">₹{(price * item.quantity).toLocaleString("en-IN")}</span>
                        <button onClick={() => removeItem(item.product?._id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-amber-100 p-6 sticky top-24">
              <h2 className="font-cinzel text-xl font-bold text-stone-800 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 text-sm font-jost">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                  </span>
                </div>
                {subtotal < freeShippingThreshold && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    Add ₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")} more for free shipping!
                  </p>
                )}
                <div className="border-t border-amber-100 pt-3 flex justify-between font-bold text-stone-800">
                  <span className="font-cinzel">Total</span>
                  <span className="font-cinzel text-amber-800">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-jost font-semibold py-3.5 rounded-xl transition-colors"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <Link href="/products" className="block text-center mt-3 text-amber-700 hover:text-amber-900 font-jost text-sm transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
