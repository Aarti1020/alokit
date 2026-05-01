import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cinzel, Jost } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alokit — Gems & Jewels",
  description:
    "Authentic certified gemstones, rudraksha, crystals and sacred jewellery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${cinzel.variable} ${jost.variable} font-jost bg-stone-50 text-stone-800 antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>

              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#92400e",
                      secondary: "#fffbeb",
                    },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}