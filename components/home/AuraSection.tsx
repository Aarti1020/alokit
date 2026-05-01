"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type AuraCategoryItem = {
  title: string;
  image: string;
  href: string;
};

const STATIC_CATEGORY_IMAGES: AuraCategoryItem[] = [
  {
    title: "Gemstone",
    image: "/images/Gemstone Image.png",
    href: "/products?productType=gemstone",
  },
  {
    title: "Rudraksha",
    image: "/images/Rudraksha Image (1).png",
    href: "/products?productType=rudraksha",
  },
  {
    title: "Bracelet",
    image: "/images/Bracelets Image.png",
    href: "/products?productType=bracelet",
  },
  {
    title: "More Collection",
    image: "/images/More Collection Image.png",
    href: "/more-collection",
  },
];

export default function AuraSection() {
  const [items] = useState<AuraCategoryItem[]>(STATIC_CATEGORY_IMAGES);

  return (
    <section className="w-full bg-[#f4efea] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
  <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 lg:mb-12">
    <h2 className="font-serif text-2xl leading-tight text-gray-800 sm:text-3xl md:text-4xl">
      Aura-synchronized treasures
    </h2>

    <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
      Channel and elevate your spiritual essence
    </p>
  </div>

  <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
    {items.map((item) => {
      return (
        <Link
          key={item.title}
          href={item.href}
          className="group block overflow-hidden rounded-2xl bg-[#f1ebe6] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
        <div className="relative w-full overflow-hidden bg-[#eee4dc]">
  <Image
    src={item.image}
    alt={item.title}
    width={500}
    height={500}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
  />
</div>

          <div className="p-4 text-center sm:p-5">
            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-gray-500 sm:text-xs">
              Category
            </p>

            <h3 className="mb-4 text-base font-medium text-red-700 sm:text-lg">
              {item.title}
            </h3>

            <div className="w-full  bg-[#a32020] px-4 py-3 text-center text-xs font-medium tracking-[0.18em] text-white transition group-hover:bg-[#8b1a1a] sm:text-sm">
              EXPLORE {item.title.toUpperCase()}
            </div>
          </div>
        </Link>
      );
    })}
  </div>
</section>
  );
}