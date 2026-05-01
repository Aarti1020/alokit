"use client";

import Image from "next/image";
import Link from "next/link";

export default function CrystalTree() {
  return (
    <section className="w-full bg-[#fdf8f2] py-8 md:py-12">
      <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] max-w-3xl leading-snug font-semibold text-center mx-auto mb-6 md:mb-10 px-4">
        Astrology Guidance & Premium Gifting
      </h1>

      <div className="mx-auto grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-2">
        {/* Left Image */}
        <Link href="/products" className="block">
          <div className="relative w-full overflow-hidden shadow-lg">
            <Image
              src="/images/Gift Hammper Image.png"
              alt="Gift hamper"
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="block h-auto w-full transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* Right Image */}
        <Link href="/gemstone-consultation" className="block">
          <div className="relative w-full overflow-hidden shadow-lg">
            <Image
              src="/images/Guruji Consulting Image.png"
              alt="Guruji consultation"
              width={1200}
              height={900}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="block h-auto w-full transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}