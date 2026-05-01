"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api";
import { Category } from "@/types";

const FALLBACK = [
  { _id: "gemstone", name: "Gemstones", slug: "gemstone", emoji: "💎", href: "/products?productType=gemstone" },
  { _id: "rudraksha", name: "Rudraksha", slug: "rudraksha", emoji: "🔮", href: "/products?productType=rudraksha" },
  { _id: "bracelet", name: "Bracelets", slug: "bracelet", emoji: "📿", href: "/products?productType=bracelet" },
  { _id: "jewellery", name: "Jewellery", slug: "jewellery", emoji: "💍", href: "/products?productType=jewellery" },
  { _id: "crystal", name: "Crystals", slug: "crystal", emoji: "✨", href: "/products?productType=crystal" },
];

const EMOJIS: Record<string, string> = {
  gemstone: "💎", rudraksha: "🔮", bracelet: "📿", jewellery: "💍", crystal: "✨",
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoryApi.list()
      .then((res) => { if (res.data?.length) setCategories(res.data); })
      .catch(() => {});
  }, []);

  const items = categories.length
    ? categories.map((c) => ({
        _id: c._id,
        name: c.name,
        slug: c.slug,
        emoji: EMOJIS[c.slug] || "🌟",
        href: `/products?category=${c._id}`,
      }))
    : FALLBACK;

  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="font-jost text-amber-600 tracking-widest text-xs uppercase mb-2">Browse by Category</p>
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-stone-800">Sacred Collections</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {items.map((cat) => (
            <Link
              key={cat._id}
              href={cat.href}
              className="bg-white border border-amber-100 hover:border-amber-400 rounded-2xl p-6 text-center group transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</div>
              <h3 className="font-cinzel text-stone-800 font-semibold text-sm group-hover:text-amber-700 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
