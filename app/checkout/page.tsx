"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { CheckoutResponseData, orderApi, paymentApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Address } from "@/types";
import toast from "react-hot-toast";

const EMPTY_ADDRESS: Address = {
  fullName:"", email: "", phone:"",
  addressLine1:"", addressLine2:"",
  city:"", state:"", postalCode:"", country:"India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart, total } = useCart();
  const { user } = useAuth();
  const [shipping, setShipping] = useState<Address>({
    ...EMPTY_ADDRESS,
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billing, setBilling] = useState<Address>({ ...EMPTY_ADDRESS });
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const items = cart?.items || [];

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router, user]);

  if (!user || items.length === 0) return null;

  const subtotal = cart?.totals?.subtotal ?? cart?.pricing?.subtotal ?? total;
  const shippingFee = cart?.totals?.shippingCharge ?? cart?.pricing?.shippingCharge ?? (subtotal >= 2999 ? 0 : 199);
  const grandTotal = cart?.totals?.total ?? cart?.pricing?.total ?? subtotal + shippingFee;

  const setField = (setter: typeof setShipping, key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setter((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await orderApi.checkout({
        shippingAddress: shipping,
        billingAddress: sameAsBilling ? shipping : billing,
        paymentMethod: "razorpay",
        notes,
      });

      const checkout = res.data as CheckoutResponseData;

      // Mock payment for local dev
      if (checkout.paymentGatewayMode === "mock") {
        await paymentApi.verify({
          orderId: checkout.orderId,
          razorpay_order_id: checkout.razorpayOrderId,
          razorpay_payment_id: `mock_payment_${checkout.orderId}`,
          razorpay_signature: "mock_signature",
        });
        await refreshCart();
        toast.success("Order placed successfully!");
        router.push(`/account/orders`);
        return;
      }

      // Real Razorpay
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => {
        // @ts-expect-error Razorpay global
        const rzp = new window.Razorpay({
          key: checkout.razorpayKeyId,
          amount: Math.round(checkout.amount * 100),
          currency: checkout.currency,
          name: "Alokit",
          description: "Sacred Products",
          order_id: checkout.razorpayOrderId,
          prefill: { name: shipping.fullName, email: shipping.email, contact: shipping.phone },
          theme: { color: "#92400e" },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              await paymentApi.verify({
                orderId: checkout.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              await refreshCart();
              toast.success("Payment successful! Order confirmed.");
              router.push("/account/orders");
            } catch {
              toast.error("Payment verification failed. Contact support.");
            }
          },
        });
        rzp.open();
      };
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const AddressFields = ({ data, setter }: { data: Address; setter: typeof setShipping }) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { key: "fullName", label: "Full Name", type: "text", required: true, full: false },
        { key: "email", label: "Email", type: "email", required: true, full: false },
        { key: "phone", label: "Phone", type: "tel", required: true, full: false },
        { key: "addressLine1", label: "Address Line 1", type: "text", required: true, full: true },
        { key: "addressLine2", label: "Address Line 2", type: "text", required: false, full: true },
        { key: "city", label: "City", type: "text", required: true, full: false },
        { key: "state", label: "State", type: "text", required: true, full: false },
        { key: "postalCode", label: "Postal Code", type: "text", required: true, full: false },
        { key: "country", label: "Country", type: "text", required: true, full: false },
      ].map(({ key, label, type, required, full }) => (
        <div key={key} className={full ? "sm:col-span-2" : ""}>
          <label className="block text-sm font-jost font-medium text-stone-700 mb-1">{label}{required && " *"}</label>
          <input
            type={type}
            required={required}
            value={data[key as keyof Address]}
            onChange={setField(setter, key as keyof Address)}
            className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/50"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="flex items-center gap-2 text-stone-500 hover:text-amber-800 font-jost text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-cinzel text-3xl font-bold text-stone-800 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <div className="bg-white rounded-2xl border border-amber-100 p-6">
                <h2 className="font-cinzel text-lg font-bold text-stone-800 mb-5">Shipping Address</h2>
                <AddressFields data={shipping} setter={setShipping} />
              </div>

              {/* Billing toggle */}
              <div className="bg-white rounded-2xl border border-amber-100 p-6">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} className="accent-amber-700 w-4 h-4" />
                  <span className="font-jost text-stone-700 font-medium">Billing address same as shipping</span>
                </label>
                {!sameAsBilling && (
                  <>
                    <h3 className="font-cinzel text-base font-bold text-stone-800 mb-4">Billing Address</h3>
                    <AddressFields data={billing} setter={setBilling} />
                  </>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-amber-100 p-6">
                <h2 className="font-cinzel text-lg font-bold text-stone-800 mb-3">Order Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions for delivery..."
                  className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/50 resize-none"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-amber-100 p-6 sticky top-24">
                <h2 className="font-cinzel text-lg font-bold text-stone-800 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm font-jost">
                      <span className="text-stone-600 flex-1 truncate mr-2">{item.product?.name} × {item.quantity}</span>
                      <span className="text-stone-800 font-medium shrink-0">₹{(item.finalPrice * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-amber-100 pt-4 space-y-2 text-sm font-jost mb-5">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? "text-green-600" : ""}>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-amber-100">
                    <span className="font-cinzel">Total</span>
                    <span className="font-cinzel text-amber-800 text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300 text-white font-jost font-semibold py-4 rounded-xl transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? "Processing..." : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
                </button>

                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-400 font-jost">
                  <Shield className="w-3.5 h-3.5" /> Secured by Razorpay
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
