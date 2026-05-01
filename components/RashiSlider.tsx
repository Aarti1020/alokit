// components/RashiSlider.tsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const rashis = [
  {
    name: "Mesh",
    english: "Aries",
    symbol: "♈",
    date: "Mar 21 - Apr 19",
    image: "/images/Aries .png",
  },
  {
    name: "Vrishabh",
    english: "Taurus",
    symbol: "♉",
    date: "Apr 20 - May 20",
    image: "/images/Taurus.png",
  },
  {
    name: "Mithun",
    english: "Gemini",
    symbol: "♊",
    date: "May 21 - Jun 20",
    image: "/images/Gemini.png",
  },
  {
    name: "Kark",
    english: "Cancer",
    symbol: "♋",
    date: "Jun 21 - Jul 22",
    image: "/images/Cancer.png",
  },
  {
    name: "Singh",
    english: "Leo",
    symbol: "♌",
    date: "Jul 23 - Aug 22",
    image: "/images/Leo.png",
  },
  {
    name: "Kanya",
    english: "Virgo",
    symbol: "♍",
    date: "Aug 23 - Sep 22",
    image: "/images/Virgo.png",
  },
  {
    name: "Tula",
    english: "Libra",
    symbol: "♎",
    date: "Sep 23 - Oct 22",
    image: "/images/Libra.png",
  },
  {
    name: "Vrishchik",
    english: "Scorpio",
    symbol: "♏",
    date: "Oct 23 - Nov 21",
    image: "/images/Scorpio.png",
  },
  {
    name: "Dhanu",
    english: "Sagittarius",
    symbol: "♐",
    date: "Nov 22 - Dec 21",
    image: "/images/Sagittarius.png",
  },
  {
    name: "Makar",
    english: "Capricorn",
    symbol: "♑",
    date: "Dec 22 - Jan 19",
    image: "/images/Capricorn.png",
  },
  {
    name: "Kumbh",
    english: "Aquarius",
    symbol: "♒",
    date: "Jan 20 - Feb 18",
    image: "/images/Aquarius.png",
  },
  {
    name: "Meen",
    english: "Pisces",
    symbol: "♓",
    date: "Feb 19 - Mar 20",
    image: "/images/Pisces.png",
  },
];

export default function RashiSlider() {
  return (
    <section className="w-full overflow-hidden bg-[#171c3a] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
          Choose Your Zodiac
        </p>

        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
          Explore All 12 Rashi
        </h2>

       
      </div>

      <div className="relative mx-auto mt-10 max-w-7xl overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#171c3a] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#171c3a] to-transparent" />

        <motion.div
          className="flex w-max gap-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 50,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...rashis, ...rashis].map((rashi, index) => (
            <a
              key={`${rashi.name}-${index}`}
              href={`/${rashi.english.toLowerCase()}`}
              className="group w-[250px] flex-shrink-0 overflow-hidden rounded-[2rem] border border-white/10  p-3 text-left shadow-xl backdrop-blur transition hover:-translate-y-2 hover:bg-white/15"
            >
              <div className="relative h-[210px] w-full overflow-hidden rounded-[1.5rem] ">
                <Image
                  src={rashi.image}
                  alt={rashi.name}
                  fill
                  sizes="250px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-3xl font-bold text-stone-950 shadow-lg">
                  {rashi.symbol}
                </div> */}
{/* 
                <span className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-stone-950">
                  {index % 12 + 1}
                </span> */}
              </div>

              {/* <div className="px-2 pb-3 pt-5"> */}
                {/* <h3 className="text-xl font-extrabold text-white">
                  {rashi.name}
                </h3> */}

                {/* <p className="mt-1 text-sm font-semibold text-amber-200">
                  {rashi.english}
                </p> */}

                {/* <p className="mt-3 text-xs font-medium text-indigo-100">
                  {rashi.date}
                </p> */}

                {/* <div className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-bold text-stone-950 transition group-hover:bg-amber-300">
                  View Details
                </div> */}
              {/* </div> */}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}