"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Heart,
  User,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Star,
  Clock,
  ShieldCheck,
  MapPin,
  Bell,
} from "lucide-react";

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login?redirect=/account");
  }, [user, loading, router]);

  if (loading || !user) return null;

  const initials = user.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navLinks = [
    {
      icon: Package,
      label: "My Orders",
      desc: "Track & view order history",
      href: "/account/orders",
      stat: "3 Active",
      statColor: "text-sky-700 bg-sky-100 border-sky-200",
    },
    {
      icon: Heart,
      label: "Wishlist",
      desc: "Your saved favourites",
      href: "/wishlist",
      stat: "12 Items",
      statColor: "text-sky-700 bg-sky-100 border-sky-200",
    },
    {
      icon: User,
      label: "Edit Profile",
      desc: "Update personal details",
      href: "/account/edit",
      stat: null,
      statColor: "",
    },
    {
      icon: Bell,
      label: "Notifications",
      desc: "Manage alerts & updates",
      href: "/account/notifications",
      stat: "2 New",
      statColor: "text-sky-700 bg-sky-100 border-sky-200",
    },
    {
      icon: MapPin,
      label: "Addresses",
      desc: "Saved delivery addresses",
      href: "/account/addresses",
      stat: null,
      statColor: "",
    },
    {
      icon: ShieldCheck,
      label: "Security",
      desc: "Password & privacy settings",
      href: "/account/security",
      stat: null,
      statColor: "",
    },
  ];

  return (
    <div className="min-h-screen bg-sky-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-sky-600 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full">
            Dashboard
          </span>
          <h1 className="text-4xl font-bold text-sky-950 tracking-tight">
            My Account
          </h1>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

          {/* ══ LEFT COLUMN — Profile Card ══ */}
          <div className="flex flex-col gap-5">

            {/* Profile Hero */}
            <div className="relative bg-gradient-to-b from-sky-600 to-sky-800 rounded-3xl p-6 overflow-hidden text-center">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400 rounded-full opacity-20 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-sky-300 rounded-full opacity-15 blur-2xl pointer-events-none" />

              {/* Avatar */}
              <div className="relative inline-flex mx-auto mb-4">
                <div className="w-20 h-20 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl font-bold text-white leading-none">
                    {initials}
                  </span>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-sky-300 rounded-lg flex items-center justify-center shadow-md">
                  <Star size={11} className="text-sky-900 fill-sky-900" />
                </div>
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-white mb-1 leading-tight">
                {user.fullName}
              </h2>

              {/* Member tag */}
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-5">
                <Star size={9} className="text-sky-200 fill-sky-200" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-sky-100">
                  Gold Member
                </span>
              </div>

              {/* Meta info */}
              <div className="flex flex-col gap-2 text-left">
                <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-3 py-2">
                  <Mail size={13} className="text-sky-200 flex-shrink-0" />
                  <span className="text-sky-100 text-xs truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-3 py-2">
                    <Phone size={13} className="text-sky-200 flex-shrink-0" />
                    <span className="text-sky-100 text-xs">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-3 py-2">
                  <Clock size={13} className="text-sky-200 flex-shrink-0" />
                  <span className="text-sky-100 text-xs">Member since 2023</span>
                </div>
              </div>
            </div>

            {/* Verified badge card */}
            <div className="bg-white border border-sky-100 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-sky-950">Account Verified</p>
                <p className="text-xs text-sky-400 mt-0.5">Trusted buyer · All checks passed</p>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={logout}
              className="group w-full flex items-center justify-center gap-2 bg-white border border-sky-100 hover:border-red-200 hover:bg-red-50 text-sky-400 hover:text-red-500 rounded-2xl px-5 py-3.5 text-sm font-medium transition-all duration-200"
            >
              <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              Sign out
            </button>
          </div>

          {/* ══ RIGHT COLUMN — Nav Grid ══ */}
          <div className="flex flex-col gap-5">

            {/* Section label */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-sky-200" />
              <span className="text-[10px] font-semibold tracking-widest uppercase text-sky-400">
                Quick Access
              </span>
              <div className="flex-1 h-px bg-sky-200" />
            </div>

            {/* 2-column card grid */}
            <div className="grid grid-cols-2 gap-4">
              {navLinks.map(({ icon: Icon, label, desc, href, stat, statColor }) => (
                <Link
                  key={label}
                  href={href}
                  className="group relative bg-white border border-sky-100 hover:border-sky-400 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-200/60 block"
                >
                  {/* Stat pill */}
                  {stat && (
                    <div className={`absolute top-4 right-4 text-[10px] font-semibold tracking-wide border px-2 py-0.5 rounded-full ${statColor}`}>
                      {stat}
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-11 h-11 bg-sky-50 border border-sky-100 group-hover:bg-sky-100 group-hover:border-sky-300 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200">
                    <Icon size={18} className="text-sky-600" />
                  </div>

                  {/* Label + chevron */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-sky-950">
                      {label}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-sky-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0"
                    />
                  </div>

                  <p className="text-xs text-sky-400 leading-relaxed">
                    {desc}
                  </p>
                </Link>
              ))}
            </div>

            {/* Help footer */}
            <div className="mt-auto flex items-center justify-between bg-white border border-sky-100 rounded-2xl px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-sky-950">Need help?</p>
                <p className="text-xs text-sky-400 mt-0.5">Our support team is here for you</p>
              </div>
              <a
                href="/help"
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 border border-sky-200 hover:border-sky-400 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-all duration-200"
              >
                Contact us
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}