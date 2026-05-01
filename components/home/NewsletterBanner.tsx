"use client";
import { useState } from "react";
import { newsletterApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success("You're subscribed!");
      setEmail("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-amber-800">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-14 h-14 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Mail className="w-7 h-7 text-amber-200" />
        </div>
        <h2 className="font-cinzel text-3xl font-bold text-amber-100 mb-3">Join Our Sacred Circle</h2>
        <p className="text-amber-300 font-jost mb-8 leading-relaxed">
          Get Vedic insights, new arrivals, exclusive offers & personalised gemstone guidance in your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 bg-amber-700/60 border border-amber-600 text-amber-100 placeholder-amber-400 rounded-xl px-4 py-3 font-jost text-sm outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-100 hover:bg-white text-amber-900 font-jost font-semibold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
