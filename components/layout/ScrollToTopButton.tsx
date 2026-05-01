"use client";

import { ArrowUp } from "lucide-react";
import WhatsAppButton from "../home/WhatsAppButton";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-3">
      <WhatsAppButton />

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shadow-md transition hover:bg-amber-700"
      >
        <ArrowUp size={22} />
      </button>
    </div>
  );
}