// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "user" | "admin" | "superAdmin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// ─── Category / SubCategory ──────────────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive?: boolean;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string | Category;
  isActive?: boolean;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export type ProductType = "gemstone" | "rudraksha" | "bracelet" | "jewellery" | "crystal";

export interface ProductSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
}

export interface ProductVariant {
  label: string;
  value: string;
  price: number;
  salePrice: number;
  stock: number;
  sku: string;
  image: string;
}

export interface ProductImageVariants {
  original: string;
  thumbnail: string;
  productCard: string;
  productDetail: string;
}

export interface ProductImage {
  public_id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  variants?: ProductImageVariants;
}

export interface Product {
  _id: string;
  name: string;
  title: string;
  slug: string;
  sku: string;
  category: string | Category;
  subCategory: string | SubCategory;
  productType: ProductType;
  shortDescription: string;
  description: string;
  featuredImage: string;
  galleryImages: string[];
  images: ProductImage[];
  thumbnail: string;
  basePrice: number;
  salePrice: number;
  emiPrice: number;
  stock: number;
  inStock: boolean;
  status: "draft" | "published" | "active" | "inactive";
  isFeatured: boolean;
  showOnHomepage: boolean;
  tags: string[];
  origin: string;
  shape: string;
  style: string;
  weightCarat: number;
  weightRatti: number;
  certificationLab: string;
  treatment: string;
  specifications: Record<string, unknown>;
  variants: ProductVariant[];
  collections: string[];
  seoTitle: string;
  seoDescription: string;
  seo: ProductSeo;
  createdAt: string;
  updatedAt: string;
  // virtuals
  primaryImage: string;
  effectivePrice: number;
  primaryImageData?: ProductImage | null;
  listingCard?: {
    id: string;
    title: string;
    slug: string;
    productType: ProductType;
    image: string;
    basePrice: number;
    salePrice: number;
    effectivePrice: number;
    emiPrice: number;
    inStock: boolean;
    isFeatured: boolean;
    stock: number;
    isOutOfStock: boolean;
    canAddToCart: boolean;
    isLowStock: boolean;
    stockMessage: string;
    imageData?: ProductImage | null;
  };
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  _id: string;
  itemId?: string;
  product: Product;
  productId?: string;
  productName?: string;
  productSlug?: string;
  featuredImage?: string;
  thumbnail?: string;
  quantity: number;
  selectedVariant?: { label: string; value: string } | null;
  unitPrice: number;
  finalPrice: number;
  lineTotal: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  pricing?: {
    subtotal: number;
    discount: number;
    shippingCharge: number;
    tax: number;
    total: number;
  };
  totals: {
    subtotal: number;
    discount: number;
    shippingCharge?: number;
    tax?: number;
    total: number;
    itemCount: number;
  };
}

// ─── Order ────────────────────────────────────────────────────────────────────
export interface Address {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  _id: string;
  product: string | Product;
  productName: string;
  productSlug: string;
  featuredImage: string;
  thumbnail: string;
  sku: string;
  productType: string;
  quantity: number;
  unitPrice: number;
  finalPrice: number;
  lineTotal: number;
  selectedVariant?: Record<string, unknown> | null;
}

export type OrderStatus = "created" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    shippingCharge: number;
    tax: number;
    total: number;
  };
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  paymentMethod: "razorpay";
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    verifiedAt?: string;
  };
  placedAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  _id: string;
  product: string | Product;
  name: string;
  email?: string;
  rating: number;
  title?: string;
  comment: string;
  status: "pending" | "approved" | "rejected" | "hidden" | "spam";
  isFeatured: boolean;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<string, number>;
}

// ─── Collection ───────────────────────────────────────────────────────────────
export interface Collection {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  heroImage?: string;
  thumbnail?: string;
  productType?: ProductType | "";
  isFeatured: boolean;
  showOnHomepage: boolean;
  status: "draft" | "published";
  seo?: ProductSeo;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  tags: string[];
  category?: string;
  authorName?: string;
  status: "draft" | "published";
  isFeatured: boolean;
  publishedAt?: string;
  readTime?: number;
  createdAt: string;
}

// ─── Banner ───────────────────────────────────────────────────────────────────
export interface Banner {
  _id: string;
  title: string;
  slug: string;
  type: "hero" | "promo" | "category" | "popup" | "announcement";
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  page: string;
  status: "active" | "inactive";
  isClickable: boolean;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface Wishlist {
  _id: string;
  user: string;
  items: Array<{
    itemId: string;
    addedAt: string;
    product: Product;
  }>;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

// ─── API Generic ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
