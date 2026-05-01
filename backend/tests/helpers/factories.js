import User from "../../src/models/User.js";
import Category from "../../src/models/Category.js";
import SubCategory from "../../src/models/SubCategory.js";
import Product from "../../src/models/Product.js";
import generateToken from "../../src/utils/generateToken.js";

let sequence = 0;

const nextId = (prefix = "item") => {
  sequence += 1;
  return `${prefix}-${Date.now()}-${sequence}`;
};

export const createUser = async (overrides = {}) => {
  const email = overrides.email || `${nextId("user")}@example.com`;
  const password = overrides.password || "Test1234";

  const user = await User.create({
    fullName: overrides.fullName || "Test User",
    email,
    password,
    phone: overrides.phone || "9999999999",
    role: overrides.role || "user",
    isActive: overrides.isActive ?? true
  });

  return user;
};

export const createAdmin = async (overrides = {}) =>
  createUser({
    role: "admin",
    fullName: "Admin User",
    ...overrides
  });

export const authHeaderFor = (user) => ({
  Authorization: `Bearer ${generateToken(user)}`
});

export const createCategory = async (overrides = {}) => {
  const name = overrides.name || `Category ${nextId("cat")}`;
  return Category.create({
    name,
    slug: overrides.slug || name.toLowerCase().replace(/\s+/g, "-"),
    description: overrides.description || "Category description",
    image: overrides.image || "",
    isActive: overrides.isActive ?? true
  });
};

export const createSubCategory = async (category, overrides = {}) => {
  const name = overrides.name || `SubCategory ${nextId("subcat")}`;
  return SubCategory.create({
    name,
    slug: overrides.slug || name.toLowerCase().replace(/\s+/g, "-"),
    category: overrides.category || category._id,
    description: overrides.description || "Subcategory description",
    isActive: overrides.isActive ?? true
  });
};

export const createProduct = async ({ category, subCategory, createdBy = null, ...overrides }) => {
  const name = overrides.name || `Product ${nextId("product")}`;
  const slug = overrides.slug || name.toLowerCase().replace(/\s+/g, "-");
  const sku = overrides.sku || nextId("sku").toUpperCase();

  return Product.create({
    name,
    title: overrides.title || name,
    slug,
    sku,
    category: category._id,
    subCategory: subCategory._id,
    productType: overrides.productType || "gemstone",
    shortDescription: overrides.shortDescription || "Short description",
    description: overrides.description || "<p>Detailed description</p>",
    featuredImage: overrides.featuredImage || "https://example.com/product.jpg",
    thumbnail: overrides.thumbnail || "https://example.com/product-thumb.jpg",
    galleryImages: overrides.galleryImages || ["https://example.com/product.jpg"],
    images: overrides.images || ["https://example.com/product.jpg"],
    basePrice: overrides.basePrice ?? 2500,
    salePrice: overrides.salePrice ?? 2000,
    stock: overrides.stock ?? 10,
    lowStockThreshold: overrides.lowStockThreshold ?? 5,
    soldCount: overrides.soldCount ?? 0,
    status: overrides.status || "published",
    isFeatured: overrides.isFeatured ?? false,
    showOnHomepage: overrides.showOnHomepage ?? false,
    tags: overrides.tags || ["featured"],
    origin: overrides.origin || "Sri Lanka",
    shape: overrides.shape || "Oval",
    style: overrides.style || "Loose Stone",
    weightCarat: overrides.weightCarat ?? 5.5,
    weightRatti: overrides.weightRatti ?? 6,
    certificationLab: overrides.certificationLab || "IGI",
    treatment: overrides.treatment || "None",
    specifications: overrides.specifications || { color: "Blue" },
    createdBy,
    updatedBy: createdBy
  });
};

export const checkoutPayloadFor = (email = "buyer@example.com") => ({
  shippingAddress: {
    fullName: "Buyer User",
    email,
    phone: "9999999999",
    addressLine1: "123 Test Street",
    addressLine2: "Near Landmark",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India"
  },
  billingAddress: {
    fullName: "Buyer User",
    email,
    phone: "9999999999",
    addressLine1: "123 Test Street",
    addressLine2: "Near Landmark",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India"
  },
  paymentMethod: "razorpay",
  notes: "Integration test order"
});
