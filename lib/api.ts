import {
  ApiResponse,
  AuthResponse,
  Banner,
  Blog,
  Cart,
  Category,
  Collection,
  Order,
  PaginatedResponse,
  Product,
  Review,
  ReviewSummary,
  SubCategory,
  User,
} from "@/types";
import { buildApiUrl, buildAssetUrl, buildDisplayImageUrl } from "@/lib/config";

export interface SearchProductSuggestion {
  id: string;
  title: string;
  slug: string;
  productType: string;
  image: string;
}

export interface SearchCategorySuggestion {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

export interface SearchCollectionSuggestion {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  heroImage?: string;
  thumbnail?: string;
}

export interface SearchSuggestionsPayload {
  products: SearchProductSuggestion[];
  collections: SearchCollectionSuggestion[];
  categories: SearchCategorySuggestion[];
  subCategories: SearchCategorySuggestion[];
}

export interface GlobalSearchPayload {
  products?: Product[];
  blogs?: Blog[];
  collections?: Collection[];
  pages?: Array<Record<string, unknown>>;
  categories?: Category[];
  subCategories?: SubCategory[];
}

export interface CmsPage {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  pageType?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface WishlistResponse {
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

export interface CheckoutResponseData {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
  razorpayOrderId: string;
  paymentGatewayMode: "mock" | "live";
  pricing: {
    subtotal: number;
    discount: number;
    shippingCharge: number;
    tax: number;
    total: number;
  };
  items: Array<Record<string, unknown>>;
}

export interface HomepagePayload {
  sections: Array<Record<string, unknown>>;
  banners: Banner[];
  faqs: Array<Record<string, unknown>>;
  featuredBlogs: Blog[];
  featuredCollections: Collection[];
  featuredProducts: Product[];
  featuredReviews: Array<Record<string, unknown>>;
  seo?: Record<string, unknown> | null;
  newsletter?: Record<string, unknown>;
  leadForms?: Record<string, unknown>;
}

export interface RudrakshaCalculatorSubmitBody {
  suggestionBy: "BIRTH" | "MANIFESTATION_LUCK" | "PURPOSE";
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  birthTime?: string;
  placeOfBirth?: string;
}

export interface RudrakshaCalculatorResult {
  id: string;
  recommendation: {
    number: number;
    mukhi: number;
    name: string;
    reason: string;
  };
  profile: {
    birthNumber: number;
    zodiacSign: string;
    dayOfWeek: string;
  };
  products: Array<{
    id: string;
    name: string;
    title: string;
    slug: string;
    productType: string;
    shortDescription: string;
    price: number;
    salePrice: number;
    effectivePrice: number;
    image: string;
    inStock: boolean;
  }>;
}

export interface CollectionProductsPayload {
  collection: Collection;
  products: Product[];
}

type ProductImageType = Product["images"][number];
type ProductImageVariantsType = NonNullable<ProductImageType["variants"]>;

const isProductImage = (image: ProductImageType | null): image is ProductImageType => Boolean(image);

const normalizeProductImageVariants = (variants?: ProductImageVariantsType) =>
  variants
    ? {
        ...variants,
        original: buildAssetUrl(variants.original),
        thumbnail: buildAssetUrl(variants.thumbnail),
        productCard: buildAssetUrl(variants.productCard),
        productDetail: buildAssetUrl(variants.productDetail),
      }
    : variants;

const normalizeProductImage = (
  image: ProductImageType | string | null | undefined,
  fallbackAlt = ""
): ProductImageType | null => {
  if (!image) return null;

  if (typeof image === "string") {
    const url = buildDisplayImageUrl(image);
    return url
      ? {
          public_id: "",
          url,
          alt: fallbackAlt,
          isPrimary: false,
        }
      : null;
  }

  const url = buildDisplayImageUrl(image.url);
  if (!url) return null;

  return {
    ...image,
    url,
    variants: normalizeProductImageVariants(image.variants),
  };
};

const normalizeProduct = (product: Product): Product => {
  const normalizedImages = Array.isArray(product.images)
    ? product.images
        .map((image) => normalizeProductImage(image, product.title || product.name))
        .filter(isProductImage)
    : [];

  const primaryImage =
    buildDisplayImageUrl(product.primaryImage) ||
    buildDisplayImageUrl(product.primaryImageData?.url) ||
    normalizedImages.find((image) => image.isPrimary)?.url ||
    buildDisplayImageUrl(product.featuredImage) ||
    buildDisplayImageUrl(product.thumbnail) ||
    buildDisplayImageUrl(product.galleryImages?.[0]) ||
    normalizedImages[0]?.url ||
    "";

  return {
    ...product,
    variants: Array.isArray(product.variants)
      ? product.variants.map((variant) => ({
          ...variant,
          image: buildDisplayImageUrl(variant.image),
        }))
      : [],
    images: normalizedImages,
    galleryImages: Array.isArray(product.galleryImages)
      ? product.galleryImages.map((image) => buildDisplayImageUrl(image)).filter(Boolean)
      : [],
    featuredImage: buildDisplayImageUrl(product.featuredImage) || primaryImage,
    thumbnail: buildDisplayImageUrl(product.thumbnail) || primaryImage,
    primaryImage,
    primaryImageData: product.primaryImageData
      ? {
          ...product.primaryImageData,
          url: buildDisplayImageUrl(product.primaryImageData.url),
          variants: normalizeProductImageVariants(product.primaryImageData.variants),
        }
      : product.primaryImageData,
    effectivePrice:
      product.effectivePrice ?? (product.salePrice > 0 ? product.salePrice : product.basePrice),
    inStock: product.inStock ?? product.stock > 0,
    listingCard: product.listingCard
      ? {
          ...product.listingCard,
          image: buildDisplayImageUrl(product.listingCard.image),
          imageData: product.listingCard.imageData
            ? {
                ...product.listingCard.imageData,
                url: buildDisplayImageUrl(product.listingCard.imageData.url),
                variants: normalizeProductImageVariants(product.listingCard.imageData.variants),
              }
            : product.listingCard.imageData,
        }
      : product.listingCard,
  };
};

const normalizeCartResponse = (response: ApiResponse<Cart>): ApiResponse<Cart> => ({
  ...response,
  data: (() => {
    const items = Array.isArray(response.data?.items)
      ? response.data.items.map((item) => {
          const normalizedFeaturedImage = buildDisplayImageUrl(
            item.featuredImage || item.thumbnail
          );
          const productSnapshot = normalizeProduct({
            _id:
              typeof item.product === "object" && item.product?._id
                ? item.product._id
                : item.productId || "",
            name:
              typeof item.product === "object" && item.product?.name
                ? item.product.name
                : item.productName || "",
            title:
              typeof item.product === "object" && item.product?.title
                ? item.product.title
                : item.productName || "",
            slug:
              typeof item.product === "object" && item.product?.slug
                ? item.product.slug
                : item.productSlug || "",
            sku: "",
            category:
              typeof item.product === "object" && item.product?.category
                ? item.product.category
                : "",
            subCategory:
              typeof item.product === "object" && item.product?.subCategory
                ? item.product.subCategory
                : "",
            productType:
              typeof item.product === "object" && item.product?.productType
                ? item.product.productType
                : "gemstone",
            shortDescription: "",
            description: "",
            featuredImage: normalizedFeaturedImage,
            galleryImages: normalizedFeaturedImage ? [normalizedFeaturedImage] : [],
            images: normalizedFeaturedImage
              ? [
                  {
                    public_id: "",
                    url: normalizedFeaturedImage,
                    alt: item.productName || "",
                    isPrimary: true,
                  },
                ]
              : [],
            thumbnail: normalizedFeaturedImage,
            basePrice: item.unitPrice || item.finalPrice || 0,
            salePrice: item.finalPrice || 0,
            emiPrice: 0,
            stock: 0,
            inStock: true,
            status: "active",
            isFeatured: false,
            showOnHomepage: false,
            tags: [],
            origin: "",
            shape: "",
            style: "",
            weightCarat: 0,
            weightRatti: 0,
            certificationLab: "",
            treatment: "",
            specifications: {},
            variants: [],
            collections: [],
            seoTitle: "",
            seoDescription: "",
            seo: {
              metaTitle: "",
              metaDescription: "",
              metaKeywords: [],
              ogTitle: "",
              ogDescription: "",
              ogImage: "",
              canonicalUrl: "",
              robots: "index,follow",
            },
            createdAt: "",
            updatedAt: "",
            primaryImage: normalizedFeaturedImage,
            effectivePrice: item.finalPrice || item.unitPrice || 0,
          });

          return {
            ...item,
            _id: item._id || item.itemId || item.productId || "",
            itemId: item.itemId || item._id,
            productId:
              item.productId ||
              (typeof item.product === "string" ? item.product : item.product?._id) ||
              "",
            productName: item.productName || productSnapshot.name,
            productSlug: item.productSlug || productSnapshot.slug,
            featuredImage: normalizedFeaturedImage,
            thumbnail: buildDisplayImageUrl(item.thumbnail || item.featuredImage),
            product:
              typeof item.product === "object" && item.product?._id
                ? normalizeProduct(item.product)
                : productSnapshot,
          };
        })
      : [];
    const subtotal =
      response.data?.pricing?.subtotal ??
      response.data?.totals?.subtotal ??
      items.reduce((sum, item) => sum + Number(item.lineTotal || item.finalPrice * item.quantity || 0), 0);
    const discount = response.data?.pricing?.discount ?? response.data?.totals?.discount ?? 0;
    const shippingCharge = response.data?.pricing?.shippingCharge ?? response.data?.totals?.shippingCharge ?? 0;
    const tax = response.data?.pricing?.tax ?? response.data?.totals?.tax ?? 0;
    const total =
      response.data?.pricing?.total ??
      response.data?.totals?.total ??
      subtotal - discount + shippingCharge + tax;
    const itemCount =
      response.data?.totals?.itemCount ??
      items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    return {
      ...response.data,
      items,
      pricing: {
        subtotal,
        discount,
        shippingCharge,
        tax,
        total,
      },
      totals: {
        subtotal,
        discount,
        shippingCharge,
        tax,
        total,
        itemCount,
      },
    };
  })(),
});

const normalizeOrdersResponse = (response: ApiResponse<Order[]>): ApiResponse<Order[]> => ({
  ...response,
  data: Array.isArray(response.data)
    ? response.data.map((order) => ({
        ...order,
        items: Array.isArray(order.items)
          ? order.items.map((item) => ({
              ...item,
              featuredImage: buildDisplayImageUrl(item.featuredImage),
              thumbnail: buildDisplayImageUrl(item.thumbnail),
              product:
                item.product && typeof item.product === "object"
                  ? normalizeProduct(item.product)
                  : item.product,
            }))
          : [],
      }))
    : [],
});

const normalizeOrderResponse = (response: ApiResponse<Order>): ApiResponse<Order> => ({
  ...response,
  data: normalizeOrdersResponse({ ...response, data: [response.data] }).data[0],
});

const normalizeProductListResponse = (response: PaginatedResponse<Product>): PaginatedResponse<Product> => ({
  ...response,
  data: Array.isArray(response.data) ? response.data.map(normalizeProduct) : [],
});

const normalizeProductResponse = (response: ApiResponse<Product>): ApiResponse<Product> => ({
  ...response,
  data: normalizeProduct(response.data),
});

const normalizeProductsResponse = (response: ApiResponse<Product[]>): ApiResponse<Product[]> => ({
  ...response,
  data: Array.isArray(response.data) ? response.data.map(normalizeProduct) : [],
});

const normalizeWishlistResponse = (
  response: ApiResponse<WishlistResponse>
): ApiResponse<WishlistResponse> => ({
  ...response,
  data: {
    ...response.data,
    items: Array.isArray(response.data?.items)
      ? response.data.items.map((item) => ({
          ...item,
          product: normalizeProduct(item.product),
        }))
      : [],
  },
});

const normalizeCollectionProductsResponse = (
  response: ApiResponse<CollectionProductsPayload>
): ApiResponse<CollectionProductsPayload> => ({
  ...response,
  data: {
    ...response.data,
    products: Array.isArray(response.data?.products)
      ? response.data.products.map(normalizeProduct)
      : [],
  },
});

const normalizeHomepageResponse = (
  response: ApiResponse<HomepagePayload>
): ApiResponse<HomepagePayload> => ({
  ...response,
  data: {
    ...response.data,
    banners: Array.isArray(response.data?.banners)
      ? response.data.banners.map((banner) => ({
          ...banner,
          image: buildDisplayImageUrl(banner.image),
          mobileImage: buildDisplayImageUrl(banner.mobileImage),
        }))
      : [],
    featuredBlogs: Array.isArray(response.data?.featuredBlogs)
      ? response.data.featuredBlogs.map((blog) => ({
          ...blog,
          featuredImage: buildDisplayImageUrl(blog.featuredImage),
        }))
      : [],
    featuredCollections: Array.isArray(response.data?.featuredCollections)
      ? response.data.featuredCollections.map((collection) => ({
          ...collection,
          heroImage: buildDisplayImageUrl(collection.heroImage),
          thumbnail: buildDisplayImageUrl(collection.thumbnail),
        }))
      : [],
    featuredProducts: Array.isArray(response.data?.featuredProducts)
      ? response.data.featuredProducts.map(normalizeProduct)
      : [],
  },
});

const normalizeRudrakshaCalculatorResponse = (
  response: ApiResponse<RudrakshaCalculatorResult>
): ApiResponse<RudrakshaCalculatorResult> => ({
  ...response,
  data: {
    ...response.data,
    products: Array.isArray(response.data?.products)
      ? response.data.products.map((product) => ({
          ...product,
          image: buildDisplayImageUrl(product.image),
          effectivePrice: product.effectivePrice || product.salePrice || product.price || 0,
        }))
      : [],
  },
});

// ─── helpers ─────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("alokit_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(buildApiUrl(path), { ...options, headers });
  const raw = await res.text();
  const json = raw ? JSON.parse(raw) : null;
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: { fullName: string; email: string; password: string; phone?: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => request<ApiResponse<User>>("/auth/me", {}, true),

  forgotPassword: (email: string) =>
    request<ApiResponse<null>>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (body: { token: string; password: string; confirmPassword: string }) =>
    request<ApiResponse<null>>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoryApi = {
  list: () => request<ApiResponse<Category[]>>("/categories"),
  get: (id: string) => request<ApiResponse<Category>>(`/categories/${id}`),
};

export const subCategoryApi = {
  list: () => request<ApiResponse<SubCategory[]>>("/subcategories"),
  get: (id: string) => request<ApiResponse<SubCategory>>(`/subcategories/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subCategory?: string;
  productType?: string;
  collection?: string;
  featured?: boolean;
  showOnHomepage?: boolean;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "latest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
}

export const productApi = {
  list: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
    return request<PaginatedResponse<Product>>(`/products?${params}`).then(normalizeProductListResponse);
  },

  get: (slug: string) => request<ApiResponse<Product>>(`/products/${slug}`).then(normalizeProductResponse),

  related: (slug: string) =>
    request<ApiResponse<Product[]>>(`/products/${slug}/related`).then(normalizeProductsResponse),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  get: () => request<ApiResponse<Cart>>("/cart", {}, true).then(normalizeCartResponse),

  add: (productId: string, quantity = 1, selectedVariant?: { label: string; value: string }) =>
    request<ApiResponse<Cart>>("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, selectedVariant }),
    }, true).then(normalizeCartResponse),

  updateItem: (itemId: string, quantity: number) =>
    request<ApiResponse<Cart>>(`/cart/item/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }, true).then(normalizeCartResponse),

  removeItem: (productId: string) =>
    request<ApiResponse<Cart>>(`/cart/remove/${productId}`, { method: "DELETE" }, true).then(normalizeCartResponse),

  clear: () => request<ApiResponse<null>>("/cart/clear", { method: "DELETE" }, true),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlistApi = {
  get: () => request<ApiResponse<WishlistResponse>>("/wishlist", {}, true).then(normalizeWishlistResponse),

  add: (productId: string) =>
    request<ApiResponse<WishlistResponse>>("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }, true).then(normalizeWishlistResponse),

  remove: (productId: string) =>
    request<ApiResponse<WishlistResponse>>(`/wishlist/remove/${productId}`, { method: "DELETE" }, true).then(normalizeWishlistResponse),

  clear: () => request<ApiResponse<null>>("/wishlist/clear", { method: "DELETE" }, true),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface CheckoutBody {
  shippingAddress: {
    fullName: string; email: string; phone: string;
    addressLine1: string; addressLine2?: string;
    city: string; state: string; postalCode: string; country: string;
  };
  billingAddress?: {
    fullName: string; email: string; phone: string;
    addressLine1: string; addressLine2?: string;
    city: string; state: string; postalCode: string; country: string;
  };
  paymentMethod: "razorpay";
  notes?: string;
}

export const orderApi = {
  checkout: (body: CheckoutBody) =>
    request<ApiResponse<CheckoutResponseData>>("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(body),
    }, true),

  myOrders: () => request<ApiResponse<Order[]>>("/orders/my-orders", {}, true).then(normalizeOrdersResponse),

  get: (id: string) => request<ApiResponse<Order>>(`/orders/${id}`, {}, true).then(normalizeOrderResponse),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentApi = {
  verify: (body: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    request<ApiResponse<Order>>("/payments/verify", {
      method: "POST",
      body: JSON.stringify(body),
    }, true),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviewApi = {
  submit: (body: {
    product: string; name: string; email?: string;
    rating: number; title?: string; comment: string;
  }) =>
    request<ApiResponse<Review>>("/reviews", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  featured: (limit = 6) =>
    request<ApiResponse<Review[]>>(`/reviews/featured?limit=${limit}`),

  forProduct: (productId: string, page = 1, limit = 10) =>
    request<{ success: boolean; data: Review[]; summary: ReviewSummary; total: number }>(
      `/reviews/product/${productId}?page=${page}&limit=${limit}`
    ),
};

// ─── Collections ──────────────────────────────────────────────────────────────

export const collectionApi = {
  list: (params: Record<string, string | number | boolean> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => q.set(k, String(v)));
    return request<PaginatedResponse<Collection>>(`/collections?${q}`).then((response) => ({
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map((collection) => ({
            ...collection,
            heroImage: buildDisplayImageUrl(collection.heroImage),
            thumbnail: buildDisplayImageUrl(collection.thumbnail),
          }))
        : [],
    }));
  },

  get: (slug: string) =>
    request<ApiResponse<Collection>>(`/collections/${slug}`).then((response) => ({
      ...response,
      data: {
        ...response.data,
        heroImage: buildDisplayImageUrl(response.data?.heroImage),
        thumbnail: buildDisplayImageUrl(response.data?.thumbnail),
      },
    })),

  products: (slug: string, filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v));
    });
    return request<ApiResponse<CollectionProductsPayload>>(`/collections/${slug}/products?${params}`).then(
      normalizeCollectionProductsResponse
    );
  },
};

// ─── Homepage ─────────────────────────────────────────────────────────────────

export const homepageApi = {
  get: () => request<ApiResponse<HomepagePayload>>("/homepage").then(normalizeHomepageResponse),
};

// ─── Banners ─────────────────────────────────────────────────────────────────

export const bannerApi = {
  list: (page?: string, type?: string) => {
    const q = new URLSearchParams();
    if (page) q.set("page", page);
    if (type) q.set("type", type);
    return request<ApiResponse<Banner[]>>(`/banners?${q}`);
  },
};

// ─── Blogs ───────────────────────────────────────────────────────────────────

export const blogApi = {
  list: (params: Record<string, string | number | boolean> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => q.set(k, String(v)));
    return request<PaginatedResponse<Blog>>(`/blogs?${q}`).then((response) => ({
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map((blog) => ({
            ...blog,
            featuredImage: buildDisplayImageUrl(blog.featuredImage),
          }))
        : [],
    }));
  },

  featured: () =>
    request<ApiResponse<Blog[]>>("/blogs/featured/list").then((response) => ({
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map((blog) => ({
            ...blog,
            featuredImage: buildDisplayImageUrl(blog.featuredImage),
          }))
        : [],
    })),

  get: (slug: string) =>
    request<ApiResponse<Blog>>(`/blogs/${slug}`).then((response) => ({
      ...response,
      data: {
        ...response.data,
        featuredImage: buildDisplayImageUrl(response.data?.featuredImage),
      },
    })),

  related: (slug: string) =>
    request<ApiResponse<Blog[]>>(`/blogs/related/${slug}`).then((response) => ({
      ...response,
      data: Array.isArray(response.data)
        ? response.data.map((blog) => ({
            ...blog,
            featuredImage: buildDisplayImageUrl(blog.featuredImage),
          }))
        : [],
    })),
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchApi = {
  search: (q: string, page = 1, limit = 10) =>
    request<ApiResponse<GlobalSearchPayload>>(
      `/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
    ).then((response) => ({
      ...response,
      data: {
        ...response.data,
        products: Array.isArray(response.data?.products)
          ? response.data.products.map(normalizeProduct)
          : [],
      },
    })),

  suggestions: (q: string, limit = 5) =>
    request<ApiResponse<SearchSuggestionsPayload>>(
      `/search/suggestions?q=${encodeURIComponent(q)}&limit=${limit}`
    ),
};

export const pageApi = {
  get: (slug: string) => request<ApiResponse<CmsPage>>(`/pages/${slug}`),
};

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const newsletterApi = {
  subscribe: (email: string, name?: string) =>
    request<ApiResponse<null>>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, name, source: "website" }),
    }),
};

// ─── Contact / Lead ───────────────────────────────────────────────────────────

export const contactApi = {
  submit: (body: { name: string; email?: string; phone?: string; message: string; product?: string }) =>
    request<ApiResponse<null>>("/contact", {
      method: "POST",
      body: JSON.stringify({ ...body, source: "contact_page" }),
    }),
};

export const leadApi = {
  gemstoneRecommendation: (body: { name: string; email?: string; phone?: string; message: string }) =>
    request<ApiResponse<null>>("/leads/gemstone-recommendation", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  rudrakshaRecommendation: (body: { name: string; email?: string; phone?: string; message: string }) =>
    request<ApiResponse<null>>("/leads/rudraksha-recommendation", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const rudrakshaCalculatorApi = {
  submit: (body: RudrakshaCalculatorSubmitBody) =>
    request<ApiResponse<RudrakshaCalculatorResult>>("/rudraksha-calculator/submit", {
      method: "POST",
      body: JSON.stringify(body),
    }).then(normalizeRudrakshaCalculatorResponse),
};
