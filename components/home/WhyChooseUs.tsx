import { Shield, Award, Truck, HeadphonesIcon, RefreshCw, Star } from "lucide-react";

const FEATURES = [
  { icon: Shield, title: "100% Authentic", desc: "All products are genuine and sourced directly from certified mines and suppliers." },
  { icon: Award, title: "Lab Certified", desc: "Every gemstone comes with a certificate of authenticity from reputed laboratories." },
  { icon: Truck, title: "Free Shipping", desc: "Complimentary shipping on all orders above ₹2,999 across India." },
  { icon: HeadphonesIcon, title: "Expert Guidance", desc: "Get personalised recommendations from our Vedic astrology experts." },
  { icon: RefreshCw, title: "Easy Returns", desc: "Hassle-free 7-day return policy on all orders." },
  { icon: Star, title: "Trusted by 10,000+", desc: "Thousands of happy customers across India and globally." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-950 to-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-jost text-amber-500 tracking-widest text-xs uppercase mb-2">Our Promise</p>
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-amber-100">Why Choose Alokit</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-amber-900/30 border border-amber-800/40 rounded-2xl p-6 hover:border-amber-600/50 transition-all group">
              <div className="w-12 h-12 bg-amber-800/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-700/50 transition-colors">
                <Icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-cinzel text-amber-100 font-semibold mb-2">{title}</h3>
              <p className="text-amber-400 text-sm font-jost leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
