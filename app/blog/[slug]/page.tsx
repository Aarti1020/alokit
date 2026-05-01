"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  AlertCircle,
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Share2,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { blogApi } from "@/lib/api";
import { Blog } from "@/types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!slug) return;
    blogApi
      .get(slug)
      .then((res) => {
        setBlog(res.data);
        blogApi
          .related(slug)
          .then((r) => setRelated(r.data?.slice(0, 3) || []))
          .catch(() => {});
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
          <p className="text-sm text-stone-400 font-medium tracking-wide">
            Loading article…
          </p>
        </motion.div>
      </div>
    );

  if (error || !blog)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-stone-700 text-lg font-medium">
            {error || "Article not found"}
          </p>
          <Link
            href="/blog"
            className="mt-2 inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 bg-amber-500 z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Breadcrumb */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-stone-100"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-stone-400">
            <Link
              href="/"
              className="hover:text-amber-700 transition-colors duration-150"
            >
              Home
            </Link>
            <span className="text-stone-200">/</span>
            <Link
              href="/blog"
              className="hover:text-amber-700 transition-colors duration-150"
            >
              Blog
            </Link>
            <span className="text-stone-200">/</span>
            <span className="text-stone-600 truncate max-w-[200px] sm:max-w-xs">
              {blog.title}
            </span>
          </nav>
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-700 transition-colors duration-150"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Article Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {blog.category && (
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3.5 py-1.5 rounded-full mb-5"
            >
              <BookOpen className="w-3 h-3" />
              {blog.category}
            </motion.span>
          )}

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight tracking-tight mb-5"
          >
            {blog.title}
          </motion.h1>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-400"
          >
            <span className="font-semibold text-stone-700 text-base">
              {blog.authorName || "Alokit Team"}
            </span>
            {blog.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {blog.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {blog.readTime} min read
              </span>
            )}
          </motion.div>
        </motion.div>

        {/* Featured Image */}
        {blog.featuredImage && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="relative h-64 md:h-[420px] rounded-2xl overflow-hidden mb-10 shadow-xl shadow-stone-200/60"
          >
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-stone-100 shadow-sm shadow-stone-100 overflow-hidden"
        >
          <div className="px-6 sm:px-10 py-8 sm:py-10">
            {blog.excerpt && (
              <motion.p
                variants={fadeUp}
                custom={0}
                className="text-lg md:text-xl text-stone-600 leading-relaxed border-l-[3px] border-amber-400 pl-5 mb-8 italic font-light"
              >
                {blog.excerpt}
              </motion.p>
            )}

            {blog.content ? (
              <motion.div
                variants={fadeUp}
                custom={1}
                className="prose prose-stone prose-base md:prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-stone-900 prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-stone-600 prose-p:leading-relaxed
                  prose-a:text-amber-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-stone-800 prose-strong:font-semibold
                  prose-img:rounded-xl prose-img:shadow-md
                  prose-blockquote:border-l-amber-400 prose-blockquote:text-stone-500 prose-blockquote:not-italic
                  prose-code:text-amber-800 prose-code:bg-amber-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
                  prose-hr:border-stone-100"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <motion.div
                variants={fadeUp}
                custom={1}
                className="text-center py-16"
              >
                <BookOpen className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                <p className="text-stone-400 text-sm">Content not available.</p>
              </motion.div>
            )}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <motion.div
              variants={fadeUp}
              custom={2}
              className="px-6 sm:px-10 py-5 border-t border-stone-100 flex flex-wrap gap-2"
            >
              {blog.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                  className="bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 text-stone-500 hover:text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Footer Nav */}
          <div className="px-6 sm:px-10 py-5 border-t border-stone-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-amber-700 transition-colors duration-200 group"
            >
              <motion.span
                className="inline-flex"
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.span>
              All Articles
            </Link>
            <button
              onClick={() =>
                navigator.clipboard?.writeText(window.location.href)
              }
              className="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-amber-700 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share article
            </button>
          </div>
        </motion.div>

        {/* Related Articles */}
        <AnimatePresence>
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-stone-800">
                  Related Articles
                </h2>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {related.map((b, i) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      href={`/blog/${b.slug}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300"
                    >
                      <div className="relative h-40 bg-stone-50 overflow-hidden">
                        {b.featuredImage ? (
                          <Image
                            src={b.featuredImage}
                            alt={b.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100">
                            <BookOpen className="w-8 h-8 text-amber-200" />
                          </div>
                        )}
                        {b.category && (
                          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest bg-white/90 backdrop-blur-sm text-amber-700 px-2.5 py-1 rounded-full">
                            {b.category}
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-sm font-semibold text-stone-800 group-hover:text-amber-800 transition-colors duration-200 line-clamp-2 leading-snug mb-3 flex-1">
                          {b.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 group-hover:gap-2 transition-all duration-200">
                          Read more
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}