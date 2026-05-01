"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import RudrakshaShowCase from "./home/RudrakshaShowCase";
import { rudrakshaData } from "@/lib/data/rudraksha-data";
import {
  RudrakshaCalculatorResult,
  rudrakshaCalculatorApi,
} from "@/lib/api";

export default function RudrakshaCalculator() {
  const [form, setForm] = useState({
    suggestionBy: "BIRTH",
    name: "",
    email: "",
    phone: "",
    dob: "",
    birthTime: "",
    placeOfBirth: "",
  });
  const [result, setResult] = useState<RudrakshaCalculatorResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await rudrakshaCalculatorApi.submit({
        suggestionBy: form.suggestionBy as "BIRTH" | "MANIFESTATION_LUCK" | "PURPOSE",
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dob,
        birthTime: form.birthTime,
        placeOfBirth: form.placeOfBirth,
      });

      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit calculator form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      {/* Page Title */}
      <div className="text-center py-10 px-4">
        <h1 className="font-serif text-3xl text-gray-800 md:text-3xl">
          Rudraksha Calculator</h1>
          <p className="font-serif text-3xl text-gray-800 md:text-3xl m-1">Know which Rudraksha is the key to good
          fortune for you as per Birth Chart</p> 
       
      </div>

      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto px-2 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* LEFT — Form */}
        <div className="bg-[#fdf8f2] border border-[#e8ddd0] rounded-sm p-8 md:p-10">
          <h2 className="font-cinzel text-2xl text-[#8B1A1A] text-center mb-8">
            Lucky Rudraksha Calculator
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Suggestion By */}
            <div className="flex flex-col gap-1.5">
              <label className="font-jost text-[12px] font-semibold text-[#1a1a1a] tracking-wide">
                Rudraksha Suggestion By:
              </label>
              <select
                value={form.suggestionBy}
                onChange={(e) => setForm({ ...form, suggestionBy: e.target.value })}
                className="w-full border border-[#ccc] bg-white px-4 py-3 font-jost text-[13px] text-[#333] outline-none focus:border-[#8B1A1A] rounded-none"
              >
                <option value="BIRTH">BIRTH</option>
                <option value="MANIFESTATION_LUCK">MANIFESTATION LUCK</option>
                <option value="PURPOSE">PURPOSE</option>
              </select>
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-jost text-[12px] font-semibold text-[#1a1a1a] tracking-wide">
                  Name:
                </label>
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#ccc] bg-[#f5f0ea] px-4 py-3 font-jost text-[13px] placeholder-[#aaa] text-[#333] outline-none focus:border-[#8B1A1A] rounded-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-jost text-[12px] font-semibold text-[#1a1a1a] tracking-wide">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-[#ccc] bg-[#f5f0ea] px-4 py-3 font-jost text-[13px] placeholder-[#aaa] text-[#333] outline-none focus:border-[#8B1A1A] rounded-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-jost text-[12px] font-semibold text-[#1a1a1a] tracking-wide">
                Phone:
              </label>
              <input
                type="tel"
                placeholder="PHONE"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full sm:w-1/2 border border-[#ccc] bg-[#f5f0ea] px-4 py-3 font-jost text-[13px] placeholder-[#aaa] text-[#333] outline-none focus:border-[#8B1A1A] rounded-none"
              />
            </div>

            {/* Date of Birth + Birth Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-jost text-[12px] font-semibold text-[#1a1a1a] tracking-wide">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full border border-[#ccc] bg-[#f5f0ea] px-4 py-3 font-jost text-[13px] text-[#333] outline-none focus:border-[#8B1A1A] rounded-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-jost text-[12px] font-semibold text-[#1a1a1a] tracking-wide">
                  Birth Time:
                </label>
                <input
                  type="time"
                  value={form.birthTime}
                  onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                  className="w-full border border-[#ccc] bg-[#f5f0ea] px-4 py-3 font-jost text-[13px] text-[#333] outline-none focus:border-[#8B1A1A] rounded-none"
                />
              </div>
            </div>

            {/* Place of Birth */}
            <div className="flex flex-col gap-1.5">
              <label className="font-jost text-[12px] font-semibold text-[#1a1a1a] tracking-wide">
                Place of Birth:
              </label>
              <input
                type="text"
                placeholder="ENTER CITY"
                value={form.placeOfBirth}
                onChange={(e) => setForm({ ...form, placeOfBirth: e.target.value })}
                className="w-full border border-[#ccc] bg-[#f5f0ea] px-4 py-3 font-jost text-[13px] placeholder-[#aaa] text-[#333] outline-none focus:border-[#8B1A1A] rounded-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#8B1A1A] hover:bg-[#6e1414] disabled:bg-[#9b7474] disabled:cursor-not-allowed text-white font-jost text-[13px] tracking-[0.2em] py-4 transition-colors rounded-none mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  SUBMITTING
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  SUBMIT
                </>
              )}
            </button>

            {error ? (
              <div className="border border-[#b91c1c] bg-[#fff1f1] px-4 py-3 font-jost text-[13px] text-[#8B1A1A]">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="border border-[#d8c7b7] bg-white px-5 py-5 font-jost text-[#1a1a1a]">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1f7a3a]" />
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1f7a3a]">
                      Submitted successfully
                    </p>
                    <h3 className="mt-2 font-cinzel text-xl text-[#8B1A1A]">
                      {result.recommendation.name}
                    </h3>
                    <p className="mt-2 text-[14px] leading-6 text-[#555]">
                      {result.recommendation.reason}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="border border-[#eadfd2] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-[#777]">Birth No.</p>
                    <p className="text-lg font-semibold">{result.profile.birthNumber}</p>
                  </div>
                  <div className="border border-[#eadfd2] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-[#777]">Zodiac</p>
                    <p className="text-sm font-semibold">{result.profile.zodiacSign}</p>
                  </div>
                  <div className="border border-[#eadfd2] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-[#777]">Day</p>
                    <p className="text-sm font-semibold">{result.profile.dayOfWeek}</p>
                  </div>
                </div>

                {result.products.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#555]">
                      Matching Products
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {result.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="border border-[#eadfd2] p-3 transition-colors hover:border-[#8B1A1A]"
                        >
                          <div className="flex gap-3">
                            <div className="relative h-20 w-20 shrink-0 border border-[#f0e7dc] bg-[#f7f1ea]">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.title || product.name}
                                  fill
                                  sizes="80px"
                                  unoptimized={product.image.startsWith("/backend-proxy/")}
                                  className="object-contain"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[11px] text-[#999]">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[14px] font-semibold text-[#1a1a1a] line-clamp-2">
                                {product.title || product.name}
                              </p>
                              {product.shortDescription ? (
                                <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#666]">
                                  {product.shortDescription}
                                </p>
                              ) : null}
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <p className="text-[13px] font-semibold text-[#8B1A1A]">
                                  Rs. {product.effectivePrice || product.salePrice || product.price}
                                </p>
                                <span className={`text-[11px] ${product.inStock ? "text-[#1f7a3a]" : "text-[#8B1A1A]"}`}>
                                  {product.inStock ? "In stock" : "Out of stock"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </form>
        </div>

        {/* RIGHT — Image */}
        <div className="relative min-h-[480px] lg:min-h-0">
          <Image
            src="/images/Rudraksha Calculator Image.png"
            alt="Rudraksha pendant against Himalayan mountains"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    
     
    </div>
  );
}
