"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Are your gemstones and Rudraksha authentic?",
    answer:
      "Yes, all products at Alokit Gems & Jewels are carefully sourced from trusted suppliers and verified for authenticity. We also provide certification for selected gemstones to ensure complete transparency and trust.",
  },
  {
    question: "Do you provide energized or activated products?",
    answer:
      "Yes, we offer energization of gemstones and Rudraksha based on traditional spiritual practices. If you require an energized product, you can request it at the time of placing your order.",
  },
  {
    question: "How do I choose the right Gemstone or Rudraksha?",
    answer:
      "Choosing the right product depends on your personal needs, zodiac, or life goals. We recommend consulting from our expert astrologer before purchase. You can also contact us for guidance, and we’ll help you select the most suitable option.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, we offer Cash on Delivery (COD) across most locations in India. You can choose your preferred payment method at checkout.",
  },
  {
    question: "What is your return or replacement policy?",
    answer:
      "We offer replacement in case of damaged or incorrect products. Due to the nature of spiritual and energized items, returns may be limited. Please refer to our Return & Refund Policy page for complete details.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:py-20">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-cinzel text-3xl sm:text-4xl font-semibold text-stone-900">
            Frequently Asked Questions
          </h1>
          <p className="font-jost text-stone-500 mt-3">
            Find answers to common questions about Alokit Gems & Jewels.
          </p>
        </div>

        <div className="border-t border-stone-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-6 py-8 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-jost text-xl sm:text-2xl text-stone-900">
                    {faq.question}
                  </span>

                  <span className="shrink-0 text-stone-600">
                    {isOpen ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-8 pr-10">
                    <p className="font-jost text-lg leading-8 text-stone-700">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}