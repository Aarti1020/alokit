"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { blogApi } from "@/lib/api";
import { Blog } from "@/types";

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    blogApi.featured().then((res) => setBlogs((res.data || []).slice(0, 3))).catch(() => {});
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-10 flex items-center justify-center">
  <div className="text-center">
    <p className="font-jost text-amber-600 tracking-widest text-xs uppercase mb-2">
      Knowledge & Wisdom
    </p>

    <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-stone-800">
      From Our Blog
    </h2>
  </div>

  <Link
    href="/blog"
    className="absolute right-0 hidden sm:flex items-center gap-1.5 text-amber-700 hover:text-amber-900 font-jost font-medium text-sm transition-colors"
  >
    All Articles <ArrowRight className="w-4 h-4" />
  </Link>
</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blog/${blog.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-amber-100">
              <div className="relative h-48 bg-amber-100">
                {blog.featuredImage ? (
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📖</div>
                )}
              </div>
              <div className="p-5">
                {blog.category && (
                  <span className="text-xs font-jost text-amber-600 uppercase tracking-wider font-medium">{blog.category}</span>
                )}
                <h3 className="font-cinzel text-stone-800 font-semibold mt-2 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="text-stone-500 text-sm font-jost line-clamp-2 leading-relaxed mb-3">{blog.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-xs text-stone-400 font-jost">
                  <span>{blog.authorName || "Alokit Team"}</span>
                  {blog.readTime && (
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime} min</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
