"use client";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authApi.forgotPassword(email);
      setSuccess("If your email exists, a reset link has been sent.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-cinzel text-2xl font-bold text-amber-800 block mb-2">ALOKIT</Link>
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-stone-800">Forgot Password</h1>
          <p className="text-stone-500 font-jost text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-jost rounded-xl px-4 py-3 mb-5">{error}</div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-jost rounded-xl px-4 py-3 mb-5">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300 text-white font-jost font-semibold py-3.5 rounded-xl transition-colors mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center font-jost text-sm text-stone-500 mt-6">
          Remembered your password?{" "}
          <Link href="/auth/login" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
