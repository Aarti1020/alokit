"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
 
  const whatsappUrl = "https://wa.me/message/DDZJUV2BK6FJC1";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      
      
      transition={{ duration: 0.25 }}
      className="fixed bottom-24 right-5 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.45)] ring-4 ring-white/80 transition hover:shadow-[0_14px_38px_rgba(37,211,102,0.6)] sm:right-6"
    >
      <Image
        src="/images/whatsapp-logo.png"
        alt="WhatsApp"
        width={34}
        height={34}
        className="h-8 w-8 object-contain"
      />

      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </motion.a>
  );
}