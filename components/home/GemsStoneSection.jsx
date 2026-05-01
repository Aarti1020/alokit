"use client";
import { Gem, Leaf, ShieldCheck, Truck } from "lucide-react";

export default function GemstoneSection() {
  const features = [
    {
      icon: <Gem size={28} />,
      text: "Guarantee of Purity",
    },
    {
      icon: <Leaf size={28} />,
      text: "100% Abhimantri Product",
    },
    {
      icon: <ShieldCheck size={28} />,
      text: "Ethically Sourced",
    },
    {
      icon: <Truck size={28} />,
      text: "Free Shipping",
    },
  ];

  return (
    <div className="w-full bg-[#f4efea] py-16 px-4">
      {/* Top Features */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {features.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-purple-400 text-purple-600">
              {item.icon}
              {/* Tick mark */}
              <span className="absolute -bottom-1 -right-1 text-pink-500 text-sm">
                ✓
              </span>
            </div>
            <p className="text-sm md:text-base text-gray-700 font-medium">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      {/* <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-[#8b0000] rounded-3xl py-10 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-white text-2xl md:text-3xl font-serif text-center md:text-left">
            Know Your Lucky Gemstone
          </h2>

          <button className="bg-white text-red-700 px-6 py-3 rounded-md tracking-widest text-sm font-semibold hover:bg-gray-100 transition">
            CHECK NOW!
          </button>
        </div>
      </div> */}
    </div>
  );
}