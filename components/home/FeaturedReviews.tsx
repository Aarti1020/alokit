"use client";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { reviewApi } from "@/lib/api";
import { Review } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-7 h-7 flex items-center justify-center rounded-sm ${
            i <= rating ? "bg-[#3a7c2f]" : "bg-stone-200"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function OverallStarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-8 h-8 flex items-center justify-center rounded-sm ${
            i <= Math.round(rating) ? "bg-[#3a7c2f]" : "bg-stone-200"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const visibleCount = 3;

  useEffect(() => {
    reviewApi.featured(12).then((res) => setReviews(res.data || [])).catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const canPrev = current > 0;
  const canNext = current + visibleCount < reviews.length;

  const prev = () => canPrev && setCurrent((c) => c - 1);
  const next = () => canNext && setCurrent((c) => c + 1);

  const visible = reviews.slice(current, current + visibleCount);

  return (
    <section className="py-16 bg-[#f9f6f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="font-cinzel text-2xl font-bold text-stone-800 mb-2">
            Let customers speak for us
          </h2>
          <OverallStarRating rating={avgRating} />
          <p className="text-stone-500 font-jost text-sm mt-1">
            from {reviews.length} reviews
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center gap-4">

          {/* Prev Arrow */}
          <button
            onClick={prev}
            className={`shrink-0 w-8 h-8 flex items-center justify-center transition-colors ${
              canPrev ? "text-stone-400 hover:text-stone-700" : "text-stone-200 cursor-default"
            }`}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <StarRating rating={review.rating} />
                  {review.title && (
                    <h4 className="font-jost font-bold text-stone-800 text-sm mb-1">
                      {review.title}
                    </h4>
                  )}
                  <p className="font-jost text-stone-500 text-sm leading-relaxed line-clamp-3">
                    {review.comment}
                  </p>
                </div>
                <p className="font-jost font-bold text-stone-800 text-sm mt-6">
                  {review.name}
                </p>
              </div>
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={next}
            className={`shrink-0 w-8 h-8 flex items-center justify-center transition-colors ${
              canNext ? "text-stone-400 hover:text-stone-700" : "text-stone-200 cursor-default"
            }`}
          >
            <ChevronRight size={22} />
          </button>

        </div>
      </div>
    </section>
  );
}