"use client";
import Link from "next/link";
import { useState } from "react";
import { newsletterApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Share2, Tv2, Video } from "lucide-react";
import ScrollToTopButton from "./ScrollToTopButton";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };
 type SocialLink = {
  name: string;
  href: string;
  image: string;
};

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1BZ6S6wZk8/",
    image: "/images/flogo.jpg",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@alokitgemsandjewels?si=pBaSxgJ3JEVAyEh0",
    image: "/images/ylogo.webp",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/alokitgemsandjewels?igsh=eDFyaXQ0Y3I1c256",
    image: "/images/instalogo.avif",
  },
  {
    name: "Pinterest",
    href: "https://x.com/AlokitGems",
    image: "/images/pplogo.png",
  },
];

  return (
    <footer className="bg-amber-50 text-amber-200">
      {/* Newsletter */}
      {/* <div className="bg-amber-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-cinzel text-xl font-bold text-black mb-1">Join Our Sacred Circle</h3>
            <p className="text-black text-sm font-jost">Get spiritual guidance, new arrivals & exclusive offers.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-amber-800 border border-amber-700 text-black placeholder-amber-500 rounded-xl px-4 py-2.5 text-sm font-jost outline-none focus:border-amber-500 w-full md:w-64"
              required
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-sm font-jost font-medium transition-colors whitespace-nowrap"
            >
              {subscribing ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div> */}

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="font-cinzel text-2xl font-bold text-black mb-3">ALOKIT GEMS & JEWELS</h2>
          <h4 className="text-black mb-2">CIN : U46697MH2026PTC470645</h4>
          <h4 className="text-black mb-2">GST : 27ABFCA4767P1ZY</h4>
          <p className="text-black text-sm font-jost leading-relaxed mb-5">
            Authentic certified gemstones, rudraksha & sacred products for spiritual growth and cosmic alignment.
          </p>
         <div className="flex items-center gap-4">
 {socialLinks
  .filter((social): social is SocialLink => Boolean(social))
  .map((social) => (
    <a
      key={social.name}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.name}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-stone-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50 hover:ring-amber-300"
    >
      <Image
        src={social.image}
        alt={`${social.name} logo`}
        width={22}
        height={22}
        className="h-5 w-5 object-contain"
      />
    </a>
  ))}
</div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-cinzel text-black font-semibold mb-4 tracking-wide">Shop</h4>
          <ul className="space-y-2.5 text-sm font-jost">
            {[
              { label: "Gemstones", href: "/products?productType=gemstone" },
              { label: "Rudraksha", href: "/products?productType=rudraksha" },
              { label: "Bracelets", href: "/products?productType=bracelet" },
              // { label: "Jewellery", href: "/products?productType=jewellery" },
              // { label: "Crystals", href: "/products?productType=crystal" },
              { label: "More Collections", href: "/more-collection" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-black hover:text-amber-200 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-cinzel text-black font-semibold mb-4 tracking-wide">Information</h4>
          <ul className="space-y-2.5 text-sm font-jost">
            {[
              { label: "About Us", href: "/our-story" },
              // { label: "Blog", href: "/blog" },
              // { label: "FAQs", href: "/faq-page" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-conditions" },
              { label: "Refund Policy", href: "/refund-policy" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-black hover:text-amber-900 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-cinzel text-black font-semibold mb-4 tracking-wide">Contact</h4>
          <ul className="space-y-3 text-sm font-jost">
            <li className="flex gap-3 items-start text-black">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Amrut Plaza, Office no. 304, 3rd Floor, Chendani Koliwada, Station Road, Thane(W),Maharashtra, India</span>
            </li>
            <li className="flex gap-3 items-center text-black">
              <Phone className="w-4 h-4 shrink-0" />
              <span>+91 7039222272</span>
            </li>
            <li className="flex gap-3 items-center text-black">
              <Mail className="w-4 h-4 shrink-0" />
              <span>contact@alokit.co</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-amber-900 py-5 text-center">
        <p className="text-black text-xs font-jost">© {new Date().getFullYear()} Alokit Gems & Jewels Pvt. Ltd. All rights reserved.</p>
          <ScrollToTopButton />
      </div>
    </footer>
  );
}
