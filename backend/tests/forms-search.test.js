import mongoose from "mongoose";
import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app.js";
import Lead from "../src/models/Lead.js";
import Newsletter from "../src/models/Newsletter.js";
import {
  authHeaderFor,
  createAdmin,
  createCategory,
  createProduct,
  createSubCategory
} from "./helpers/factories.js";

describe("Forms and Search API", () => {
  it("subscribes newsletter and handles duplicate subscribe idempotently", async () => {
    const firstResponse = await request(app).post("/api/v1/newsletter/subscribe").send({
      email: "newsletter@example.com",
      name: "Newsletter User",
      source: "homepage"
    });

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body.data.email).toBe("newsletter@example.com");

    const secondResponse = await request(app).post("/api/v1/newsletter/subscribe").send({
      email: "newsletter@example.com",
      name: "Newsletter User",
      source: "homepage"
    });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.message).toMatch(/already active/i);

    const subscribers = await Newsletter.find({ email: "newsletter@example.com" });
    expect(subscribers).toHaveLength(1);
  });

  it("accepts honeypot newsletter submissions without persisting data", async () => {
    const response = await request(app).post("/api/v1/newsletter/subscribe").send({
      email: "bot@example.com",
      website: "https://spam.example.com"
    });

    expect(response.status).toBe(202);
    expect(response.body.success).toBe(true);

    const subscriber = await Newsletter.findOne({ email: "bot@example.com" });
    expect(subscriber).toBeNull();
  });

  it("validates contact submissions and creates a contact lead", async () => {
    const invalidResponse = await request(app).post("/api/v1/contact").send({
      name: "A",
      email: "bad-email",
      message: "short"
    });

    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body.message).toBe("Validation failed");

    const validResponse = await request(app).post("/api/v1/contact").send({
      name: "Contact User",
      email: "contact@example.com",
      phone: "9999999999",
      message: "I would like help choosing a gemstone for daily wear.",
      source: "contact_page"
    });

    expect(validResponse.status).toBe(201);
    expect(validResponse.body.data.formType).toBe("contact");

    const lead = await Lead.findOne({ email: "contact@example.com" });
    expect(lead).toBeTruthy();
    expect(lead.source).toBe("contact_page");
  });

  it("returns 404 when contact form references a missing product", async () => {
    const response = await request(app).post("/api/v1/contact").send({
      name: "Contact User",
      email: "missing-product@example.com",
      message: "I would like details for this product reference please.",
      product: new mongoose.Types.ObjectId().toString()
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/product not found/i);
  });

  it("creates general and recommendation leads", async () => {
    const leadResponse = await request(app).post("/api/v1/leads").send({
      name: "Lead User",
      email: "lead@example.com",
      phone: "9999999999",
      message: "Please call me back about a custom order inquiry.",
      formType: "custom_order",
      source: "landing_page",
      priority: "high"
    });

    expect(leadResponse.status).toBe(201);
    expect(leadResponse.body.data.formType).toBe("custom_order");
    expect(leadResponse.body.data.priority).toBe("high");

    const gemstoneResponse = await request(app)
      .post("/api/v1/leads/gemstone-recommendation")
      .send({
        name: "Gem User",
        email: "gem@example.com",
        message: "Recommend a gemstone for focus and confidence please."
      });

    expect(gemstoneResponse.status).toBe(201);
    expect(gemstoneResponse.body.data.formType).toBe("gemstone_recommendation");
    expect(gemstoneResponse.body.data.source).toBe("product_page");
  });

  it("supports admin lead review flows", async () => {
    const admin = await createAdmin({ email: "leadadmin@example.com" });
    const createdLead = await Lead.create({
      name: "Review Lead",
      email: "reviewlead@example.com",
      phone: "9999999999",
      message: "Please follow up with pricing details.",
      formType: "consultation",
      source: "campaign"
    });

    const listResponse = await request(app)
      .get("/api/v1/leads")
      .set(authHeaderFor(admin));

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.total).toBe(1);

    const statusResponse = await request(app)
      .patch(`/api/v1/leads/${createdLead._id}/status`)
      .set(authHeaderFor(admin))
      .send({ status: "contacted" });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.data.status).toBe("contacted");

    const noteResponse = await request(app)
      .post(`/api/v1/leads/${createdLead._id}/note`)
      .set(authHeaderFor(admin))
      .send({ note: "Customer requested a callback after 6 PM." });

    expect(noteResponse.status).toBe(200);
    expect(noteResponse.body.data.notes).toContain("Customer requested a callback after 6 PM.");
  });

  it("forbids lead admin routes for unauthenticated users", async () => {
    const response = await request(app).get("/api/v1/leads");

    expect(response.status).toBe(401);
  });

  it("validates search query params and returns matching search data", async () => {
    const missingQueryResponse = await request(app).get("/api/v1/search");

    expect(missingQueryResponse.status).toBe(400);
    expect(missingQueryResponse.body.message).toBe("Validation failed");

    const category = await createCategory({ name: "Blue Sapphire" });
    const subCategory = await createSubCategory(category, { name: "Blue Sapphire Rings" });
    await createProduct({
      category,
      subCategory,
      name: "Blue Sapphire Premium",
      title: "Blue Sapphire Premium",
      tags: ["blue", "sapphire"]
    });

    const response = await request(app).get("/api/v1/search").query({ q: "Blue Sapphire" });

    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBeGreaterThan(0);
    expect(response.body.data.categories.length).toBeGreaterThan(0);
    expect(response.body.data.subCategories.length).toBeGreaterThan(0);
  });

  it("returns search suggestions and validates suggestion limits", async () => {
    const category = await createCategory({ name: "Ruby" });
    const subCategory = await createSubCategory(category, { name: "Ruby Pendants" });
    await createProduct({
      category,
      subCategory,
      name: "Ruby Pendant",
      title: "Ruby Pendant"
    });

    const invalidResponse = await request(app)
      .get("/api/v1/search/suggestions")
      .query({ q: "ruby", limit: 99 });

    expect(invalidResponse.status).toBe(400);

    const response = await request(app)
      .get("/api/v1/search/suggestions")
      .query({ q: "ruby", limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body.data.products.length).toBeGreaterThan(0);
  });

  it("returns absolute product image URLs in search and homepage responses", async () => {
    const category = await createCategory({ name: "Homepage Search Category" });
    const subCategory = await createSubCategory(category, { name: "Homepage Search Subcategory" });

    await createProduct({
      category,
      subCategory,
      name: "Rudraksha Search Product",
      title: "Rudraksha Search Product",
      tags: ["rudraksha"],
      featuredImage: "/assets/products/five-mukhi-rudraksha.jpg",
      thumbnail: "/assets/products/five-mukhi-rudraksha-thumb.webp",
      galleryImages: ["/assets/products/five-mukhi-rudraksha.jpg"],
      images: ["/assets/products/five-mukhi-rudraksha.jpg"],
      showOnHomepage: true,
      isFeatured: true
    });

    const searchResponse = await request(app)
      .get("/api/v1/search")
      .query({ q: "Rudraksha" })
      .set("Host", "frontend.test");

    expect(searchResponse.status).toBe(200);
    expect(
      searchResponse.body.data.products.some(
        (product) =>
          product.slug === "rudraksha-search-product" &&
          product.image === "http://frontend.test/assets/products/five-mukhi-rudraksha.jpg"
      )
    ).toBe(true);

    const suggestionsResponse = await request(app)
      .get("/api/v1/search/suggestions")
      .query({ q: "Rudraksha", limit: 5 })
      .set("Host", "frontend.test");

    expect(suggestionsResponse.status).toBe(200);
    expect(
      suggestionsResponse.body.data.products.some(
        (product) =>
          product.slug === "rudraksha-search-product" &&
          product.image === "http://frontend.test/assets/products/five-mukhi-rudraksha.jpg"
      )
    ).toBe(true);

    const homepageResponse = await request(app)
      .get("/api/v1/homepage")
      .set("Host", "frontend.test");

    expect(homepageResponse.status).toBe(200);
    expect(
      homepageResponse.body.data.featuredProducts.some(
        (product) =>
          product.slug === "rudraksha-search-product" &&
          product.featuredImage === "http://frontend.test/assets/products/five-mukhi-rudraksha.jpg"
      )
    ).toBe(true);
  });
});
