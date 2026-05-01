"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Menu,
  Search,
  X,
  ChevronDown,
  Gem,
  CircleDot,
  Calculator,
  BookOpen,
  Hexagon,
  Orbit,
  ShoppingCart,
  LogIn,
  Search as SearchIcon,
  HexagonIcon,
  BookOpenCheck,
  Phone,
  ArrowRight,
  User,
  Package,
  LogOut,
  Circle,
} from "lucide-react";
import { categoryApi, subCategoryApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import CertifiedMarquee from "./CertifiedMarquee";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  category:
    | string
    | {
        _id: string;
        name?: string;
        slug?: string;
      };
};

type NavCategory = Category & {
  children: SubCategory[];
};

type SearchSuggestion = {
  label: string;
  href: string;
};

type User = {
  fullName?: string;
};

type NavbarProps = {
  user?: User | null;
  logout?: () => void;
  itemCount?: number;
};

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();

  if (s.includes("gemstone") || s.includes("gem")) {
    return <Gem className="h-4 w-4 text-amber-700" strokeWidth={1.5} />;
  }

  if (s.includes("rudraksha") || s.includes("rudra")) {
    return <Orbit className="h-4 w-4 text-amber-700" strokeWidth={1.5} />;
  }

  if (s.includes("bracelet") || s.includes("bangle")) {
    return <CircleDot className="h-4 w-4 text-amber-700" strokeWidth={1.5} />;
  }

  if (s.includes("calculator") || s.includes("calc")) {
    return <Calculator className="h-4 w-4 text-amber-700" strokeWidth={1.5}  />;
  }

  if (s.includes("story") || s.includes("about") || s.includes("blog")) {
    return <BookOpen className="h-4 w-4 text-amber-700" strokeWidth={1.5} />;
  }

  return <Hexagon className="h-4 w-4 text-amber-700" strokeWidth={1.5} />;
};

const megaMenuVariants: Variants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scaleY: 0.97,
    transition: {
      duration: 0.15,
      ease: "easeIn" as const,
    },
  },
};

const simpleDropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.97,
    transition: {
      duration: 0.12,
      ease: "easeIn" as const,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.22,
      ease: "easeOut" as const,
    },
  }),
};

const searchBarVariants: Variants = {
  hidden: { opacity: 0, y: -12, scaleY: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scaleY: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

const mobileSubVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.15,
    },
  },
};
const getProductTypeSlug = (category: Category | NavCategory) => {
  const name = category.name.toLowerCase();
  const slug = category.slug.toLowerCase();

  if (name.includes("bracelet") || slug.includes("bracelet")) {
    return "bracelet";
  }

  if (name.includes("gemstone") || slug.includes("gemstone") || slug.includes("gem")) {
    return "gemstone";
  }

  if (name.includes("rudraksha") || slug.includes("rudraksha") || slug.includes("rudra")) {
    return "rudraksha";
  }

  return category.slug;
};

