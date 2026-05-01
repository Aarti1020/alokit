"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { GlobalSearchPayload, searchApi } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<GlobalSearchPayload>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    searchApi.search(q)
      .then((res) => setResults(res.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q]);

  const products = results.products || [];
  const blogs = results.blogs || [];
  const collections = results.collections || [];
  const total = products.length + blogs.length + collections.length;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-white py-14 text-center">
        <SearchIcon className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-amber-100 mb-2">Search Results</h1>
        {q && <p className="text-amber-400 font-jost">for &quot;<span className="font-semibold">{q}</span>&quot;</p>}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-700" /></div>
        ) : !q ? (
          <div className="text-center py-20 text-stone-400">
            <p className="font-jost">Enter a search term to find products, blogs and collections.</p>
          </div>
        ) : total === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-cinzel text-xl text-stone-700 mb-2">No results found</p>
            <p className="font-jost text-stone-500 mb-6">Try a different keyword or browse our shop</p>
            <Link href="/products" className="bg-amber-800 text-white font-jost font-semibold px-8 py-3 rounded-xl">Browse All Products</Link>
          </div>
        ) : (
          <div className="space-y-12">
            {products.length > 0 && (
              <section>
                <h2 className="font-cinzel text-2xl font-bold text-stone-800 mb-5">Products ({products.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {products.length >= 10 && (
                  <Link href={`/products?search=${encodeURIComponent(q)}`} className="mt-4 inline-flex text-amber-700 font-jost text-sm font-medium hover:underline">
                    View all product results →
                  </Link>
                )}
              </section>
            )}

            {collections.length > 0 && (
              <section>
                <h2 className="font-cinzel text-2xl font-bold text-stone-800 mb-5">Collections ({collections.length})</h2>
                <div className="flex flex-wrap gap-4">
                  {collections.map((col) => (
                    <Link key={col._id} href={`/collections/${col.slug}`}
                      className="bg-white border border-amber-100 hover:border-amber-400 rounded-2xl px-5 py-4 font-jost font-semibold text-stone-700 hover:text-amber-800 transition-all shadow-sm">
                      ✨ {col.title}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {blogs.length > 0 && (
              <section>
                <h2 className="font-cinzel text-2xl font-bold text-stone-800 mb-5">Articles ({blogs.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {blogs.map((blog) => (
                    <Link key={blog._id} href={`/blog/${blog.slug}`}
                      className="group bg-white rounded-2xl border border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all p-5">
                      {blog.category && <span className="text-xs text-amber-600 font-jost uppercase tracking-wider">{blog.category}</span>}
                      <h3 className="font-cinzel text-stone-800 font-semibold mt-2 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {blog.title}
                      </h3>
                      {blog.excerpt && <p className="text-stone-500 text-sm font-jost line-clamp-2 leading-relaxed">{blog.excerpt}</p>}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-800" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
