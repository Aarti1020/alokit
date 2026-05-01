"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      router.push(redirect);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-cinzel text-2xl font-bold text-amber-800 block mb-2">ALOKIT</Link>
          <h1 className="font-cinzel text-2xl font-bold text-stone-800">Welcome Back</h1>
          <p className="text-stone-500 font-jost text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-jost rounded-xl px-4 py-3 mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="your@email.com"
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/30"
            />
          </div>

          <div>
            <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={set("password")}
                placeholder="Min 6 characters"
                className="w-full border border-amber-200 rounded-xl px-4 py-3 pr-12 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/30"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-xs font-jost text-amber-700 hover:text-amber-900 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300 text-white font-jost font-semibold py-3.5 rounded-xl transition-colors mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center font-jost text-sm text-stone-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-800" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
