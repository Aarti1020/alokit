"use client";

import Image from "next/image";
import { PhoneCall, Gem, BadgePercent, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Expert Gemologist Advice",
    icon: Gem,
  },
  {
    title: "Certified Astrological Guideline",
    icon: Sparkles,
  },
  {
    title: "Exclusive Discounts",
    icon: BadgePercent,
  },
];

export default function GemsExpertSection() {
  return (
    <section className="w-full bg-[#f3efea]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex items-center justify-center px-6 py-14 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[620px]">
            <h1 className="max-w-[610px] text-[34px] leading-[1.2] text-[#1f1f1f] sm:text-[42px] lg:text-[54px] font-serif">
              Gets all your gems-related questions answered by our expert
            </h1>

            <p className="mt-8 text-[18px] text-[#4b4b4b]">
              Select the choice of wear
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="mx-auto flex h-[180px] w-full max-w-[210px] items-center justify-center bg-white shadow-sm">
                      <div className="relative flex h-[128px] w-[128px] items-center justify-center rounded-full border-[3px] border-purple-700">
                        <Icon className="h-14 w-14 text-fuchsia-600" strokeWidth={1.7} />
                        <span className="absolute bottom-0 right-0 text-[54px] leading-none text-fuchsia-600">
                          ✓
                        </span>
                      </div>
                    </div>

                    <p className="mx-auto mt-5 max-w-[180px] text-[18px] leading-[1.45] text-[#4b4b4b]">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>

           <Link
  href="tel:+917039222272"
  className="mt-14 inline-flex items-center gap-3 bg-[#121212] px-9 py-5 text-[18px] font-medium uppercase tracking-wide text-white transition hover:bg-[#2a2a2a]"
>
  <PhoneCall className="h-5 w-5" />
  Call Now
</Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative min-h-[420px] lg:min-h-screen">
          <Image
            src="/images/astrologer_pandit.png"
            alt="Astrology expert"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      {/* <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-8 w-8 fill-current"
        >
          <path d="M19.11 17.21c-.29-.15-1.72-.85-1.98-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.94 1.14-.17.2-.34.22-.63.08-.29-.15-1.24-.46-2.36-1.47-.87-.77-1.46-1.72-1.63-2.01-.17-.29-.02-.44.13-.58.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.08-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.08-.78.37-.27.29-1.02 1-.99 2.44.03 1.44 1.04 2.82 1.19 3.01.15.2 2.04 3.11 4.94 4.36.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.27.17-1.39-.07-.12-.27-.2-.56-.34z" />
          <path d="M16.03 3.2C9.03 3.2 3.34 8.89 3.34 15.89c0 2.24.59 4.42 1.71 6.34L3.2 28.8l6.75-1.77a12.62 12.62 0 0 0 6.08 1.55h.01c7 0 12.69-5.69 12.69-12.69 0-3.39-1.32-6.58-3.72-8.97A12.6 12.6 0 0 0 16.03 3.2zm0 22.99h-.01a10.3 10.3 0 0 1-5.25-1.44l-.38-.22-4.01 1.05 1.07-3.91-.25-.4a10.34 10.34 0 0 1-1.59-5.51c0-5.69 4.63-10.32 10.33-10.32 2.76 0 5.35 1.08 7.3 3.03a10.26 10.26 0 0 1 3.02 7.29c0 5.69-4.63 10.33-10.32 10.33z" />
        </svg>
      </a> */}
    </section>
  );
}