"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { buildDisplayImageUrl } from "@/lib/config";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  prioritizeImage?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  gemstone: "Gemstone",
  rudraksha: "Rudraksha",
  bracelet: "Bracelet",
  jewellery: "Jewellery",
  crystal: "Crystal",
};

export default function ProductCard({
  product,
  showBadge = true,
  prioritizeImage = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const rawImage =
    product.primaryImageData?.variants?.original ||
    product.primaryImageData?.url ||
    product.images.find((image) => image.isPrimary)?.variants?.original ||
    product.images.find((image) => image.isPrimary)?.url ||
    product.images[0]?.variants?.original ||
    product.images[0]?.url ||
    "";
  const imageUrl = buildDisplayImageUrl(rawImage);
  const shouldBypassOptimization = Boolean(imageUrl?.startsWith("/backend-proxy/"));

  const price =
    product.effectivePrice ?? (product.salePrice > 0 ? product.salePrice : product.basePrice);
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.basePrice;
  const discountPct = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;
  const wishlisted = isWishlisted(product._id);

return (
  <Link href={`/products/${product.slug}`} className="group flex flex-col bg-transparent cursor-pointer">
    {/* Image */}
    <div className="relative bg-[#e9e6e1] aspect-square flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:bg-[#e0dbd5]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          loading={prioritizeImage ? "eager" : "lazy"}
          unoptimized={shouldBypassOptimization}
          className="object-contain transition-transform duration-400 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="text-sm text-gray-400">No image</div>
      )}

      {/* Floating + button — stops propagation so it doesn't navigate */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product._id); }}
        className="absolute bottom-2.5 right-2.5 bg-white border border-gray-200 rounded w-8 h-8 flex items-center justify-center shadow text-gray-700 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
      >
        +
      </button>
    </div>

    {/* Content */}
    <div className="text-center py-3.5 px-3">
      <h3 className="font-cinzel text-[13px] font-normal text-[#1a1a1a] leading-snug tracking-wide">
        {product.name}
        {product.weightCarat > 0 && ` – ${product.weightCarat} Carat`}
      </h3>

      <p className="mt-1.5 text-[11px] tracking-widest text-gray-400 font-jost uppercase font-light">
        From Rs. {price.toLocaleString("en-IN")}
      </p>

      <div className="mt-1.5 text-[11px] text-gray-600 font-jost flex items-center justify-center gap-2 flex-wrap">
        <span>or ₹{Math.round(price / 10).toLocaleString("en-IN")}/Month</span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="bg-[#1a1a1a] text-white px-2 py-0.5 text-[10px] tracking-wide hover:bg-[#333] transition-colors"
        >
          Buy on EMI &rsaquo;
        </button>
      </div>
    </div>
  </Link>
);
}
