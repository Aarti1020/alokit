"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, AlertCircle, SlidersHorizontal } from "lucide-react";
import { collectionApi, ProductFilters, productApi } from "@/lib/api";
import { Collection, Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A–Z" },
];

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<ProductFilters["sort"]>("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!slug) return;
    collectionApi.get(slug)
      .then((res) => {
        setProductsLoading(true);
        setCollection(res.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug || !collection?._id) return;
    productApi.list({ collection: collection._id, sort, page, limit: 12 })
      .then((res) => {
        setProducts(res.data || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, [slug, collection?._id, sort, page]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-amber-800" />
    </div>
  );

  if (error || !collection) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <p className="font-cinzel text-xl text-stone-700">{error || "Collection not found"}</p>
      <Link href="/collections" className="bg-amber-800 text-white px-6 py-2.5 rounded-xl font-jost text-sm">Back to Collections</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-amber-950 to-stone-900 text-white py-20">
        {(collection.heroImage || collection.thumbnail) && (
          <Image
            src={collection.heroImage || collection.thumbnail || ""}
            alt={collection.title}
            fill
            className="object-cover opacity-20"
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {collection.productType && (
            <p className="font-jost text-amber-400 tracking-widest text-xs uppercase mb-3 capitalize">{collection.productType}</p>
          )}
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-amber-100 mb-4">{collection.title}</h1>
          {collection.shortDescription && (
            <p className="text-amber-300 font-jost text-lg max-w-2xl mx-auto leading-relaxed">{collection.shortDescription}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-stone-500 font-jost text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{products.length} products</span>
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setProductsLoading(true);
              setSort(e.target.value as ProductFilters["sort"]);
              setPage(1);
            }}
            className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-sm text-stone-700 font-jost outline-none focus:border-amber-400"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-amber-700" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-4xl mb-3">✨</p>
            <p className="font-cinzel text-xl">No products in this collection yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => {
                  setProductsLoading(true);
                  setPage((p) => Math.max(1, p - 1));
                }} disabled={page <= 1}
                  className="px-4 py-2 rounded-xl border border-amber-200 text-sm font-jost text-amber-800 hover:bg-amber-50 disabled:opacity-40">
                  Previous
                </button>
                <span className="px-4 py-2 font-jost text-sm text-stone-600">Page {page} of {totalPages}</span>
                <button onClick={() => {
                  setProductsLoading(true);
                  setPage((p) => Math.min(totalPages, p + 1));
                }} disabled={page >= totalPages}
                  className="px-4 py-2 rounded-xl border border-amber-200 text-sm font-jost text-amber-800 hover:bg-amber-50 disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Description */}
        {collection.description && (
          <div className="mt-16 bg-white rounded-2xl border border-amber-100 p-8">
            <h2 className="font-cinzel text-2xl font-bold text-stone-800 mb-4">About This Collection</h2>
            <div className="font-jost text-stone-600 leading-relaxed prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: collection.description }} />
          </div>
        )}
      </div>
    </div>
  );
}
