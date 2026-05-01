import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function MoreCollectionPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-950 to-stone-900 text-white py-14 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-cinzel text-4xl font-bold text-amber-100">
            More Collection
          </h1>
          <p className="font-jost text-stone-200 mt-3">
            New spiritual and gemstone collections are on the way.
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border border-stone-200 rounded-3xl shadow-sm px-6 py-16 sm:px-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-800">
            <Sparkles className="h-10 w-10" />
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-stone-900">
            Coming Soon
          </h2>

          <p className="font-jost text-lg text-stone-600 leading-8 mt-5 max-w-2xl mx-auto">
            We are preparing a special collection of crystals & healing Stools,rituals & gifting and
            more spiritual products for you. Please check back soon for the latest
            additions to Alokit Gems & Jewels.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-amber-800 px-7 py-3 font-jost text-sm font-medium text-white hover:bg-amber-900 transition"
            >
              Back to Home
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-amber-800 px-7 py-3 font-jost text-sm font-medium text-amber-900 hover:bg-amber-50 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}