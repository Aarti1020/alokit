"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { SlidersHorizontal, Loader2, AlertCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { productApi, categoryApi, ProductFilters } from "@/lib/api";
import { Product, Category } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import GemstoneSection from "@/components/home/GemsStoneSection";
import GemsExpertSection from "@/components/GemsExpertSection";

const PRODUCT_TYPES = [
  { id: "", label: "All" },
  { id: "gemstone", label: "Gemstones",desc:"Gemstones are naturally occurring minerals that have been valued for their beauty, rarity, and metaphysical properties for centuries. Each gemstone is believed to possess unique energies and benefits that can influence various aspects of life, such as emotional well-being, physical health, and spiritual growth. For example, amethyst is often associated with calming energy and spiritual awareness, while rose quartz is known for promoting love and emotional healing. Gemstones are commonly used in jewelry, meditation practices, and energy healing to harness their positive effects and enhance one's connection to the universe." },
  { id: "rudraksha", label: "Rudraksha",desc:"Rudraksha beads are the dried seeds of the Elaeocarpus ganitrus tree, revered in Hinduism for their spiritual significance and believed to possess powerful metaphysical properties. Each rudraksha bead is characterized by its unique number of facets or 'mukhis,' which are said to correspond to different deities and cosmic energies. Wearing rudraksha beads is thought to bring various benefits, such as enhanced meditation, protection from negative energies, improved health, and spiritual growth. The beads are often used in malas (prayer necklaces) for chanting mantras and meditation practices, making them a cherished item for those seeking a deeper connection with the divine and the universe." },
  { id: "bracelet", label: "Bracelets",desc:"The bracelets are built from natural gemstones (quartz, aventurine, tiger eye, etc.). Each stone is associated with particular benefits (grounding, clarity, prosperity). Each bracelet’s description includes a list of “benefits” tied to emotional, spiritual, or energetic support — e.g. stress relief, clarity, energy protection. Their “Bracelets” collection page references how gemstones align with planetary influences, and how wearing them can harmonize one’s life with cosmic energies. So their overall messaging is: these are spiritual / astrological gemstone bracelets that are certified, energetically charged, beneficial, trustworthy, and wearable in everyday life"},
  { id: "jewellery", label: "Jewellery",desc:"The jewellery category includes items like pendants, rings, and earrings crafted from authentic rudraksha beads and natural gemstones. Each piece is designed to be both aesthetically pleasing and spiritually meaningful, often incorporating traditional symbols and designs that resonate with cosmic energies. The jewellery collection emphasizes the blend of beauty and spiritual significance, offering customers a way to carry the benefits of rudraksha and gemstones with them in a stylish and wearable form." },
  { id: "crystal", label: "Crystals",desc:"The crystals category features a curated selection of natural gemstones and crystals that are believed to possess unique energetic properties. These items are often used for meditation, energy healing, or as decorative pieces that enhance the spiritual ambiance of a space. Each crystal is chosen for its specific benefits, such as promoting clarity, grounding, or emotional balance. The collection highlights the natural beauty and metaphysical qualities of each crystal, making them accessible to those seeking to incorporate these powerful tools into their spiritual practice or daily life." },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
];


