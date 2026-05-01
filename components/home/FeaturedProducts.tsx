"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { productApi } from "@/lib/api";
import type { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);

        const featuredResponse = await productApi.list({
          featured: true,
          limit: 4,
          sort: "latest",
        });

        const featuredProducts = normalizeProductsResponse(featuredResponse);

        if (featuredProducts.length > 0) {
          if (mounted) setProducts(featuredProducts);
          return;
        }

        const latestResponse = await productApi.list({
          limit: 4,
          sort: "latest",
        });

        if (mounted) {
          setProducts(normalizeProductsResponse(latestResponse));
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
           <div className="w-full text-center">
    <p className="mb-2 font-jost text-xs uppercase tracking-widest text-amber-600">
      Hand Picked
    </p>
    <h2 className="font-cinzel text-3xl font-bold text-stone-800 md:text-4xl">
      Featured Products
    </h2>
  </div>

          <Link
            href="/products"
            className="hidden items-center gap-1.5 font-jost text-sm font-medium text-amber-700 transition-colors hover:text-amber-900 sm:inline-flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center font-jost text-stone-400">
            No featured products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                prioritizeImage={index === 0}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-800 px-6 py-3 font-jost font-medium text-amber-50 transition hover:bg-amber-900"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function normalizeProductsResponse(response: any): Product[] {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.products)) return response.data.products;
  if (Array.isArray(response?.products)) return response.products;
  return [];
}