import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app.js";
import Product from "../src/models/Product.js";
import {
  authHeaderFor,
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

describe("Catalog API", () => {
  it("allows admin to create and fetch a category", async () => {
    const admin = await createAdmin();

    const createResponse = await request(app)
      .post("/api/v1/categories")
      .set(authHeaderFor(admin))
      .send({
        name: "Gemstones",
        description: "Certified gemstones",
        image: "https://example.com/gemstones.jpg",
        isActive: true
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.slug).toBe("gemstones");

    const getResponse = await request(app).get(`/api/v1/categories/${createResponse.body.data._id}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.name).toBe("Gemstones");
  });

  it("rejects category create for non-admin user", async () => {
    const user = await createUser();

    const response = await request(app)
      .post("/api/v1/categories")
      .set(authHeaderFor(user))
      .send({ name: "Blocked Category" });

    expect(response.status).toBe(403);
  });

  it("rejects duplicate category names", async () => {
    const admin = await createAdmin();
    await createCategory({ name: "Rudraksha", slug: "rudraksha" });

    const response = await request(app)
      .post("/api/v1/categories")
      .set(authHeaderFor(admin))
      .send({ name: "Rudraksha" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already exists/i);
  });

  it("creates subcategory under a valid category", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Bracelets", slug: "bracelets" });

    const response = await request(app)
      .post("/api/v1/subcategories")
      .set(authHeaderFor(admin))
      .send({
        name: "Healing Bracelets",
        category: category._id.toString(),
        description: "Healing focused bracelets",
        isActive: true
      });

    expect(response.status).toBe(201);
    expect(response.body.data.category.toString()).toBe(category._id.toString());
  });

  it("returns 404 when subcategory parent category is missing", async () => {
    const admin = await createAdmin();

    const response = await request(app)
      .post("/api/v1/subcategories")
      .set(authHeaderFor(admin))
      .send({
        name: "Bad Subcategory",
        category: "507f1f77bcf86cd799439011"
      });

    expect(response.status).toBe(404);
  });

  it("creates a product and exposes it on public listing", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Gemstone", slug: "gemstone" });
    const subCategory = await createSubCategory(category, {
      name: "Blue Sapphire",
      slug: "blue-sapphire"
    });

    const createResponse = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .send({
        title: "Blue Sapphire 5 Carat",
        sku: "BS-500",
        category: category._id.toString(),
        subCategory: subCategory._id.toString(),
        productType: "gemstone",
        basePrice: 5000,
        salePrice: 4500,
        stock: 5,
        featuredImage: "https://example.com/blue-sapphire.jpg",
        status: "published"
      });

    expect(createResponse.status).toBe(201);

    const listResponse = await request(app).get("/api/v1/products");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.total).toBe(1);
    expect(listResponse.body.data[0].isOutOfStock).toBe(false);
    expect(listResponse.body.data[0].canAddToCart).toBe(true);
  });

  it("returns only published products in public listing", async () => {
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    await createProduct({ category, subCategory, status: "draft" });
    await createProduct({ category, subCategory, status: "published" });

    const response = await request(app).get("/api/v1/products");

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
  });

  it("rejects product creation with mismatched subcategory", async () => {
    const admin = await createAdmin();
    const categoryA = await createCategory({ name: "Category A", slug: "category-a" });
    const categoryB = await createCategory({ name: "Category B", slug: "category-b" });
    const subCategoryB = await createSubCategory(categoryB, {
      name: "Sub B",
      slug: "sub-b"
    });

    const response = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .send({
        title: "Broken Product",
        sku: "BROKEN-SKU",
        category: categoryA._id.toString(),
        subCategory: subCategoryB._id.toString(),
        productType: "gemstone",
        basePrice: 5000,
        stock: 5,
        featuredImage: "https://example.com/broken-product.jpg"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/does not belong/i);
  });

  it("rejects product creation when no valid image is provided", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "No Image Category", slug: "no-image-category" });
    const subCategory = await createSubCategory(category, {
      name: "No Image Subcategory",
      slug: "no-image-subcategory"
    });

    const response = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .send({
        title: "No Image Product",
        sku: "NO-IMG-001",
        category: category._id.toString(),
        subCategory: subCategory._id.toString(),
        productType: "gemstone",
        basePrice: 5000,
        stock: 5
      });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toMatch(/at least one product image is required/i);
  });

  it("returns 404 for unknown product slug", async () => {
    const response = await request(app).get("/api/v1/products/unknown-slug");

    expect(response.status).toBe(404);
  });

  it("returns stock-derived fields on product detail and supports stock filtering", async () => {
    const category = await createCategory({ name: "Stock Category", slug: "stock-category" });
    const subCategory = await createSubCategory(category, {
      name: "Stock Subcategory",
      slug: "stock-subcategory"
    });

    const inStockProduct = await createProduct({
      category,
      subCategory,
      title: "Stock Ready Product",
      slug: "stock-ready-product",
      stock: 3,
      lowStockThreshold: 5,
      status: "published"
    });
    await createProduct({
      category,
      subCategory,
      title: "No Stock Product",
      slug: "no-stock-product",
      stock: 0,
      lowStockThreshold: 5,
      status: "published"
    });

    const detailResponse = await request(app).get(`/api/v1/products/${inStockProduct.slug}`);
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.data.stock).toBe(3);
    expect(detailResponse.body.data.isOutOfStock).toBe(false);
    expect(detailResponse.body.data.isLowStock).toBe(true);
    expect(detailResponse.body.data.stockMessage).toBe("In Stock");

    const outOfStockList = await request(app).get("/api/v1/products?stockStatus=out_of_stock");
    expect(outOfStockList.status).toBe(200);
    expect(outOfStockList.body.total).toBe(1);
    expect(outOfStockList.body.data[0].isOutOfStock).toBe(true);
    expect(outOfStockList.body.data[0].canAddToCart).toBe(false);
    expect(outOfStockList.body.data[0].stockMessage).toBe("Out of Stock");

    const inStockList = await request(app).get("/api/v1/products?inStock=true");
    expect(inStockList.status).toBe(200);
    expect(inStockList.body.total).toBe(1);
    expect(inStockList.body.data[0].slug).toBe("stock-ready-product");
  });

  it("returns absolute asset image URLs for product list and detail responses", async () => {
    const category = await createCategory({ name: "Asset Category", slug: "asset-category" });
    const subCategory = await createSubCategory(category, {
      name: "Asset Subcategory",
      slug: "asset-subcategory"
    });

    await createProduct({
      category,
      subCategory,
      title: "Asset URL Product",
      slug: "asset-url-product",
      featuredImage: "/media/products/five-mukhi-rudraksha.jpg",
      thumbnail: "/media/products/five-mukhi-rudraksha-thumb.webp",
      galleryImages: ["/media/products/five-mukhi-rudraksha.jpg"],
      images: ["/media/products/five-mukhi-rudraksha.jpg"]
    });

    const listResponse = await request(app)
      .get("/api/v1/products")
      .set("Host", "frontend.test");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data[0].featuredImage).toBe(
      "http://frontend.test/media/products/five-mukhi-rudraksha.jpg"
    );
    expect(listResponse.body.data[0].listingCard.image).toBe(
      "http://frontend.test/media/products/five-mukhi-rudraksha.jpg"
    );

    const detailResponse = await request(app)
      .get("/api/v1/products/asset-url-product")
      .set("Host", "frontend.test");
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.data.primaryImage).toBe(
      "http://frontend.test/media/products/five-mukhi-rudraksha.jpg"
    );
    expect(detailResponse.body.data.images[0].url).toBe(
      "http://frontend.test/media/products/five-mukhi-rudraksha.jpg"
    );
  });

  it("serves legacy product media files from the public media endpoint", async () => {
    const response = await request(app).get("/media/products/five-mukhi-rudraksha.jpg");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/^image\//i);
  });

  it("rejects negative stock updates through validation", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Negative Stock Category", slug: "negative-stock-category" });
    const subCategory = await createSubCategory(category, {
      name: "Negative Stock Subcategory",
      slug: "negative-stock-subcategory"
    });
    const product = await createProduct({ category, subCategory, stock: 5 });

    const response = await request(app)
      .patch(`/api/v1/products/${product._id}`)
      .set(authHeaderFor(admin))
      .send({
        stock: -1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/validation failed/i);
    expect(response.body.errors[0].message).toMatch(/stock must be a non-negative integer/i);
  });

  it("allows admin to create a product with multiple uploaded images", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Upload Category", slug: "upload-category" });
    const subCategory = await createSubCategory(category, {
      name: "Upload Subcategory",
      slug: "upload-subcategory"
    });

    const response = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .field("title", "Cloudinary Product")
      .field("sku", "IMG-UP-001")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .field("status", "published")
      .field("imageAlts", JSON.stringify(["Front view", "Side view"]))
      .attach("images", tinyPngBuffer, {
        filename: "front.png",
        contentType: "image/png"
      })
      .attach("images", tinyPngBuffer, {
        filename: "side.png",
        contentType: "image/png"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.images).toHaveLength(2);
    expect(response.body.data.images[0].isPrimary).toBe(true);
    expect(response.body.data.images[0].publicId).toMatch(/alokit\/products/i);
    expect(response.body.data.images[0].url).toMatch(/^https:\/\/res\.cloudinary\.com\//);
    expect(response.body.data.primaryImageData.variants.productCard).toBeTruthy();
  });

  it("rejects non-admin product creation with uploaded images", async () => {
    const user = await createUser();
    const category = await createCategory({ name: "User Upload Category", slug: "user-upload-category" });
    const subCategory = await createSubCategory(category, {
      name: "User Upload Subcategory",
      slug: "user-upload-subcategory"
    });

    const response = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(user))
      .field("title", "Blocked Upload Product")
      .field("sku", "IMG-UP-002")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .attach("images", tinyPngBuffer, {
        filename: "blocked.png",
        contentType: "image/png"
      });

    expect(response.status).toBe(403);
  });

  it("rejects invalid product image file types", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Invalid Type Category", slug: "invalid-type-category" });
    const subCategory = await createSubCategory(category, {
      name: "Invalid Type Subcategory",
      slug: "invalid-type-subcategory"
    });

    const response = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .field("title", "Invalid File Product")
      .field("sku", "IMG-UP-003")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .attach("images", Buffer.from("not-an-image"), {
        filename: "bad.txt",
        contentType: "text/plain"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/jpg|jpeg|png|webp/i);
  });

  it("rejects oversized product images", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Oversize Category", slug: "oversize-category" });
    const subCategory = await createSubCategory(category, {
      name: "Oversize Subcategory",
      slug: "oversize-subcategory"
    });

    const response = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .field("title", "Oversize Product")
      .field("sku", "IMG-UP-004")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .attach("images", Buffer.alloc(2 * 1024 * 1024 + 1, 1), {
        filename: "huge.png",
        contentType: "image/png"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/2MB/i);
  });

  it("replaces product images and returns updated image data", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Replace Category", slug: "replace-category" });
    const subCategory = await createSubCategory(category, {
      name: "Replace Subcategory",
      slug: "replace-subcategory"
    });

    const createdProduct = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .field("title", "Replace Image Product")
      .field("sku", "IMG-UP-005")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .field("status", "published")
      .attach("images", tinyPngBuffer, {
        filename: "first.png",
        contentType: "image/png"
      });

    expect(createdProduct.status).toBe(201);

    const replaceResponse = await request(app)
      .put(`/api/v1/products/${createdProduct.body.data._id}/images`)
      .set(authHeaderFor(admin))
      .field("imageAlts", JSON.stringify(["Updated image"]))
      .attach("images", tinyPngBuffer, {
        filename: "updated.png",
        contentType: "image/png"
      });

    expect(replaceResponse.status).toBe(200);
    expect(replaceResponse.body.data.images).toHaveLength(1);
    expect(replaceResponse.body.data.images[0].publicId).toMatch(/alokit\/products/i);
    expect(replaceResponse.body.data.images[0].alt).toBe("Updated image");
    expect(replaceResponse.body.data.images[0].url).toMatch(/^https:\/\/res\.cloudinary\.com\//);

    const fetchResponse = await request(app).get(
      `/api/v1/products/${createdProduct.body.data.slug}`
    );
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body.data.images[0].variants.productDetail).toBeTruthy();
  });

  it("stores the canonical Cloudinary media shape when updating a product with a new image", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Canonical Category", slug: "canonical-category" });
    const subCategory = await createSubCategory(category, {
      name: "Canonical Subcategory",
      slug: "canonical-subcategory"
    });

    const createdProduct = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .field("title", "Canonical Shape Product")
      .field("sku", "IMG-UP-007")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .attach("images", tinyPngBuffer, {
        filename: "canonical-start.png",
        contentType: "image/png"
      });

    expect(createdProduct.status).toBe(201);

    const updateResponse = await request(app)
      .patch(`/api/v1/products/${createdProduct.body.data._id}`)
      .set(authHeaderFor(admin))
      .field("title", "Canonical Shape Product Updated")
      .field("sku", "IMG-UP-007")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "15000")
      .field("stock", "4")
      .field("imageAlts", JSON.stringify(["Updated primary image"]))
      .attach("images", tinyPngBuffer, {
        filename: "canonical-updated.png",
        contentType: "image/png"
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.images).toHaveLength(1);
    expect(updateResponse.body.data.images[0]).toEqual(
      expect.objectContaining({
        publicId: expect.stringMatching(/alokit\/products/i),
        url: expect.stringMatching(/^https:\/\/res\.cloudinary\.com\//),
        alt: "Updated primary image",
        isPrimary: true
      })
    );

    const storedProduct = await Product.findById(createdProduct.body.data._id).lean();
    expect(storedProduct.images[0]).toEqual(
      expect.objectContaining({
        publicId: expect.stringMatching(/alokit\/products/i),
        url: expect.stringMatching(/^https:\/\/res\.cloudinary\.com\//),
        alt: "Updated primary image",
        isPrimary: true
      })
    );
    expect(storedProduct.images[0].public_id).toBeUndefined();
  });

  it("returns a clear error when Cloudinary upload fails instead of falling back to local assets", async () => {
    global.__cloudinaryMock.failNextUpload = true;

    const admin = await createAdmin();
    const category = await createCategory({ name: "Failure Category", slug: "failure-category" });
    const subCategory = await createSubCategory(category, {
      name: "Failure Subcategory",
      slug: "failure-subcategory"
    });

    const response = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .field("title", "Failure Product")
      .field("sku", "IMG-UP-008")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .attach("images", tinyPngBuffer, {
        filename: "failure.png",
        contentType: "image/png"
      });

    expect(response.status).toBe(502);
    expect(response.body.message).toMatch(/cloudinary/i);

    const storedProducts = await Product.find({ sku: "IMG-UP-008" });
    expect(storedProducts).toHaveLength(0);
  });

  it("deletes a product and removes its stored image references", async () => {
    const admin = await createAdmin();
    const category = await createCategory({ name: "Delete Category", slug: "delete-category" });
    const subCategory = await createSubCategory(category, {
      name: "Delete Subcategory",
      slug: "delete-subcategory"
    });

    const createdProduct = await request(app)
      .post("/api/v1/products")
      .set(authHeaderFor(admin))
      .field("title", "Delete Image Product")
      .field("sku", "IMG-UP-006")
      .field("category", category._id.toString())
      .field("subCategory", subCategory._id.toString())
      .field("productType", "gemstone")
      .field("basePrice", "12000")
      .field("stock", "3")
      .attach("images", tinyPngBuffer, {
        filename: "delete.png",
        contentType: "image/png"
      });

    expect(createdProduct.status).toBe(201);

    const deleteResponse = await request(app)
      .delete(`/api/v1/products/${createdProduct.body.data._id}`)
      .set(authHeaderFor(admin));

    expect(deleteResponse.status).toBe(200);

    const storedProduct = await Product.findById(createdProduct.body.data._id);
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.isDeleted).toBe(true);
  });
});
