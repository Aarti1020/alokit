// app/about-us/page.tsx

import Image from "next/image";
import {
  Gem,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Eye,
  Target,
  CheckCircle2,
  
  Users,
  Star,
  Leaf,
} from "lucide-react";
import Link from "next/link";

const offerings = [
  "Natural & Certified Gemstones",
  "Authentic Rudraksha",
  "Healing Crystal Bracelets",
  "Spiritual Jewellery",
  "Vastu & Energy Products",
  "Energized and Activated Items",
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Authenticity",
    text: "Every gemstone and Rudraksha is genuine, ethically sourced, and quality-checked.",
  },
  {
    icon: HeartHandshake,
    title: "Trust",
    text: "Our slogan, “Brilliance Of Trust”, reflects our commitment to honesty and transparency.",
  },
  {
    icon: Sparkles,
    title: "Energy Alignment",
    text: "We believe intention matters. Many products are carefully energized to enhance spiritual effectiveness.",
  },
];

const whyChooseUs = [
  "100% Authentic & Certified Products",
  "Trusted Sourcing from India’s Spiritual Hubs",
  "Energized Products on Request",
  "Expert Guidance & Consultation",
  "Customer-Centric Approach",
  "Secure Payments & Pan-India Delivery",
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(147,51,234,0.18),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              <Gem className="h-4 w-4" />
              Brilliance Of Trust
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to Alokit Gems & Jewels
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              True transformation begins with the right energy. Rooted in
              ancient wisdom and guided by authenticity, Alokit Gems & Jewels
              brings you powerful spiritual tools that align your mind, body,
              and soul.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300">
              We are more than just a brand — we are a bridge between{" "}
              <span className="font-semibold text-amber-200">
                traditional spiritual science and modern living.
              </span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link 
                href="/collections"
                className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
              >
                Explore Products
              </Link>
              <Link 
                href="/contact-us"
                className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Contact Us
              </Link>
            </div>
          </div>

        <div className="relative">
  <div className="absolute -inset-4 rounded-[2rem] bg-amber-400/20 blur-3xl" />

  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl">
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-amber-100 via-white to-purple-100">
      <Image
        src="/images/About Us Image.png"
        alt="About Alokit Gems & Jewels"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  </div>
</div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="rounded-3xl bg-stone-950 p-8 text-white shadow-sm">
          <Users className="h-10 w-10 text-amber-300" />
          <h2 className="mt-6 text-3xl font-semibold">Who We Are</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Alokit Gems And Jewels Private Limited is a dedicated spiritual and
            lifestyle brand based in India.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-base leading-8 text-stone-600">
            We are committed to offering{" "}
            <strong className="text-stone-950">
              authentic, certified, and energetically aligned products
            </strong>
            . From carefully sourced gemstones to sacred Rudraksha beads and
            spiritually inspired jewellery, every product we offer is chosen
            with intention, purity, and purpose.
          </p>
        </div>
      </section>

      {/* Offerings */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              <Sparkles className="h-4 w-4" />
              What We Offer
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Spiritual products made for balance, success, protection, and
              positivity
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <div
                key={item}
                className="group rounded-2xl border border-stone-200 bg-stone-50 p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm group-hover:bg-amber-100">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-semibold text-stone-950">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="sticky top-24">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-700">
                Our Philosophy
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Built on authenticity, trust, and energy alignment
              </h2>
              <p className="mt-5 text-base leading-8 text-stone-600">
                At Alokit, every product is selected with care and intention.
                We do not just sell spiritual items — we help you choose what is
                right for you.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-amber-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-amber-700">
                        0{index + 1}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-stone-950">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-stone-600">
                        {pillar.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-stone-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
                Why Choose Us?
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Trusted spiritual guidance with authentic products
              </h2>

              <p className="mt-5 text-base leading-8 text-stone-300">
                We combine traditional knowledge, customer-first support, and
                genuine sourcing to help you find products aligned with your
                spiritual journey.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {whyChooseUs.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <CheckCircle2 className="mb-4 h-6 w-6 text-amber-300" />
                  <p className="text-sm font-semibold leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <Eye className="h-10 w-10 text-amber-700" />
          <h2 className="mt-5 text-2xl font-semibold text-stone-950">
            Our Vision
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            To become a trusted global brand in spiritual wellness by delivering
            authentic products that empower individuals to live with clarity,
            confidence, and positive energy.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <Target className="h-10 w-10 text-amber-700" />
          <h2 className="mt-5 text-2xl font-semibold text-stone-950">
            Our Mission
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            To make spiritual tools accessible, reliable, and meaningful for
            everyone seeking growth, healing, and transformation in their lives.
          </p>
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-amber-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <Star className="mx-auto h-12 w-12 text-amber-600" />

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Our Commitment
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-stone-700">
            Every order you place with us carries not just a product, but a
            promise — a promise of{" "}
            <strong>quality, authenticity, and positive intention</strong>.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-stone-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <Leaf className="mx-auto h-12 w-12 text-amber-300" />

          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
            Join the Alokit Journey
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-300">
            Whether you are looking for protection, prosperity, love, or inner
            peace, we are here to guide you every step of the way.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-amber-100">
            When energy aligns, life transforms.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="rounded-full bg-amber-400 px-7 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
            >
              Shop Now
            </Link>

            <Link
              href="/contact-us"
              className="rounded-full border border-white/15 bg-white/10 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Get Guidance
            </Link>
          </div>

          <div className="mt-10">
            <p className="text-xl font-semibold">Alokit Gems & Jewels</p>
            <p className="mt-1 text-sm italic text-amber-200">
              Brilliance Of Trust
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}