"use client";

import { useRef, useState } from "react";
import Link from "next/link";

const messages = [
  {
    type: "certified",
  },
  {
    type: "gemstone",
  },
];

export default function CertifiedMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePause = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsPaused(true);
  };

  const handleResumeAfterDelay = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden border-y border-yellow-300/40 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 py-3 shadow-sm">
      <div
        className="flex w-max whitespace-nowrap"
        style={{
          animation: "certified-marquee 60s linear infinite",
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center gap-10 px-5">
            {[...messages, ...messages, ...messages, ...messages].map(
              (item, index) => (
                <div
                  key={`${group}-${index}`}
                  className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-800 md:text-base"
                >
                  <span className="text-yellow-500">✦</span>

                  {item.type === "certified" ? (
                    <span>
                      All our Products are{" "}
                      <strong className="text-yellow-700">
                        100% Certified
                      </strong>{" "}
                      and{" "}
                      <strong className="text-yellow-700">Energised</strong>.
                    </span>
                  ) : (
                    <span>
                      To know your right Gemstone{" "}
                      <Link
                        href="/gemstone-consultation"
                        onMouseEnter={handlePause}
                        onMouseLeave={handleResumeAfterDelay}
                        className="font-semibold text-yellow-700 underline underline-offset-4 transition hover:text-yellow-800"
                      >
                        click here
                      </Link>
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes certified-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}