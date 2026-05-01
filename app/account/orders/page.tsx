"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { orderApi } from "@/lib/api";
import { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Package, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  created: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login?redirect=/account/orders");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    orderApi.myOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-800" /></div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-cinzel text-3xl font-bold text-stone-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-amber-200 mx-auto mb-4" />
            <h2 className="font-cinzel text-xl font-bold text-stone-700 mb-2">No Orders Yet</h2>
            <p className="text-stone-500 font-jost mb-6">Start shopping and your orders will appear here.</p>
            <Link href="/products" className="bg-amber-800 text-white font-jost font-semibold px-8 py-3 rounded-xl">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-amber-100 p-6 hover:border-amber-300 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-cinzel font-bold text-stone-800 text-lg">#{order.orderNumber}</p>
                    <p className="text-stone-400 font-jost text-xs mt-0.5">{new Date(order.placedAt || order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-jost font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                      {order.orderStatus}
                    </span>
                    <span className={`text-xs font-jost font-semibold px-2.5 py-1 rounded-full capitalize ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item._id} className="flex items-center gap-3 text-sm font-jost">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-lg shrink-0">🔮</div>
                      <span className="text-stone-700 flex-1 truncate">{item.productName} × {item.quantity}</span>
                      <span className="text-stone-800 font-medium">₹{item.lineTotal.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-stone-400 font-jost pl-13">+{order.items.length - 2} more items</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-50">
                  <div>
                    <span className="text-sm text-stone-500 font-jost">Total: </span>
                    <span className="font-cinzel font-bold text-amber-800">₹{order.pricing.total.toLocaleString("en-IN")}</span>
                  </div>
                  <Link href={`/account/orders/${order._id}`} className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-jost text-sm font-medium transition-colors">
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
