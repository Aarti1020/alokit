"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { collectionApi } from "@/lib/api";
import { Collection } from "@/types";

const TYPE_FILTERS = [
  { id: "", label: "All" },
  { id: "gemstone", label: "Gemstones" },
  { id: "rudraksha", label: "Rudraksha" },
  { id: "bracelet", label: "Bracelets" },
  { id: "jewellery", label: "Jewellery" },
  { id: "crystal", label: "Crystals" },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeType) params.productType = activeType;
    collectionApi.list(params)
      .then((res) => setCollections(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeType]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-white py-14 text-center">
        <p className="font-jost text-amber-500 tracking-widest text-xs uppercase mb-2">Curated for You</p>
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-amber-100 mb-2">Sacred Collections</h1>
        <p className="text-amber-400 font-jost text-sm">Thoughtfully curated sets for every purpose</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setLoading(true);
                setActiveType(t.id);
              }}
              className={`px-4 py-2 rounded-full text-sm font-jost font-medium transition-all ${
                activeType === t.id
                  ? "bg-amber-800 text-white shadow"
                  : "bg-white text-stone-600 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-amber-700" /></div>
        ) : collections.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-4xl mb-3">✨</p>
            <p className="font-cinzel text-xl">No collections found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <Link
                key={col._id}
                href={`/collections/${col.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="relative h-56 bg-amber-50">
                  {col.heroImage || col.thumbnail ? (
                    <Image
                      src={col.heroImage || col.thumbnail || ""}
                      alt={col.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">✨</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-cinzel text-white font-bold text-xl leading-tight">{col.title}</h3>
                    {col.productType && (
                      <span className="text-xs text-amber-300 font-jost capitalize">{col.productType}</span>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  {col.shortDescription && (
                    <p className="text-stone-500 text-sm font-jost line-clamp-2 leading-relaxed mb-3">{col.shortDescription}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-amber-700 text-sm font-jost font-semibold group-hover:gap-2 transition-all">
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
