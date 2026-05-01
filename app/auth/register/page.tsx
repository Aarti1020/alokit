"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    try {
      await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password });
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-cinzel text-2xl font-bold text-amber-800 block mb-2">ALOKIT</Link>
          <h1 className="font-cinzel text-2xl font-bold text-stone-800">Create Account</h1>
          <p className="text-stone-500 font-jost text-sm mt-1">Join the sacred circle</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-jost rounded-xl px-4 py-3 mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "fullName", label: "Full Name", type: "text", placeholder: "Your full name", required: true },
            { key: "email", label: "Email", type: "email", placeholder: "your@email.com", required: true },
            { key: "phone", label: "Phone", type: "tel", placeholder: "10-digit mobile number", required: false },
          ].map(({ key, label, type, placeholder, required }) => (
            <div key={key}>
              <label className="block text-sm font-jost font-medium text-stone-700 mb-1">{label}{required && " *"}</label>
              <input
                type={type}
                required={required}
                value={form[key as keyof typeof form]}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/30"
              />
            </div>
          ))}

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

          <div>
            <label className="block text-sm font-jost font-medium text-stone-700 mb-1">Confirm Password *</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              placeholder="Repeat your password"
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-sm font-jost outline-none focus:border-amber-500 bg-amber-50/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300 text-white font-jost font-semibold py-3.5 rounded-xl transition-colors mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center font-jost text-sm text-stone-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-amber-700 hover:text-amber-900 font-medium transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
