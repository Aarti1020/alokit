import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app.js";
import Order from "../src/models/Order.js";
import Product from "../src/models/Product.js";
import User from "../src/models/User.js";
import Collection from "../src/models/Collection.js";
import Cart from "../src/models/Cart.js";
import Wishlist from "../src/models/Wishlist.js";
import { backfillProductMedia } from "../scripts/backfillProductMedia.js";
import {
  authHeaderFor,
  checkoutPayloadFor,
  createAdmin,
  createCategory,
  createProduct,
  createSubCategory,
  createUser
} from "./helpers/factories.js";

const tinyPngBuffer = Buffer.from(
  "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D49444154789C63F8FFFF3F0005FE02FEA7E5C9E00000000049454E44AE426082",
  "hex"
);

describe("Admin API", () => {
  it("allows admin login, profile update, password change, avatar update, and dashboard access", async () => {
    const admin = await createAdmin({
      email: "admin.login@example.com",
      password: "Admin1234"
    });

    const loginResponse = await request(app).post("/api/v1/admin/login").send({
      email: "admin.login@example.com",
      password: "Admin1234"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.user.role).toBe("admin");

    const normalUser = await createUser({
      email: "normal.login@example.com",
      password: "User1234"
    });

    const rejectedLogin = await request(app).post("/api/v1/admin/login").send({
      email: normalUser.email,
      password: "User1234"
    });
    expect(rejectedLogin.status).toBe(403);

    const tokenHeader = authHeaderFor(admin);

    const profileResponse = await request(app)
      .get("/api/v1/admin/profile")
      .set(tokenHeader);
    expect(profileResponse.status).toBe(200);

    const updateProfileResponse = await request(app)
      .patch("/api/v1/admin/profile")
      .set(tokenHeader)
      .send({
        fullName: "Updated Admin",
        phone: "8888888888"
      });
    expect(updateProfileResponse.status).toBe(200);
    expect(updateProfileResponse.body.data.fullName).toBe("Updated Admin");

    const changePasswordResponse = await request(app)
      .patch("/api/v1/admin/change-password")
      .set(tokenHeader)
      .send({
        currentPassword: "Admin1234",
        newPassword: "NewAdmin1234",
        confirmPassword: "NewAdmin1234"
      });
    expect(changePasswordResponse.status).toBe(200);

    const avatarResponse = await request(app)
      .patch("/api/v1/admin/avatar")
      .set(tokenHeader)
      .attach("avatar", tinyPngBuffer, {
        filename: "avatar.png",
        contentType: "image/png"
      });
    expect(avatarResponse.status).toBe(200);
    expect(avatarResponse.body.data.avatar.url).toBeTruthy();

    const dashboardResponse = await request(app)
      .get("/api/v1/admin/dashboard")
      .set(tokenHeader);
    expect(dashboardResponse.status).toBe(200);
    expect(dashboardResponse.body.data.overview.totalUsers).toBeGreaterThanOrEqual(1);
  });

  it("supports admin category/subcategory/product management and keeps public product visibility correct", async () => {
    const admin = await createAdmin();
    const buyer = await createUser({ email: "cleanup-buyer@example.com" });

    const categoryResponse = await request(app)
      .post("/api/v1/admin/categories")
      .set(authHeaderFor(admin))
      .send({
        name: "Admin Gems",
        description: "Admin category",
        isActive: true
      });
    expect(categoryResponse.status).toBe(201);

    const subCategoryResponse = await request(app)
      .post("/api/v1/admin/subcategories")
      .set(authHeaderFor(admin))
      .send({
        name: "Admin Sapphire",
        category: categoryResponse.body.data._id,
        description: "Admin subcategory",
        isActive: true
      });
    expect(subCategoryResponse.status).toBe(201);

    const createProductResponse = await request(app)
      .post("/api/v1/admin/products")
      .set(authHeaderFor(admin))
      .field("title", "Admin Active Product")
      .field("sku", "ADM-PRD-001")
      .field("category", categoryResponse.body.data._id)
      .field("subCategory", subCategoryResponse.body.data._id)
      .field("productType", "gemstone")
      .field("basePrice", "5000")
      .field("stock", "7")
      .field("status", "active")
      .attach("images", tinyPngBuffer, {
        filename: "product.png",
        contentType: "image/png"
      });
    expect(createProductResponse.status).toBe(201);

    const collectionResponse = await request(app)
      .post("/api/v1/admin/collections")
      .set(authHeaderFor(admin))
      .send({
        title: "Cleanup Collection",
        productIds: [createProductResponse.body.data._id],
        status: "published"
      });
    expect(collectionResponse.status).toBe(201);

    const updatedProductLink = await request(app)
      .patch(`/api/v1/admin/products/${createProductResponse.body.data._id}`)
      .set(authHeaderFor(admin))
      .send({
        collections: [collectionResponse.body.data._id]
      });
    expect(updatedProductLink.status).toBe(200);

    const addToCartResponse = await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: createProductResponse.body.data._id,
        quantity: 1
      });
    expect(addToCartResponse.status).toBe(200);

    const addToWishlistResponse = await request(app)
      .post("/api/v1/wishlist/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: createProductResponse.body.data._id
      });
    expect(addToWishlistResponse.status).toBe(200);

    const adminListResponse = await request(app)
      .get("/api/v1/admin/products")
      .set(authHeaderFor(admin));
    expect(adminListResponse.status).toBe(200);
    expect(adminListResponse.body.total).toBe(1);

    const publicListResponse = await request(app).get("/api/v1/products");
    expect(publicListResponse.status).toBe(200);
    expect(publicListResponse.body.total).toBe(1);
    expect(publicListResponse.body.data[0].slug).toBe("admin-active-product");

    const inactiveResponse = await request(app)
      .patch(`/api/v1/admin/products/${createProductResponse.body.data._id}/status`)
      .set(authHeaderFor(admin))
      .send({ status: "inactive" });
    expect(inactiveResponse.status).toBe(200);

    const hiddenPublicList = await request(app).get("/api/v1/products");
    expect(hiddenPublicList.body.total).toBe(0);

    const featuredResponse = await request(app)
      .patch(`/api/v1/admin/products/${createProductResponse.body.data._id}/featured`)
      .set(authHeaderFor(admin))
      .send({ isFeatured: true });
    expect(featuredResponse.status).toBe(200);
    expect(featuredResponse.body.data.isFeatured).toBe(true);

    const stockResponse = await request(app)
      .patch(`/api/v1/admin/products/${createProductResponse.body.data._id}/stock`)
      .set(authHeaderFor(admin))
      .send({ stock: 3, lowStockThreshold: 4 });
    expect(stockResponse.status).toBe(200);
    expect(stockResponse.body.data.stock).toBe(3);
    expect(stockResponse.body.data.isLowStock).toBe(true);

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/products/${createProductResponse.body.data._id}`)
      .set(authHeaderFor(admin));
    expect(deleteResponse.status).toBe(200);

    const deletedProduct = await Product.findById(createProductResponse.body.data._id);
    expect(deletedProduct.isDeleted).toBe(true);
    expect(deletedProduct.collections).toHaveLength(0);

    const collection = await Collection.findById(collectionResponse.body.data._id);
    expect(collection.productIds.map((id) => id.toString())).not.toContain(
      createProductResponse.body.data._id
    );

    const cart = await Cart.findOne({ user: buyer._id });
    expect(cart.items).toHaveLength(0);

    const wishlist = await Wishlist.findOne({ user: buyer._id });
    expect(wishlist.items).toHaveLength(0);

    const publicAfterDelete = await request(app).get("/api/v1/products");
    expect(publicAfterDelete.body.total).toBe(0);

    const deleteSubCategoryResponse = await request(app)
      .delete(`/api/v1/admin/subcategories/${subCategoryResponse.body.data._id}`)
      .set(authHeaderFor(admin));
    expect(deleteSubCategoryResponse.status).toBe(200);

    const deleteCategoryResponse = await request(app)
      .delete(`/api/v1/admin/categories/${categoryResponse.body.data._id}`)
      .set(authHeaderFor(admin));
    expect(deleteCategoryResponse.status).toBe(200);
  });

  it("enforces product image requirements and preserves normalized thumbnails across admin product flows", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Admin Product Images", slug: "admin-product-images" });
    const subCategory = await createSubCategory(category, {
      name: "Admin Product Image Subcategory",
      slug: "admin-product-image-subcategory"
    });

    const missingImageCreate = await request(app)
      .post("/api/v1/admin/products")
      .set(authHeaderFor(admin))
      .send({
        title: "Imageless Create Attempt",
        sku: "ADM-IMG-000",
        category: category._id.toString(),
        subCategory: subCategory._id.toString(),
        productType: "gemstone",
        basePrice: 4500,
        stock: 2
      });

    expect(missingImageCreate.status).toBe(400);
    expect(missingImageCreate.body.errors[0].message).toMatch(/at least one product image is required/i);

    const createdProduct = await request(app)
      .post("/api/v1/admin/products")
      .set(authHeaderFor(admin))
      .field("title", "Admin Preserved Image Product")
      .field("sku", "ADM-IMG-001")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "4500")
      .field("stock", "2")
      .field("status", "active")
      .attach("images", tinyPngBuffer, {
        filename: "original.png",
        contentType: "image/png"
      });

    expect(createdProduct.status).toBe(201);
    expect(createdProduct.body.data.images).toHaveLength(1);
    expect(createdProduct.body.data.thumbnail).toBeTruthy();
    expect(createdProduct.body.data.thumbnail).toBe(createdProduct.body.data.images[0].url);

    const originalThumbnail = createdProduct.body.data.thumbnail;

    const preserveUpdate = await request(app)
      .patch(`/api/v1/admin/products/${createdProduct.body.data._id}`)
      .set(authHeaderFor(admin))
      .send({
        title: "Admin Preserved Image Product Updated"
      });

    expect(preserveUpdate.status).toBe(200);
    expect(preserveUpdate.body.data.thumbnail).toBe(originalThumbnail);
    expect(preserveUpdate.body.data.images).toHaveLength(1);

    const replaceUpdate = await request(app)
      .patch(`/api/v1/admin/products/${createdProduct.body.data._id}`)
      .set(authHeaderFor(admin))
      .field("title", "Admin Replaced Image Product")
      .attach("images", tinyPngBuffer, {
        filename: "replacement.png",
        contentType: "image/png"
      });

    expect(replaceUpdate.status).toBe(200);
    expect(replaceUpdate.body.data.images).toHaveLength(1);
    expect(replaceUpdate.body.data.thumbnail).toBe(replaceUpdate.body.data.images[0].url);
    expect(replaceUpdate.body.data.thumbnail).not.toBe(originalThumbnail);

    await Product.create({
      name: "Legacy Featured Only Product",
      title: "Legacy Featured Only Product",
      slug: "legacy-featured-only-product",
      sku: "ADM-IMG-LEGACY-1",
      category: category._id,
      subCategory: subCategory._id,
      productType: "gemstone",
      basePrice: 3200,
      stock: 4,
      status: "active",
      featuredImage: "/assets/products/obsidian-bracelet.jpg",
      thumbnail: "",
      galleryImages: [],
      images: []
    });

    await Product.create({
      name: "Legacy Imageless Product",
      title: "Legacy Imageless Product",
      slug: "legacy-imageless-product",
      sku: "ADM-IMG-LEGACY-2",
      category: category._id,
      subCategory: subCategory._id,
      productType: "gemstone",
      basePrice: 2800,
      stock: 1,
      status: "active",
      featuredImage: "",
      thumbnail: "",
      galleryImages: [],
      images: []
    });

    const migrationTarget = await Product.create({
      name: "Legacy Migratable Product",
      title: "Legacy Migratable Product",
      slug: "legacy-migratable-product",
      sku: "ADM-IMG-LEGACY-3",
      category: category._id,
      subCategory: subCategory._id,
      productType: "gemstone",
      basePrice: 2900,
      stock: 3,
      status: "active",
      featuredImage: "",
      thumbnail: "",
      galleryImages: [],
      images: [
        {
          publicId: "legacy/products/legacy-migratable-product",
          url: "/assets/products/obsidian-bracelet.jpg",
          alt: "Legacy Migratable Product",
          isPrimary: true
        }
      ]
    });

    const backfillSummary = await backfillProductMedia({ manageConnection: false });
    expect(backfillSummary.updatedCount).toBeGreaterThanOrEqual(1);

    const migratedProduct = await Product.findById(migrationTarget._id).lean();
    expect(migratedProduct.thumbnail).toBe("/assets/products/obsidian-bracelet.jpg");
    expect(migratedProduct.images[0].publicId).toBe("legacy/products/legacy-migratable-product");

    const adminListResponse = await request(app)
      .get("/api/v1/admin/products")
      .set(authHeaderFor(admin))
      .set("Host", "admin.test");

    expect(adminListResponse.status).toBe(200);

    const listedCreatedProduct = adminListResponse.body.data.find(
      (product) => product._id === createdProduct.body.data._id
    );
    const legacyFeaturedOnlyProduct = adminListResponse.body.data.find(
      (product) => product.slug === "legacy-featured-only-product"
    );
    const legacyImagelessProduct = adminListResponse.body.data.find(
      (product) => product.slug === "legacy-imageless-product"
    );

    expect(listedCreatedProduct.thumbnail).toBeTruthy();
    expect(listedCreatedProduct.thumbnail).toBe(listedCreatedProduct.images[0].url);
    expect(legacyFeaturedOnlyProduct.thumbnail).toBe(
      "http://admin.test/assets/products/obsidian-bracelet.jpg"
    );
    expect(legacyFeaturedOnlyProduct.images[0].url).toBe(
      "http://admin.test/assets/products/obsidian-bracelet.jpg"
    );
    expect(legacyImagelessProduct.thumbnail).toBe("");
    expect(legacyImagelessProduct.images).toEqual([]);
  });

  it("allows admin order management", async () => {
    const admin = await createAdmin();
    const buyer = await createUser({ email: "admin-orders-buyer@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 4, status: "active" });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const order = await Order.findOne({ user: buyer._id });

    const listResponse = await request(app)
      .get("/api/v1/admin/orders")
      .set(authHeaderFor(admin));
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.total).toBe(1);

    const detailResponse = await request(app)
      .get(`/api/v1/admin/orders/${order._id}`)
      .set(authHeaderFor(admin));
    expect(detailResponse.status).toBe(200);

    const statusResponse = await request(app)
      .patch(`/api/v1/admin/orders/${order._id}/status`)
      .set(authHeaderFor(admin))
      .send({ orderStatus: "packed" });
    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.data.orderStatus).toBe("packed");

    const paymentStatusResponse = await request(app)
      .patch(`/api/v1/admin/orders/${order._id}/payment-status`)
      .set(authHeaderFor(admin))
      .send({ paymentStatus: "failed" });
    expect(paymentStatusResponse.status).toBe(200);
    expect(paymentStatusResponse.body.data.paymentStatus).toBe("failed");
  });

  it("allows admin user management and order history access", async () => {
    const admin = await createAdmin();
    const buyer = await createUser({ email: "managed-user@example.com" });
    const removableUser = await createUser({ email: "managed-removable@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 3, status: "active" });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const usersResponse = await request(app)
      .get("/api/v1/admin/users")
      .set(authHeaderFor(admin));
    expect(usersResponse.status).toBe(200);
    expect(usersResponse.body.total).toBeGreaterThanOrEqual(2);

    const userDetailResponse = await request(app)
      .get(`/api/v1/admin/users/${buyer._id}`)
      .set(authHeaderFor(admin));
    expect(userDetailResponse.status).toBe(200);

    const createUserResponse = await request(app)
      .post("/api/v1/admin/users")
      .set(authHeaderFor(admin))
      .send({
        fullName: "Managed Admin User",
        email: "managed-admin-created@example.com",
        phone: "8888888888",
        role: "admin",
        isActive: true,
        password: "Created1234"
      });
    expect(createUserResponse.status).toBe(201);
    expect(createUserResponse.body.data.role).toBe("admin");

    const updateUserResponse = await request(app)
      .patch(`/api/v1/admin/users/${buyer._id}`)
      .set(authHeaderFor(admin))
      .send({
        fullName: "Managed Buyer Updated",
        phone: "7777777777",
        role: "admin",
        isActive: true
      });
    expect(updateUserResponse.status).toBe(200);
    expect(updateUserResponse.body.data.fullName).toBe("Managed Buyer Updated");
    expect(updateUserResponse.body.data.role).toBe("admin");

    const resetPasswordResponse = await request(app)
      .patch(`/api/v1/admin/users/${buyer._id}/password`)
      .set(authHeaderFor(admin))
      .send({
        password: "Reset1234",
        confirmPassword: "Reset1234"
      });
    expect(resetPasswordResponse.status).toBe(200);

    const blockResponse = await request(app)
      .patch(`/api/v1/admin/users/${buyer._id}/block`)
      .set(authHeaderFor(admin));
    expect(blockResponse.status).toBe(200);
    expect(blockResponse.body.data.isActive).toBe(false);

    const blockedLogin = await request(app).post("/api/v1/auth/login").send({
      email: buyer.email,
      password: "Reset1234"
    });
    expect(blockedLogin.status).toBe(403);

    const unblockResponse = await request(app)
      .patch(`/api/v1/admin/users/${buyer._id}/unblock`)
      .set(authHeaderFor(admin));
    expect(unblockResponse.status).toBe(200);
    expect(unblockResponse.body.data.isActive).toBe(true);

    const ordersResponse = await request(app)
      .get(`/api/v1/admin/users/${buyer._id}/orders`)
      .set(authHeaderFor(admin));
    expect(ordersResponse.status).toBe(200);
    expect(ordersResponse.body.results).toBe(1);

    const protectedDeleteResponse = await request(app)
      .delete(`/api/v1/admin/users/${buyer._id}`)
      .set(authHeaderFor(admin));
    expect(protectedDeleteResponse.status).toBe(400);

    const deleteUserResponse = await request(app)
      .delete(`/api/v1/admin/users/${removableUser._id}`)
      .set(authHeaderFor(admin));
    expect(deleteUserResponse.status).toBe(200);

    const deletedUser = await User.findById(removableUser._id);
    expect(deletedUser).toBeNull();
  });
});
