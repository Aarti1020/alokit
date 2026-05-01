import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app.js";
import RudrakshaCalculator from "../src/models/RudrakshaCalculator.js";
import {
  createCategory,
  createProduct,
  createSubCategory
} from "./helpers/factories.js";

const validPayload = {
  suggestionBy: "BIRTH",
  name: "Nikhil",
  email: "nikhil@example.com",
  phone: "9876543210",
  dateOfBirth: "1998-04-21",
  birthTime: "14:30",
  placeOfBirth: "Mumbai"
};

describe("Rudraksha Calculator API", () => {
  it("valid submit returns 201 and saves the recommendation result", async () => {
    const category = await createCategory({ name: "Rudraksha" });
    const subCategory = await createSubCategory(category, { name: "Three Mukhi Rudraksha" });

    await createProduct({
      category,
      subCategory,
      name: "3 Mukhi Rudraksha Bead",
      title: "3 Mukhi Rudraksha Bead",
      productType: "rudraksha",
      specifications: { mukhi: 3 },
      isFeatured: true,
      showOnHomepage: true,
      shortDescription: "Featured admin Rudraksha product",
      featuredImage: "/assets/products/three-mukhi.jpg",
      thumbnail: "/assets/products/three-mukhi.jpg",
      galleryImages: ["/assets/products/three-mukhi.jpg"],
      images: ["/assets/products/three-mukhi.jpg"]
    });

    const response = await request(app)
      .post("/api/v1/rudraksha-calculator/submit")
      .send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeTruthy();
    expect(response.body.data.recommendation.mukhi).toBe(3);
    expect(response.body.data.products).toHaveLength(1);
    expect(response.body.data.products[0].title).toBe("3 Mukhi Rudraksha Bead");
    expect(response.body.data.products[0].image).toBe("/assets/products/three-mukhi.jpg");
    expect(response.body.data.products[0].shortDescription).toBe("Featured admin Rudraksha product");

    const savedSubmission = await RudrakshaCalculator.findById(response.body.data.id);
    expect(savedSubmission).toBeTruthy();
    expect(savedSubmission.recommendation.mukhi).toBe(3);
    expect(savedSubmission.recommendedProducts).toHaveLength(1);
  });

  it("validation failure returns 400", async () => {
    const response = await request(app)
      .post("/api/v1/rudraksha-calculator/submit")
      .send({
        suggestionBy: "INVALID",
        name: "",
        email: "not-an-email",
        dateOfBirth: "31/31/1998"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("only returns featured or homepage admin products for recommendations", async () => {
    const category = await createCategory({ name: "Featured Rudraksha" });
    const subCategory = await createSubCategory(category, { name: "Featured Three Mukhi" });

    await createProduct({
      category,
      subCategory,
      name: "3 Mukhi Hidden Rudraksha",
      title: "3 Mukhi Hidden Rudraksha",
      productType: "rudraksha",
      specifications: { mukhi: 3 },
      isFeatured: false,
      showOnHomepage: false
    });

    await createProduct({
      category,
      subCategory,
      name: "3 Mukhi Homepage Rudraksha",
      title: "3 Mukhi Homepage Rudraksha",
      productType: "rudraksha",
      specifications: { mukhi: 3 },
      isFeatured: false,
      showOnHomepage: true
    });

    const response = await request(app)
      .post("/api/v1/rudraksha-calculator/submit")
      .send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.products).toHaveLength(1);
    expect(response.body.data.products[0].title).toBe("3 Mukhi Homepage Rudraksha");
  });

  it("response includes recommendation and derived profile", async () => {
    const response = await request(app)
      .post("/api/v1/rudraksha-calculator/submit")
      .send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.profile).toEqual({
      birthNumber: 3,
      zodiacSign: "Taurus",
      dayOfWeek: "Tuesday"
    });
    expect(response.body.data.recommendation).toEqual(
      expect.objectContaining({
        number: 3,
        mukhi: 3,
        name: "3 Mukhi Rudraksha"
      })
    );
  });
});