export default function Navbar(props: NavbarProps) {
  const auth = useAuth();
  const cart = useCart();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const currentUser = props.user ?? auth.user;
  const handleLogout = props.logout ?? auth.logout;
  const currentItemCount = cart.itemCount ?? props.itemCount ?? 0;

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileCategoryId, setOpenMobileCategoryId] = useState<string | null>(
    null
  );
  const [mobileSupportOpen, setMobileSupportOpen] = useState(false);

  useEffect(() => {
    const loadNavbarData = async () => {
      try {
        const [categoryResponse, subCategoryResponse] = await Promise.all([
          categoryApi.list(),
          subCategoryApi.list(),
        ]);

        const categoryData = Array.isArray(categoryResponse?.data)
          ? categoryResponse.data
          : [];

        const subCategoryData = Array.isArray(subCategoryResponse?.data)
          ? subCategoryResponse.data
          : [];

        setCategories(categoryData.filter((item) => item.isActive !== false));
        setSubCategories(
          subCategoryData.filter((item) => item.isActive !== false)
        );
      } catch (error) {
        console.error("Failed to load navbar data:", error);
        setCategories([]);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    void loadNavbarData();
  }, []);

const navCategories: NavCategory[] = useMemo(() => {
  const order = ["gemstone", "rudraksha", "bracelet"];

  return categories
    .filter((category) => {
      const name = category.name.toLowerCase();
      const slug = category.slug.toLowerCase();

      // Hide More Collection from dynamic dropdown navbar for now
      return (
        !name.includes("more") &&
        !slug.includes("more") &&
        !name.includes("other") &&
        !slug.includes("other")
      );
    })
    .map((category) => {
      const categoryId = String(category._id);

      const children = subCategories.filter((sub) => {
        if (!sub.category) return false;

        if (typeof sub.category === "string") {
          return String(sub.category) === categoryId;
        }

        return String(sub.category._id) === categoryId;
      });

      return { ...category, children };
    })
    .sort((a, b) => {
      const aIndex = order.findIndex((item) =>
        a.slug.toLowerCase().includes(item)
      );

      const bIndex = order.findIndex((item) =>
        b.slug.toLowerCase().includes(item)
      );

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
}, [categories, subCategories]);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = setTimeout(() => searchInputRef.current?.focus(), 60);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    const searchValue = query.trim().toLowerCase();

    if (searchValue.length < 2) {
      setSuggestions([]);
      return;
    }

   const cats: SearchSuggestion[] = navCategories.map((cat) => ({
  label: cat.name,
  href: `/products?productType=${getProductTypeSlug(cat)}`,
}));

    const subs: SearchSuggestion[] = navCategories.flatMap((cat) =>
      cat.children.map((child) => ({
        label: `${child.name} in ${cat.name}`,
        href: `/products?category=${cat._id}&subCategory=${child._id}`,
      }))
    );

    setSuggestions(
      [...cats, ...subs]
        .filter((item) => item.label.toLowerCase().includes(searchValue))
        .slice(0, 8)
    );
  }, [query, navCategories]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    setSearchOpen(false);
    setSuggestions([]);
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMobileCategoryId(null);
    setMobileSupportOpen(false);
  };

  const handleSuggestionClick = () => {
    setSearchOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  const socialLinks = [
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
    <>
      {/* TOP BAR */}
     <div className="w-full border-b border-amber-400/10 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-stone-300">
  <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6">
    {/* Phone */}
    <a
      href="tel:7039222272"
      className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 transition-all duration-300 hover:border-amber-400/30 hover:bg-amber-400/10"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/20 transition group-hover:bg-amber-400/20">
        <Phone className="h-3.5 w-3.5 text-amber-300" />
      </span>

      <span className="hidden font-jost text-xs font-medium tracking-wide text-stone-300 transition group-hover:text-white sm:inline">
        +91 70392 22272
      </span>
    </a>

    {/* Social Links */}
    <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1">
      <div className="flex items-center gap-1.5">
        {socialLinks.map((social, index) => (
          <a
            key={`${social.name}-${index}`}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="group inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400/10 hover:ring-1 hover:ring-amber-400/30"
          >
            <Image
              src={social.image}
              alt={`${social.name} logo`}
              width={24}
              height={24}
              className="h-5 w-5 object-contain transition duration-300 group-hover:scale-110"
            />
          </a>
        ))}
      </div>
    </div>

    {/* Delivery Badge */}
    <div className="flex justify-end">
      <span className="inline-flex items-center rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-300 shadow-sm shadow-amber-950/30 sm:text-[10px] sm:tracking-[0.2em]">
        <span className="hidden sm:inline">Pan India&nbsp;</span>
        Free Delivery
      </span>
    </div>
  </div>
</div>

      {/* MARQUEE BAR */}
   <div>
    <CertifiedMarquee/>
   </div>

      {/* MAIN HEADER */}
<header className="sticky top-0 z-50 border-b border-stone-200 bg-[#faf7f2] shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
          <div className="grid h-20 grid-cols-[110px_1fr_auto] items-center gap-4 lg:h-24 lg:grid-cols-[125px_1fr_auto] lg:gap-6">
            {/* LEFT LOGO */}
            <div className="flex items-center justify-start">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/23.png"
                  alt="Alokit Logo"
                  width={110}
                  height={85}
                  priority
                  className="h-auto w-[96px] object-contain lg:w-[108px]"
                />
              </Link>
            </div>

            {/* CENTER NAV */}
            <nav className="hidden min-w-0 items-center justify-center md:flex">
              {loading ? (
                <div className="flex gap-8">
                  {["Gemstones", "Rudraksha", "Bracelets"].map((t) => (
                    <div
                      key={t}
                      className="h-4 w-20 animate-pulse rounded bg-stone-200"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-w-0 items-center gap-5 whitespace-nowrap lg:gap-7 xl:gap-9">
                  {navCategories.map((category) => (
                    <div
                      key={category._id}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(category._id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                     <Link
                          href={`/products?productType=${getProductTypeSlug(category)}`}
                          className={`relative flex items-center gap-2 py-8 text-[12px] font-semibold uppercase tracking-wide text-stone-700 transition-colors duration-200 hover:text-amber-800 lg:text-[13px] ${
                            activeDropdown === category._id ? "text-amber-800" : ""
                          }`}
                        >
                        <span
                          className={`transition-colors duration-200 ${
                            activeDropdown === category._id
                              ? "text-amber-600"
                              : "text-stone-400"
                          }`}
                        >
                          {getCategoryIcon(category.slug)}
                        </span>

                        {category.name}

                        {category.children.length > 0 && (
                          <motion.span
                            animate={{
                              rotate:
                                activeDropdown === category._id ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-3 w-3 text-stone-400" />
                          </motion.span>
                        )}

                        <motion.span
                          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left rounded-full bg-amber-700"
                          initial={{ scaleX: 0 }}
                          animate={{
                            scaleX: activeDropdown === category._id ? 1 : 0,
                          }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                        />
                      </Link>
                    </div>
                  ))}

                  <Link
                    href="/more-collection"
                    className="flex items-center gap-2 py-8 text-[12px] font-semibold uppercase tracking-wide text-stone-700 transition-colors duration-200 hover:text-amber-800 lg:text-[13px]"
                  >
                    <HexagonIcon
                      className="h-4 w-4 text-amber-700"
                      strokeWidth={1.5}
                    />
                    More Collections
                  </Link>

                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown("support")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      className={`relative flex items-center gap-2 py-8 text-[12px] font-semibold uppercase tracking-wide transition-colors duration-200 lg:text-[13px] ${
                        activeDropdown === "support"
                          ? "text-amber-800"
                          : "text-stone-700 hover:text-amber-800"
                      }`}
                    >
                      <BookOpenCheck
                        className={`h-4 w-4 transition-colors ${
                          activeDropdown === "support"
                            ? "text-amber-600"
                            : "text-amber-700"
                        }`}
                        strokeWidth={1.5}
                      />

                      Support

                      <motion.span
                        animate={{
                          rotate: activeDropdown === "support" ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-3 w-3 text-stone-400" />
                      </motion.span>

                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left rounded-full bg-amber-700"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: activeDropdown === "support" ? 1 : 0,
                        }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === "support" && (
                        <motion.div
                          key="support-dd"
                          variants={simpleDropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 origin-top overflow-hidden rounded-2xl border border-stone-100 bg-white py-2 shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                          onMouseEnter={() => setActiveDropdown("support")}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {[
                            { href: "/our-story", label: "About Us" },
                            { href: "/contact", label: "Contact Us" },
                            { href: "/blog", label: "Blog" },
                          ].map((item, i) => (
                            <motion.div
                              key={item.href}
                              custom={i}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <Link
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-stone-600 transition-colors hover:bg-amber-50 hover:text-amber-800"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                {item.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="hidden min-w-fit items-center justify-end gap-2 md:flex lg:gap-3">
              <button
                onClick={() => setSearchOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-all duration-200 hover:bg-amber-50 hover:text-amber-800"
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5 text-amber-700" />
              </button>

              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-all duration-200 hover:bg-amber-50 hover:text-amber-800"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5 text-amber-700" />

                {currentItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white">
                    {currentItemCount > 9 ? "9+" : currentItemCount}
                  </span>
                )}
              </Link>

              {currentUser ? (
                <div className="group relative">
                  <button className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-amber-800">
                    <User className="h-4 w-4" />
                    {(currentUser.fullName || "Account").split(" ")[0]}
                  </button>

                  <div className="absolute right-0 top-full z-50 mt-2 hidden min-w-[180px] overflow-hidden rounded-2xl border border-stone-100 bg-white py-2 shadow-[0_12px_40px_rgba(0,0,0,0.1)] group-hover:block">
                    {[
                      {
                        href: "/account",
                        icon: <User className="h-3.5 w-3.5" />,
                        label: "My Account",
                      },
                      {
                        href: "/account/orders",
                        icon: <Package className="h-3.5 w-3.5" />,
                        label: "My Orders",
                      },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-5 py-3 text-[13px] text-stone-600 transition-colors hover:bg-amber-50 hover:text-amber-800"
                      >
                        <span className="text-stone-400">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <div className="mx-4 my-1 border-t border-stone-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-5 py-3 text-[13px] text-red-500 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 rounded-full bg-amber-800 px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-amber-900"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}

              <Link
                href="/gemstone-consultation"
                className="flex items-center gap-2 rounded-full bg-amber-800 px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition-colors duration-200 hover:bg-stone-900"
              >
                <Calculator className="h-4 w-4" />
                Consultation
              </Link>
            </div>

            {/* MOBILE RIGHT */}
            <div className="flex items-center justify-end gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700"
                aria-label="Search"
              >
                <SearchIcon className="h-4 w-4 text-amber-700" />
              </button>

              <Link
                href="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-700"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4 text-amber-700" />

                {currentItemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-700 text-[9px] font-bold text-white">
                    {currentItemCount > 9 ? "9+" : currentItemCount}
                  </span>
                )}
              </Link>

              <motion.button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* MEGA MENU */}
        <AnimatePresence>
          {activeDropdown &&
            activeDropdown !== "support" &&
            (() => {
              const activeCat = navCategories.find(
                (c) => c._id === activeDropdown
              );

              if (!activeCat || activeCat.children.length === 0) return null;

              return (
                <motion.div
                  key={`mega-${activeDropdown}`}
                  variants={megaMenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="hidden w-full origin-top border-t border-stone-100 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.1)] md:block"
                  onMouseEnter={() => setActiveDropdown(activeDropdown)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="mx-auto max-w-7xl px-10 py-8">
                    <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold tracking-wide text-stone-900">
                          {activeCat.name}
                        </h3>

                        {activeCat.description && (
                          <p className="mt-0.5 text-xs text-stone-500">
                            {activeCat.description}
                          </p>
                        )}
                      </div>

                        <Link
                          href={`/products?productType=${getProductTypeSlug(activeCat)}`}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-widest text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-900"
                        >
                        View All
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {activeCat.children.map((child, i) => (
                        <motion.div
                          key={child._id}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Link
                            href={`/products?category=${activeCat._id}&subCategory=${child._id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-stone-600 transition-all duration-150 hover:bg-amber-50/80 hover:text-amber-800"
                          >
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-400 transition-colors group-hover:bg-amber-100 group-hover:text-amber-700">
                              {getCategoryIcon(activeCat.slug)}
                            </span>

                            <span className="leading-snug">{child.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
        </AnimatePresence>

        {/* SEARCH BAR */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="search"
              variants={searchBarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="origin-top border-t border-stone-200 bg-white px-6 py-5"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="mx-auto flex max-w-2xl gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search gemstones, rudraksha, bracelets…"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-[13px] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-amber-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-stone-900 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-amber-800"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 text-stone-500 transition-colors hover:bg-stone-100"
                >
                  <X className="h-4 w-4 text-amber-700" />
                </button>
              </form>

              <AnimatePresence>
                {query.length >= 2 && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="mx-auto mt-2 max-w-2xl overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl"
                  >
                    {suggestions.map((s, i) => (
                      <motion.div
                        key={s.href}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={s.href}
                          onClick={handleSuggestionClick}
                          className="flex items-center gap-3 border-b border-stone-50 px-5 py-3 text-[13px] text-stone-600 transition-colors last:border-b-0 hover:bg-amber-50 hover:text-amber-800"
                        >
                          <Search className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                          {s.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="origin-top overflow-hidden border-t border-stone-200 bg-[#faf7f2] md:hidden"
            >
              {loading ? (
                <div className="space-y-3 px-6 py-5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-4 w-32 animate-pulse rounded bg-stone-200"
                    />
                  ))}
                </div>
              ) : (
                <div>
                  {navCategories.map((category, idx) => (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      className="border-b border-stone-200/70"
                    >
                      <button
                        onClick={() =>
                          setOpenMobileCategoryId((prev) =>
                            prev === category._id ? null : category._id
                          )
                        }
                        className="flex w-full items-center justify-between px-6 py-4"
                      >
                        <span className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-wide text-stone-700">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                            {getCategoryIcon(category.slug)}
                          </span>
                          {category.name}
                        </span>

                        {category.children.length > 0 && (
                          <motion.span
                            animate={{
                              rotate:
                                openMobileCategoryId === category._id ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4 text-stone-400" />
                          </motion.span>
                        )}
                      </button>

                      <AnimatePresence>
                        {openMobileCategoryId === category._id &&
                          category.children.length > 0 && (
                            <motion.div
                              variants={mobileSubVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="overflow-hidden bg-amber-50/50"
                            >
                              <Link
                                href={`/products?productType=${getProductTypeSlug(category)}`}
                                onClick={closeMobileMenu}
                                className="flex items-center gap-2 border-b border-amber-100 px-8 py-3 text-[12px] font-bold uppercase tracking-widest text-amber-700"
                              >
                                View All
                                <ArrowRight className="h-3 w-3" />
                              </Link>

                              {category.children.map((child) => (
                                <Link
                                  key={child._id}
                                  href={`/products?category=${category._id}&subCategory=${child._id}`}
                                  onClick={closeMobileMenu}
                                  className="flex items-center gap-3 border-b border-amber-100/70 px-8 py-3 text-[13px] text-stone-600 transition-colors last:border-b-0 hover:text-amber-800"
                                >
                                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                                  {child.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: navCategories.length * 0.05,
                      duration: 0.2,
                    }}
                    className="border-b border-stone-200/70"
                  >
                    <Link
                      href="/more-collection"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-6 py-4 text-[13px] font-semibold uppercase tracking-wide text-stone-700"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                        <HexagonIcon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      More Collection
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: (navCategories.length + 1) * 0.05,
                      duration: 0.2,
                    }}
                    className="border-b border-stone-200/70"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileSupportOpen((prev) => !prev)}
                      className="flex w-full items-center justify-between px-6 py-4"
                    >
                      <span className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-wide text-stone-700">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                          <BookOpenCheck
                            className="h-4 w-4"
                            strokeWidth={1.5}
                          />
                        </span>
                        Support
                      </span>

                      <motion.span
                        animate={{ rotate: mobileSupportOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-stone-400" />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {mobileSupportOpen && (
                        <motion.div
                          variants={mobileSubVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="overflow-hidden bg-amber-50/50"
                        >
                          {[
                            { href: "/our-story", label: "About Us" },
                            { href: "/contact", label: "Contact Us" },
                            { href: "/blog", label: "Blog" },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-3 border-b border-amber-100/70 px-8 py-3 text-[13px] text-stone-600 transition-colors last:border-b-0 hover:text-amber-800"
                            >
                              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="flex flex-col gap-3 bg-white px-6 py-5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSearchOpen(true);
                      }}
                      className="flex items-center gap-3 text-[13px] font-medium text-stone-600"
                    >
                      <Search className="h-4 w-4 text-amber-600" />
                      Search Products
                    </button>

                    <Link
                      href="/gemstone-consultation"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 text-[13px] font-medium text-stone-600"
                    >
                      <Calculator className="h-4 w-4 text-amber-600" />
                      Consultation
                    </Link>

                    <div className="flex flex-col gap-2.5 border-t border-stone-100 pt-3">
                      {currentUser ? (
                        <>
                          <Link
                            href="/account"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 text-[13px] font-medium text-stone-600"
                          >
                            <User className="h-4 w-4 text-amber-600" />
                            My Account
                          </Link>

                          <Link
                            href="/account/orders"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 text-[13px] font-medium text-stone-600"
                          >
                            <Package className="h-4 w-4 text-amber-600" />
                            My Orders
                          </Link>

                          <button
                            onClick={() => {
                              closeMobileMenu();
                              handleLogout();
                            }}
                            className="flex items-center gap-3 text-[13px] font-medium text-red-500"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <Link
                          href="/auth/login"
                          onClick={closeMobileMenu}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-800 py-3 text-[13px] font-bold tracking-wide text-white"
                        >
                          <LogIn className="h-4 w-4" />
                          Login / Sign Up
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}