function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters from URL
  const productType = searchParams.get("productType") || "";
  const categoryParam = searchParams.get("category") || "";
  const subCategoryParam = searchParams.get("subCategory") || "";
  const sort = (searchParams.get("sort") || "latest") as ProductFilters["sort"];
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const inStock = searchParams.get("inStock") === "true";
  const resolvedCategoryId =
    categories.find((category) => category._id === categoryParam || category.slug === categoryParam)?._id ||
    categoryParam;
  const resolvedSubCategoryId = subCategoryParam; // For simplicity, not resolving subcategory slug to ID here    
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/products?${params.toString()}`);
  };

const loadProducts = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const filters: ProductFilters = {
      page,
      limit: 12,
      sort,
    };

    if (productType) filters.productType = productType;
    if (resolvedCategoryId) filters.category = resolvedCategoryId;
    if (resolvedSubCategoryId) filters.subCategory = resolvedSubCategoryId;
    if (search) filters.search = search;
    if (inStock) filters.inStock = true;

    const res = await productApi.list(filters);

    setProducts(res.data || []);
    setTotal(res.total || 0);
    setTotalPages(res.totalPages || 1);
  } catch (e: unknown) {
    setError(e instanceof Error ? e.message : "Failed to load products");
  } finally {
    setLoading(false);
  }
}, [
  page,
  sort,
  productType,
  resolvedCategoryId,
  resolvedSubCategoryId,
  search,
  inStock,
]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    categoryApi.list().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const hasFilters = !!(
  productType ||
  categoryParam ||
  subCategoryParam ||
  search ||
  inStock
);

  const clearFilters = () => router.push("/products");

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
     {/* <div className="bg-amber-50 py-10 md:py-14 px-4 sm:px-6 lg:px-12"> */}
  {/* <div className="max-w-7xl mx-auto text-center md:text-left"> */}
    
    {/* Tagline */}
    {/* <p className="font-jost text-amber-500 tracking-widest text-xs uppercase mb-2">
      Authentic & Certified
    </p> */}

    {/* Title */}
    <h1 className="font-cinzel text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-3 leading-tight text-center mt-5">
      {PRODUCT_TYPES.find((t) => t.id === productType)?.label || "All Products"}
    </h1>

    {/* Description */}
    {/* <p className="text-stone-600 font-jost text-sm sm:text-base max-w-6xl">
      {PRODUCT_TYPES.find((t) => t.id === productType)?.desc || 
        "Discover our curated selection of authentic and certified products."}
    </p> */}

    {/* Product Count */}
    {/* <p className="text-amber-500 font-jost text-sm mt-3">
      {loading ? "Loading..." : `${total} products available`}
    </p> */}

  {/* </div> */}
{/* </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Type Tabs */}
        {/* <div className="flex gap-2 flex-wrap mb-6">
          {PRODUCT_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateParam("productType", t.id)}
              className={`px-4 py-2 rounded-full text-sm font-jost font-medium transition-all ${
                productType === t.id
                  ? "bg-amber-800 text-white shadow"
                  : "bg-white text-stone-600 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div> */}

        {/* Filters Bar */}
       

        {/* Search result info */}
        {/* {search && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-stone-500 font-jost text-sm">Search: <strong className="text-stone-800">&quot;{search}&quot;</strong></span>
            <button onClick={() => updateParam("search", "")} className="text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )} */}

        {/* States */}
        {loading ? (
          <div className="flex justify-center items-center py-28 gap-3 text-amber-800">
            <Loader2 className="w-7 h-7 animate-spin" />
            <span className="font-cinzel text-lg">Loading sacred items...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 gap-3 text-red-600">
            <AlertCircle className="w-10 h-10" />
            <p className="font-cinzel text-lg">Failed to load products</p>
            <p className="font-jost text-sm text-stone-500">{error}</p>
            <button onClick={loadProducts} className="mt-2 bg-amber-800 text-white px-6 py-2.5 rounded-xl font-jost text-sm">Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-5xl mb-4">🕉️</p>
            <p className="font-cinzel text-xl mb-2">No products found</p>
            <p className="font-jost text-sm">Try adjusting your filters</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-5 bg-amber-800 text-white px-6 py-2.5 rounded-xl font-jost text-sm">Clear All Filters</button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="p-2 rounded-xl border border-amber-200 text-amber-800 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-jost font-medium transition-all ${
                        page === pageNum ? "bg-amber-800 text-white shadow" : "border border-amber-200 text-stone-600 hover:bg-amber-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 rounded-xl border border-amber-200 text-amber-800 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
      </div>
    }>
      <ProductsContent />
      <GemstoneSection />
      <GemsExpertSection />
    </Suspense>
  );
}
