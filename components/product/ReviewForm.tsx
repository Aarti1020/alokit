"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { reviewApi } from "@/lib/api";

interface Props {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [form, setForm] = useState({ name: "", email: "", rating: 5, title: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string, val: string | number) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await reviewApi.submit({ product: productId, ...form });
      setSubmitted(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
      <p className="text-2xl mb-2">🙏</p>
      <p className="font-cinzel text-green-800 font-semibold">Thank You for Your Review!</p>
      <p className="text-sm text-green-600 font-jost mt-1">Your review is pending approval.</p>
    </div>
  );

  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-6">
      <h3 className="font-cinzel text-xl font-bold text-stone-800 mb-5">Write a Review</h3>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-jost rounded-xl px-4 py-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-jost font-medium text-stone-700 mb-2">Rating *</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((i) => (
              <button key={i} type="button" onClick={() => set("rating", i)}>
                <Star className={`w-7 h-7 transition-colors ${i <= form.rating ? "fill-amber-400 text-amber-400" : "text-stone-200 hover:text-amber-300"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Your name"
              className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50"
            />
          </div>
          <div>
            <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Review Title</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Summarise your experience"
            className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50"
          />
        </div>

        <div>
          <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Your Review *</label>
          <textarea
            required
            rows={4}
            value={form.comment}
            onChange={(e) => set("comment", e.target.value)}
            placeholder="Share your honest experience with this product..."
            className="w-full border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300 text-white font-jost font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
