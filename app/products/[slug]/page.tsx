"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { productApi, reviewApi } from "@/lib/api";
import { Product, Review, ReviewSummary } from "@/types";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/product/ProductCard";

const isImageUrl = (value: string | undefined | null): value is string =>
  Boolean(value && value.trim());

const normalizeUrl = (url: string) => {
  return url
    .split("?")[0]
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/backend-proxy/i, "")
    .replace(/^\/api/i, "")
    .replace(/\/variants\/(original|productDetail|thumbnail|medium|small)/i, "")
    .replace(/\/+/g, "/")
    .toLowerCase()
    .trim();
};

const getUniqueImages = (imageUrls: string[]) => {
  const uniqueMap = new Map<string, string>();

  imageUrls.forEach((url) => {
    const cleanUrl = url.trim();

    if (!cleanUrl) return;

    const key = normalizeUrl(cleanUrl);

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, cleanUrl);
    }
  });

  return Array.from(uniqueMap.values());
};

type ReviewWithUser = Review & {
  userName?: string;
  user?: {
    fullName?: string;
    name?: string;
    email?: string;
  };
};

const getReviewerName = (review: Review) => {
  const reviewData = review as ReviewWithUser;

  return (
    reviewData.userName ||
    reviewData.user?.fullName ||
    reviewData.user?.name ||
    reviewData.user?.email ||
    "Customer"
  );
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<
    { label: string; value: string } | undefined
  >();
  const [activeTab, setActiveTab] = useState<
    "description" | "short-description" | "specs" | "reviews"
  >("description");

  useEffect(() => {
    if (!slug) return;

    productApi
      .get(slug)
      .then((res) => {
        const p = res.data;

        setProduct(p);
        setActiveImage(0);

        productApi
          .related(slug)
          .then((r) => setRelated(r.data?.slice(0, 4) || []))
          .catch(() => {});

        reviewApi
          .forProduct(p._id)
          .then((r) => {
            setReviews(r.data || []);
            setSummary(r.summary || null);
          })
          .catch(() => {});
      })
      .catch((e) => setError(e.message || "Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const images = useMemo(() => {
  if (!product) return [];

  const productImages = getUniqueImages(
    (product.images || [])
      .map(
        (image) =>
          image?.variants?.productDetail ||
          image?.variants?.original ||
          image?.url
      )
      .filter(isImageUrl)
  );

  if (productImages.length > 0) {
    return productImages;
  }

  return getUniqueImages(
    [
      product.primaryImageData?.variants?.productDetail ||
        product.primaryImageData?.variants?.original ||
        product.primaryImageData?.url ||
        product.primaryImage,

      ...(product.galleryImages || []),

      product.featuredImage,
      product.thumbnail,
    ].filter(isImageUrl)
  );
}, [product]);

const safeActiveImage =
  images.length > 0 && activeImage < images.length ? activeImage : 0;

// const activeImageSrc = images[safeActiveImage] || "";

 

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-800" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center text-red-600">
        <AlertCircle className="h-12 w-12" />

        <p className="font-jost text-lg sm:text-xl">
          {error || "Product not found"}
        </p>

        <Link
          href="/products"
          className="rounded-xl bg-amber-800 px-6 py-2.5 font-jost text-sm text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const effectivePrice =
    product.effectivePrice ??
    (product.salePrice > 0 ? product.salePrice : product.basePrice);

  const activeImageSrc = images[activeImage] || "";

  const handleAddToCart = async () => {
    await addToCart(product._id, qty, selectedVariant);
  };

  const specs = product.specifications as Record<string, string> | undefined;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="border-b border-amber-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 font-jost text-xs text-stone-400 sm:px-6 sm:text-sm lg:px-8">
          <Link
            href="/"
            className="whitespace-nowrap transition-colors hover:text-amber-700"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/products"
            className="whitespace-nowrap transition-colors hover:text-amber-700"
          >
            Shop
          </Link>

          <span>/</span>

          <span className="max-w-[160px] truncate text-stone-700 sm:max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div
              className="relative mb-3 w-full overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 sm:mb-4"
              style={{ height: "clamp(260px, 50vw, 480px)" }}
            >
              {activeImageSrc ? (
                <Image
                  src={activeImageSrc}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl sm:text-8xl">
                  🔮
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        (i) => (i - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow transition-all hover:bg-white sm:left-3 sm:p-2"
                  >
                    <ChevronLeft className="h-4 w-4 text-stone-700 sm:h-5 sm:w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage((i) => (i + 1) % images.length)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow transition-all hover:bg-white sm:right-3 sm:p-2"
                  >
                    <ChevronRight className="h-4 w-4 text-stone-700 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:gap-3">
                {images.map((img, i) => (
                  <button
                    key={`${normalizeUrl(img)}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-20 sm:w-20 ${
                      i === activeImage
                        ? "border-amber-600"
                        : "border-amber-100 hover:border-amber-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full">
            <h1 className="mb-3 font-jost text-2xl leading-tight text-stone-800 sm:mb-4 sm:text-3xl">
              {product.name}
            </h1>

            <p className="mb-4 font-jost text-base tracking-[0.15em] text-stone-600 sm:text-lg sm:tracking-[0.2em]">
              Rs. {effectivePrice.toLocaleString("en-IN")}.00
            </p>

            {product.emiPrice > 0 && (
              <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-md border bg-stone-100 px-3 py-3 sm:mb-6 sm:px-4 xs:flex-row xs:items-center xs:gap-0">
                <div className="font-jost text-sm">
                  <span className="font-semibold text-green-600">
                    ₹{product.emiPrice}
                  </span>{" "}
                  /month 2/6 EMI Options
                  <div className="text-xs text-stone-500">
                    0% EMI available
                  </div>
                </div>

                <button className="whitespace-nowrap bg-black px-4 py-2 text-xs tracking-wide text-white">
                  BUY ON EMI
                </button>
              </div>
            )}

            {product.origin && (
              <div className="mb-4 sm:mb-5">
                <p className="mb-2 font-jost text-sm text-stone-500">
                  Origin:
                </p>
                <span className="inline-block border px-4 py-2 text-sm">
                  {product.origin}
                </span>
              </div>
            )}

            {product.shape && (
              <div className="mb-4 sm:mb-5">
                <p className="mb-2 font-jost text-sm text-stone-500">Shape:</p>
                <span className="inline-block border px-4 py-2 text-sm">
                  {product.shape}
                </span>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="mb-5 sm:mb-6">
                <p className="mb-2 font-jost text-sm text-stone-500">Style:</p>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.variants.map((v, i) => (
                    <button
                      key={`${v.label}-${v.value}-${i}`}
                      type="button"
                      onClick={() =>
                        setSelectedVariant({
                          label: v.label,
                          value: v.value,
                        })
                      }
                      className={`border px-3 py-2 text-sm transition-colors sm:px-4 ${
                        selectedVariant?.value === v.value
                          ? "border-black bg-white"
                          : "border-stone-300 text-stone-400 line-through"
                      }`}
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-5 flex w-28 items-center border sm:mb-6 sm:w-32">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex-1 py-2 text-lg"
              >
                −
              </button>

              <span className="flex-1 text-center text-sm sm:text-base">
                {qty}
              </span>

              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="flex-1 py-2 text-lg"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="mb-3 w-full border py-3.5 text-xs tracking-widest transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 sm:py-4 sm:text-sm"
            >
              ADD TO CART
            </button>

            <button
              type="button"
              className="w-full bg-black py-3.5 text-xs tracking-widest text-white sm:py-4 sm:text-sm"
            >
              BUY IT NOW
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10 sm:mb-12">
          <div className="mb-5 flex gap-0.5 overflow-x-auto border-b border-amber-100 scrollbar-hide sm:mb-6">
            {(["description", "short-description", "specs", "reviews"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 font-jost text-xs font-medium capitalize transition-all sm:px-5 sm:py-3 sm:text-sm ${
                    activeTab === tab
                      ? "border-amber-700 text-amber-800"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {tab === "reviews"
                    ? `Reviews (${reviews.length})`
                    : tab === "specs"
                    ? "Specifications"
                    : tab === "short-description"
                    ? "Short Description"
                    : "Description"}
                </button>
              )
            )}
          </div>

         {activeTab === "description" && (
  <div
    className="prose prose-sm max-w-none font-jost prose-stone sm:prose-base
      prose-h2:mb-3 prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-black
      prose-h3:mb-2 prose-h3:mt-5 prose-h3:text-base prose-h3:font-semibold prose-h3:text-black
      prose-p:my-2 prose-p:leading-relaxed prose-p:text-black
      prose-ul:my-2 prose-ul:list-disc prose-ul:pl-8
      prose-li:my-1 prose-li:text-black"
  >
    {product.description ? (
      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    ) : (
      <p className="text-stone-400">No description available.</p>
    )}
  </div>
)}

          {activeTab === "short-description" && (
            <div className="prose prose-sm max-w-none font-jost leading-relaxed text-stone-600 prose-stone sm:prose-base">
              {product.shortDescription ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                />
              ) : (
                <p className="text-stone-400">
                  No short description available.
                </p>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="font-jost text-sm text-stone-600">
              {specs && Object.keys(specs).length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-4 border-b border-stone-100 py-3"
                    >
                      <span className="font-medium capitalize text-stone-800">
                        {key}
                      </span>
                      <span className="text-right text-stone-600">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="font-jost text-sm text-stone-600">
              {summary && (
                <div className="mb-5 rounded-xl border border-stone-100 bg-white p-4">
                  <p className="font-medium text-stone-800">
                    Average Rating: {summary.averageRating || 0}
                  </p>
                  <p className="text-stone-500">
                    Total Reviews: {summary.totalReviews || reviews.length}
                  </p>
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-xl border border-stone-100 bg-white p-4"
                  >
                    <p className="font-medium text-stone-800">
                      {getReviewerName(review)}
                    </p>

                    <p className="mt-1 text-amber-700">
                      {"★".repeat(review.rating)}
                    </p>

                    <p className="mt-2 text-stone-600">{review.comment}</p>
                  </div>
                ))}
                </div>
              ) : (
                <p className="text-stone-400">No reviews yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-4 font-jost text-xl font-bold text-stone-800 sm:mb-6 sm:text-2xl">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}