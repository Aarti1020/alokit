"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowRight,
  Calendar,
  Sparkles,
  X,
} from "lucide-react";
import { blogApi } from "@/lib/api";
import { Blog } from "@/types";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setLoading(true);

    const params: Record<string, string | number> = {
      page,
      limit: 9,
    };

    if (search) params.search = search;

    blogApi
      .list(params)
      .then((res) => {
        setBlogs(res.data || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => {
        setBlogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-amber-50/40">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-amber-600">
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 md:py-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-amber-200">
            <Sparkles className="h-4 w-4" />
            <span className="font-jost text-xs font-semibold uppercase tracking-[0.25em]">
              Knowledge & Wisdom
            </span>
          </div>

          <h1 className="font-cinzel text-4xl font-bold tracking-wide text-white md:text-6xl">
            Sacred Blog
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-jost text-base leading-7 text-stone-300 md:text-lg">
            Vedic knowledge, gemstone guides, spiritual insights and buying
            tips curated by the Alokit team.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 bg-white/10 p-3 shadow-2xl backdrop-blur-md sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-200" />

              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles, gemstones, guides..."
                className="h-13 w-full rounded-2xl border border-white/10 bg-white py-3 pl-12 pr-4 font-jost text-sm text-white outline-none transition placeholder:text-stone-400 focus:border-amber-300/60 focus:ring-4 focus:ring-amber-300/10"
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-amber-600 px-7 py-3 font-jost text-sm font-semibold text-white shadow-lg shadow-amber-950/30 transition hover:bg-amber-500"
            >
              Search
            </button>
          </form>

          {search && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg- px-4 py-2 font-jost text-sm text-amber-100 transition hover:bg-amber-300/20"
              >
                Showing results for “{search}”
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Blog Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-jost text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              Articles
            </p>
            <h2 className="mt-2 font-cinzel text-3xl font-bold text-stone-900 md:text-4xl">
              Latest Insights
            </h2>
          </div>

          {!loading && blogs.length > 0 && (
            <p className="font-jost text-sm text-stone-500">
              Page {page} of {totalPages}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-amber-700" />
              <p className="font-jost text-sm text-stone-500">
                Loading articles...
              </p>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-[2rem] border border-amber-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl">
              📖
            </div>

            <h3 className="font-cinzel text-2xl font-bold text-stone-800">
              No articles found
            </h3>

            <p className="mt-3 font-jost text-sm leading-6 text-stone-500">
              We could not find any articles matching your search. Try another
              keyword or clear the search.
            </p>

            {search && (
              <button
                onClick={clearSearch}
                className="mt-6 rounded-full bg-amber-700 px-6 py-3 font-jost text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-amber-50">
                    {blog.featuredImage ? (
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 text-5xl">
                        📖
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent opacity-80" />

                    {blog.isFeatured && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1.5 font-jost text-xs font-bold text-white shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}

                    {blog.category && (
                      <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 font-jost text-xs font-semibold uppercase tracking-wider text-amber-700 backdrop-blur">
                        {blog.category}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="line-clamp-2 font-cinzel text-xl font-bold leading-snug text-stone-900 transition group-hover:text-amber-700">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="mt-3 line-clamp-3 font-jost text-sm leading-7 text-stone-500">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-amber-100 pt-4 font-jost text-xs text-stone-500">
                      <span className="font-medium text-stone-700">
                        {blog.authorName || "Alokit Team"}
                      </span>

                      {blog.readTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          {blog.readTime} min read
                        </span>
                      )}

                      {blog.publishedAt && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-amber-600" />
                          {new Date(blog.publishedAt).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 font-jost text-sm font-semibold text-amber-700 transition group-hover:gap-3">
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-white text-amber-800 shadow-sm transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="rounded-full border border-amber-100 bg-white px-5 py-2.5 font-jost text-sm font-medium text-stone-600 shadow-sm">
                  Page{" "}
                  <span className="font-semibold text-stone-900">{page}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-stone-900">
                    {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-white text-amber-800 shadow-sm transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}