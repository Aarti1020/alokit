"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const banners = [
  {
    image: "/Slider 1.png",
    href: "/products?productType=gemstone",
    alt: "Gemstone collection",
  },
  {
    image: "/Slider 2.png",
    href: "/products?productType=rudraksha",
    alt: "Rudraksha collection",
  },
  {
    image: "/Slider 3.png",
    href: "/products?productType=bracelet",
    alt: "Bracelets collection",
  },
  {
    image: "/Slider 4.png",
    href: "/products?productType=gemstone",
    alt: "More collection",
  },
  {
    image: "/Slider 5.png",
    href: "/products?search=certified",
    alt: "Certified products",
  },
  {
    image: "/Slider 6.png",
    href: "/gemstone-consultation",
    alt: "Consultation",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

return (
  <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#f4efea] sm:aspect-[16/6] md:aspect-auto md:h-[60vh] lg:h-[70vh]">
    {banners.map((banner, index) => (
      <Link
        key={index}
        href={banner.href}
        aria-label={banner.alt}
        className={`absolute inset-0 block cursor-pointer transition-opacity duration-1000 ${
          current === index
            ? "z-10 opacity-100 pointer-events-auto"
            : "z-0 opacity-0 pointer-events-none"
        }`}
      >
        <Image
          src={banner.image}
          alt={banner.alt}
          fill
          sizes="100vw"
          className={`object-contain object-top transition-transform duration-[4000ms] md:object-cover ${
            current === index ? "scale-105" : "scale-100"
          }`}
          priority={index === 0}
        />
      </Link>
    ))}
  </div>
);
}