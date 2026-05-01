"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { pageApi } from "@/lib/api";
import type { CmsPage as CmsPageData } from "@/lib/api";

export default function CmsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    pageApi.get(slug)
      .then((res) => setPage(res.data))
      .catch((error: unknown) =>
        setError(error instanceof Error ? error.message : "Failed to load page")
      )
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
    </div>
  );

  if (error || !page) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="font-cinzel text-xl text-stone-700">{error || "Page not found"}</p>
      <Link href="/" className="bg-amber-800 text-white px-6 py-2.5 rounded-xl font-jost text-sm">Back to Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-white py-14 text-center">
        <h1 className="font-cinzel text-4xl font-bold text-amber-100">{page.title}</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {page.content ? (
          <div
            className="prose prose-stone prose-lg max-w-none font-jost
              prose-headings:font-cinzel prose-headings:text-stone-800
              prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p className="text-center text-stone-400 font-jost py-10">Content coming soon.</p>
        )}
      </div>
    </div>
  );
}
