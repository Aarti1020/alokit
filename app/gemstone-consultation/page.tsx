// app/gemstone-consultation/page.tsx

import Image from "next/image";
import {
  Check,
  Smile,
  Star,
  Target,
  Gem,
  Sparkles,
  Heart,
  HandHeart,
  Shield,
  Activity,
  Gift,
  Clock,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import RashiSlider from "@/components/RashiSlider";

const testimonials = [
  {
    name: "Adarsh Trivedi",
    image: "/images/testimonial-1.jpg",
    text: "Do saal ki mehnat ke baad, mujhe Employee of the Month ka title mila aur meri salary mein 63% ki hike hui. Yeh sab Pandit ji ki gemstone consultation ka asar hai. Radhe Radhe 🙏",
  },
  {
    name: "Akash Sharma",
    image: "/images/testimonial-2.jpg",
    text: "Mujhe apne business mein stuck payments ki wajah se kaafi tension ho rahi thi. Lekin Pandit ji ki gemstone consultation ke baad, maine jo stones use kiye, unse 6 mahine mein meri payments clear ho gayi.",
  },
  {
    name: "Rishika Shah",
    image: "/images/testimonial-3.jpg",
    text: "Mujhe apni partner se commitment issues the, aur mujhe laga ki humari relationship khatam ho jayegi. Lekin Pandit ji ki consultation ke baad, hum engaged hain!",
  },
];

const benefits = [
  {
    icon: Gem,
    title: "Dhan Ki Bharmaar",
    desc: "Sahi Rashi Ratn se apne liye samriddhi aur dhan ka raasta kholen.",
  },
  {
    icon: Sparkles,
    title: "Business Aur Career Mein Tarakki",
    desc: "Sahi Rashi Ratn se apne career aur business ko nayi unchaiyon tak le jaayein.",
  },
  {
    icon: HandHeart,
    title: "Khushhaal Shaadi",
    desc: "Sahi gemstones ke saath apne rishtey mein pyaar aur samajh ka sukoon paayein.",
  },
  {
    icon: Heart,
    title: "Paayein Apne Sapno Ka Pyaar",
    desc: "Sahi Rashi Ratn se apni zindagi mein true love ko attract karein.",
  },
  {
    icon: Activity,
    title: "Apni Sehat Ko Behtar Banayein",
    desc: "Sahi Rashi Ratn se apni sehat aur vitality ko behtar banayein.",
  },
  {
    icon: Shield,
    title: "Buri Nazar Se Bache",
    desc: "Sahi Rashi Ratn se negative energies se suraksha paakar jeevan mein shanti laayein.",
  },
];

const bonuses = [
  {
    title: "Palmistry Secrets",
    price: "₹999",
    image: "/images/Consultation Page Palm Image.png",
    desc: "Apne haath ki lakeeron se jaaniye kaise yeh aapki strengths, jeevan ki chunautiyan, aur kismat dikhate hain, jo samriddhi, dhan, aur jeevan mein success ki sambhavnayein samajhne mein madad karte hain.",
  },
  {
    title: "Vedic Astrology 101",
    price: "₹999",
    image: "/images/Consultation Page Kundli Wheel.png",
    desc: "Jaaniye kaise grahon ki gati, aapki janam kundali, aur zodiac signs aapki zindagi ko prabhavit karte hain, aur pyaar, career, aur personal growth mein behtar decisions lene mein madad karte hain",
  },
];

function CTAButton() {
  return (
    <Link
      href="/gemstone-consultation-form"
      className="group inline-flex w-full max-w-xl items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-500 px-6 py-4 text-center text-base font-bold text-white shadow-[0_12px_30px_rgba(147,51,234,0.35)] transition hover:scale-[1.02] hover:shadow-[0_18px_45px_rgba(147,51,234,0.45)] sm:text-lg"
    >
      <Headphones className="h-5 w-5 transition group-hover:rotate-12" />
      Know your correct gemstone now @ Rs.111/- Only
    </Link>
  );
}
const faqs = [
  {
    question: "What does the consultation include?",
    answer:
      "Our consultation includes a detailed analysis of your Kundli (birth chart), palm, or face reading by experienced astrologers. Based on your life concerns (career, finance, health, relationships), we provide personalized guidance along with suitable recommendations like gemstones, Rudraksha, or spiritual remedies."  },
  {
    question: "How will the consultation be conducted?",
    answer:
      "The consultation is conducted via a phone call or WhatsApp call at your scheduled time. Once you book, our team will contact you to confirm your details and connect you with the astrologer."  },
  {
    question: "What details are required for Kundli reading?",
    answer:
      "For accurate Kundli analysis, you need to provide: Date of Birth, Time of Birth and Place of Birth If you don’t have exact birth time, alternative methods like palm or face reading can also be used."  
    },
  {  question:"Are the gemstone and Rudraksha recommendations authentic and necessary?",
    answer:
    "Our astrologers suggest remedies based on your individual chart and needs. While recommendations like gemstones or Rudraksha can support your journey, the final decision to purchase is completely yours. We focus on guidance, not forceful selling."
  },
  {question:"Is my personal information kept confidential?",
    answer:"Absolutely. All your personal details and consultation discussions are kept strictly private and confidential. We respect your trust and ensure complete data security."
  }
];

export default function GemstoneConsultationPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#171c3a] text-white">
      {/* HERO */}
      <section className="relative border-b border-white/10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.18),transparent_35%)]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            सही रत्न धारण करने से आपको
          </h1>

          <div className="mt-5 space-y-1 text-sm font-semibold text-white sm:text-base">
            <p className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              Saccha pyar dila sakta hai
            </p>
            <p className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              Beshumar daulat dila sakta hai
            </p>
            <p className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              Lambi umar dila sakta hai
            </p>
          </div>

          <p className="mt-6 text-sm font-medium text-indigo-200 sm:text-base">
            Abhi janiye apke liye konsa gemstone sahi hai, humare pandit ji se
            connect karke
          </p>

          <div className="mt-6 w-full max-w-4xl overflow-hidden rounded-2xl bg-black/30 shadow-2xl ring-1 ring-white/10">
            <Image
              src="/images/Consultation Page Main Image.png"
              alt="Talk to an expert and discover your lucky gemstone"
              width={1200}
              height={650}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3">
              <Smile className="h-10 w-10" />
              <div className="text-left">
                <p className="text-lg font-extrabold">4987+</p>
                <p className="text-sm font-semibold">Consultations</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Star className="h-10 w-10" />
              <div className="text-left">
                <p className="text-lg font-extrabold">4.8/5</p>
                <p className="text-sm font-semibold">Average rating</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Target className="h-10 w-10" />
              <div className="text-left">
                <p className="text-lg font-extrabold">100%</p>
                <p className="text-sm font-semibold">Accurate Predictions</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm font-semibold">
            Talk to our celebrity astrologers by booking consultation call right
            now.
          </p>

          <div className="mt-5 w-full">
            <CTAButton />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-white/10 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Ek sahi{" "}
            <span className="text-amber-200">Rashi Ratna</span> aapki zindagi
            badal sakta hai!
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border-[6px] border-purple-700 bg-white px-6 py-10 text-center text-slate-800 shadow-xl"
              >
                <div className="mb-6 flex items-center justify-center gap-2 text-3xl text-amber-400">
                  <span>—</span>
                  <span>★★★★★</span>
                  <span>—</span>
                </div>

                <p className="mx-auto max-w-md text-sm font-medium leading-7 text-slate-600 sm:text-base">
                  {item.text}
                </p>

                <div className="mt-7 flex flex-col items-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <p className="mt-4 text-sm font-extrabold text-black">
                    - {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-white" />
          </div>

          <div className="mx-auto mt-6 max-w-4xl">
            <p className="text-lg font-bold sm:text-xl">
              💎 Kya aap jaante hain?
            </p>
            <p className="mt-2 text-lg font-semibold leading-8 sm:text-xl">
              Sahi rashi ratna aapko aasman ki ucchaiyon tak le ja sakta hai
              lekin galat ratna ki wajah se jeevan ki kathnaiyan bahut bad
              sakti hai!
            </p>

            <p className="mt-7 text-lg font-semibold sm:text-xl">
              ✨ Janiye, kaunsa Rashi Ratna aapko zindagi mein wealth, health,
              aur success dega
            </p>

            <div className="mt-5">
              <CTAButton />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="border-b border-white/10 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">
            Sahi <span className="font-extrabold text-amber-100">Rashi Ratn</span>{" "}
            Dharan Karne Ke Fayde
          </h2>

          <p className="mt-3 text-lg font-semibold text-white sm:text-xl">
            Kundali ke hisaab se chuna gaya Rashi Ratn aapko zindagi mein deta
            hain:
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                key={item.title}
                className="h-[440px] w-full max-w-[365px] rounded-[2rem] bg-[#F5E7C6] px-8 py-10 text-center text-black shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mx-auto flex h-[150px] w-[150px] items-center justify-center text-black/80">
                  <Icon className="h-[130px] w-[130px] stroke-[1.35]" />
                </div>

                <h3 className="mt-6 text-[24px] font-extrabold leading-snug">
                  {item.title}
                </h3>

                <p className="mt-5 text-[21px] font-medium leading-[1.45]">
                  {item.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BONUSES */}
     <section
  id="book-now"
  className="px-4 py-12 text-center sm:px-6 sm:py-14 lg:px-8"
>
  <div className="mx-auto w-full max-w-5xl">
    <p className="text-sm font-extrabold sm:text-base">
      Book Your 1-On-1 Consultation To Get
    </p>

    <h2 className="mt-1 text-3xl font-extrabold text-amber-100 sm:text-4xl lg:text-5xl">
      2 Exclusive Bonuses
    </h2>

    <div className="mx-auto mt-10 grid w-full max-w-4xl grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
      {bonuses.map((bonus) => (
        <div
          key={bonus.title}
          className="relative flex w-full max-w-[360px] flex-col rounded-3xl bg-white px-5 pb-7 pt-6 text-black shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:px-6 sm:pb-8"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-500 px-7 py-2 text-xs font-extrabold text-white sm:px-9 sm:text-sm">
            BONUS
          </div>

          <div className="flex h-[220px] w-full items-center justify-center sm:h-[260px]">
            <Image
              src={bonus.image}
              alt={bonus.title}
              width={320}
              height={260}
              className="h-full w-full object-contain"
            />
          </div>

          <h3 className="mt-4 text-xl font-extrabold leading-tight sm:text-2xl">
            {bonus.title}
          </h3>

          <p className="mt-1 text-xl font-extrabold sm:text-2xl">
            {bonus.price}
          </p>

          <p className="mx-auto mt-5 max-w-xs text-sm font-medium leading-6 text-slate-700 sm:text-base sm:leading-7">
            {bonus.desc}
          </p>
        </div>
      ))}
    </div>

    <div className="mx-auto mt-8 w-full max-w-3xl rounded-3xl bg-white px-4 py-6 text-black shadow-2xl sm:px-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <Gift className="h-8 w-8 flex-shrink-0 text-orange-400 sm:mt-1" />

        <p className="text-base font-bold leading-7 sm:text-lg">
          Rukawatein door karein aur kundali ke hisaab se chuna gaya sahi
          Rashi Ratn ke saath health, wealth aur success aaj hi laayen.
        </p>
      </div>

      <div className="mt-6">
        <CTAButton />
      </div>
    </div>

    <p className="mx-auto mt-4 max-w-md text-xs font-bold leading-5 sm:max-w-none">
      REGISTER BEFORE MIDNIGHT TO Unlock All Bonuses Worth Rs. 10,500
    </p>
  </div>
</section>
      <section>
        <RashiSlider />
      </section>
{/* FAQ SECTION */}
<section className="bg-[#f8ebc9] px-4 py-14 text-black sm:px-6 lg:px-8">
  <div className="mx-auto max-w-5xl text-center">
    <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
      Frequently Asked Questions
    </h2>

    <div className="mx-auto mt-10 max-w-4xl space-y-5 text-left">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          className="group overflow-hidden rounded-xl bg-[#171c3a] shadow-md"
          open={index === null}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-semibold text-white sm:text-2xl">
            <span className="flex items-center gap-3">
              <span className="h-5 w-5 rounded-full border-2 border-white bg-white transition group-open:bg-purple-500" />
              {faq.question}
            </span>

            <span className="text-2xl leading-none text-white transition group-open:rotate-45">
              +
            </span>
          </summary>

          <div className="border-t border-white/10 px-6 pb-6 pt-1 text-base leading-7 text-indigo-100">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  </div>
</section>
   
    </main>
  );
}