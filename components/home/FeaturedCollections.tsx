"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { collectionApi } from "@/lib/api";
import { Collection } from "@/types";

export default function FeaturedCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collectionApi.list({ featured: true, limit: 4 })
      .then((res) => setCollections(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && collections.length === 0) return null;

  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-jost text-amber-600 tracking-widest text-xs uppercase mb-2">Curated For You</p>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-stone-800">Sacred Collections</h2>
          </div>
          <Link href="/collections" className="hidden sm:flex items-center gap-1.5 text-amber-700 hover:text-amber-900 font-jost font-medium text-sm transition-colors">
            All Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-amber-700" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <Link
                key={col._id}
                href={`/collections/${col.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100"
              >
                <div className="relative h-48 bg-amber-100">
                  {col.thumbnail || col.heroImage ? (
                    <Image
                      src={col.thumbnail || col.heroImage || ""}
                      alt={col.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">✨</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-cinzel text-white font-bold text-lg leading-tight">{col.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  {col.shortDescription && (
                    <p className="text-stone-500 text-sm font-jost line-clamp-2 leading-relaxed">{col.shortDescription}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-amber-700 text-sm font-jost font-medium mt-3">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
