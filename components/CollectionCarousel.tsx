"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryApi, subCategoryApi } from "@/lib/api";
import {
  rudraksha,
  gemstones,
  bracelets,
  type CollectionItem,
} from "@/lib/data/collection-data";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  category:
    | string
    | {
        _id: string;
        slug?: string;
        name?: string;
      };
};

type ItemCardProps = {
  item: CollectionItem;
  href: string;
};

function normalizeSlug(value?: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ItemCard({ item, href }: ItemCardProps) {
  return (
    <Link
      href={href}
      className="group mx-3 block w-40 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden bg-[#eee4dc]">
        <Image
          src={item.img}
          alt={item.label}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* <div className="p-3 text-center">
        <h3 className="line-clamp-1 font-serif text-base text-stone-800">
          {item.label}
        </h3>

        {item.sub && (
          <p className="mt-1 text-xs text-stone-500">{item.sub}</p>
        )}

      </div> */}
    </Link>
  );
}

type InfiniteSliderProps = {
  items: CollectionItem[];
  categorySlug: string;
  direction?: "left" | "right";
  speed?: number;
  getProductUrl: (item: CollectionItem, categorySlug: string) => string;
};

function InfiniteSliderInner({
  items,
  categorySlug,
  direction = "left",
  speed = 30,
  getProductUrl,
}: InfiniteSliderProps) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items, ...items];
  const totalWidth = items.length * 184;

  const animationName =
    direction === "left"
      ? `slide-left-${categorySlug}-${speed}`
      : `slide-right-${categorySlug}-${speed}`;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-stone-50 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-stone-50 to-transparent" />

      <div
        data-track
        className="flex"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <ItemCard
            key={`${item.slug}-${i}`}
            item={item}
            href={getProductUrl(item, categorySlug)}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes ${animationName} {
          0% {
            transform: translateX(
              ${direction === "left" ? "0" : `-${totalWidth}px`}
            );
          }

          100% {
            transform: translateX(
              ${direction === "left" ? `-${totalWidth}px` : "0"}
            );
          }
        }
      `}</style>
    </div>
  );
}

type SliderSectionProps = {
  title: string;
  categorySlug: string;
  items: CollectionItem[];
  direction?: "left" | "right";
  speed?: number;
  getProductUrl: (item: CollectionItem, categorySlug: string) => string;
};

function SliderSection({
  title,
  categorySlug,
  items,
  direction = "left",
  speed = 30,
  getProductUrl,
}: SliderSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="mb-8 text-center text-3xl font-light tracking-wide text-stone-700">
        {title}
      </h2>

      <div
        className="group"
        onMouseEnter={(e) => {
          const track =
            e.currentTarget.querySelector<HTMLElement>("[data-track]");

          if (track) track.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          const track =
            e.currentTarget.querySelector<HTMLElement>("[data-track]");

          if (track) track.style.animationPlayState = "running";
        }}
      >
        <InfiniteSliderInner
          items={items}
          categorySlug={categorySlug}
          direction={direction}
          speed={speed}
          getProductUrl={getProductUrl}
        />
      </div>
    </section>
  );
}

export default function CollectionCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [categoryRes, subCategoryRes] = await Promise.all([
          categoryApi.list(),
          subCategoryApi.list(),
        ]);

        setCategories(categoryRes.data || []);
        setSubCategories(subCategoryRes.data || []);
      } catch (error) {
        console.error("Failed to load collection filter data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFilterData();
  }, []);

  const getCategoryBySlug = useMemo(() => {
    return (categorySlug: string) => {
      const normalizedCategorySlug = normalizeSlug(categorySlug);

      return categories.find((category) => {
        const dbSlug = normalizeSlug(category.slug);
        const dbName = normalizeSlug(category.name);

        return (
          dbSlug === normalizedCategorySlug ||
          dbSlug === `${normalizedCategorySlug}s` ||
          dbName === normalizedCategorySlug ||
          dbName === `${normalizedCategorySlug}s`
        );
      });
    };
  }, [categories]);

  const getProductUrl = (item: CollectionItem, categorySlug: string) => {
    const category = getCategoryBySlug(categorySlug);

    if (!category?._id) {
      return `/products?search=${encodeURIComponent(item.label)}`;
    }

    const itemSlug = normalizeSlug(item.slug);

    const subCategory = subCategories.find((sub) => {
      const parentCategoryId =
        typeof sub.category === "string" ? sub.category : sub.category?._id;

      return (
        normalizeSlug(sub.slug) === itemSlug &&
        String(parentCategoryId) === String(category._id)
      );
    });

    if (!subCategory?._id) {
      console.warn("Subcategory not found for carousel item:", {
        itemSlug: item.slug,
        itemLabel: item.label,
        categorySlug,
        categoryId: category._id,
      });

      return `/products?search=${encodeURIComponent(item.label)}`;
    }

    return `/products?category=${category._id}&subCategory=${subCategory._id}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-stone-500">
          Loading collections...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="mx-auto max-w-7xl px-4 font-cinzel font-semibold">
        <SliderSection
          title="Rudraksha Collection"
          categorySlug="rudraksha"
          items={rudraksha}
          direction="left"
          speed={50}
          getProductUrl={getProductUrl}
        />

        <SliderSection
          title="Gemstones Collection"
          categorySlug="gemstone"
          items={gemstones}
          direction="left"
          speed={30}
          getProductUrl={getProductUrl}
        />

        <SliderSection
          title="Bracelets Collection"
          categorySlug="bracelet"
          items={bracelets}
          direction="left"
          speed={28}
          getProductUrl={getProductUrl}
        />
      </div>
    </main>
  );
}