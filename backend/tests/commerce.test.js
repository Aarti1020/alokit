import request from "supertest";
import { describe, expect, it, jest } from "@jest/globals";
import Cart from "../src/models/Cart.js";
import app from "../src/app.js";
import Order from "../src/models/Order.js";
import Product from "../src/models/Product.js";
import {
  authHeaderFor,
  checkoutPayloadFor,
  createAdmin,
  createCategory,
  createProduct,
  createSubCategory,
  createUser
} from "./helpers/factories.js";

describe("Commerce API", () => {
  it("supports cart add, checkout, and mock payment verification", async () => {
    const buyer = await createUser({ email: "buyer@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 5 });

    const addCartResponse = await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: product._id.toString(),
        quantity: 1,
        selectedVariant: { label: "Style", value: "Loose Stone" }
      });

    expect(addCartResponse.status).toBe(200);
    expect(addCartResponse.body.data.items).toHaveLength(1);

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body.data.paymentGatewayMode).toBe("mock");

    const verifyResponse = await request(app)
      .post("/api/v1/payments/verify")
      .set(authHeaderFor(buyer))
      .send({
        orderId: checkoutResponse.body.data.orderId,
        razorpay_order_id: checkoutResponse.body.data.razorpayOrderId,
        razorpay_payment_id: `mock_payment_${checkoutResponse.body.data.orderId}`,
        razorpay_signature: "mock_signature"
      });

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.data.paymentStatus).toBe("paid");
    expect(verifyResponse.body.data.orderStatus).toBe("confirmed");

    const refreshedProduct = await Product.findById(product._id);
    expect(refreshedProduct.stock).toBe(4);
    expect(refreshedProduct.soldCount).toBe(1);

    const cartResponse = await request(app)
      .get("/api/v1/cart")
      .set(authHeaderFor(buyer));
    expect(cartResponse.body.data.items).toHaveLength(0);
  });

  it("returns dynamic cart and checkout summary totals with shipping", async () => {
    const buyer = await createUser({ email: "summary@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({
      category,
      subCategory,
      stock: 5,
      basePrice: 999,
      salePrice: 999
    });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: product._id.toString(),
        quantity: 2
      });

    const cartResponse = await request(app)
      .get("/api/v1/cart")
      .set(authHeaderFor(buyer));

    expect(cartResponse.status).toBe(200);
    expect(cartResponse.body.data.pricing).toEqual(
      expect.objectContaining({
        subtotal: 1998,
        shippingCharge: 199,
        total: 2197
      })
    );

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body.data.pricing).toEqual(
      expect.objectContaining({
        subtotal: 1998,
        shippingCharge: 199,
        total: 2197
      })
    );

    const order = await Order.findById(checkoutResponse.body.data.orderId);
    expect(order.pricing.total).toBe(2197);
  });

  it("rejects cart add without auth", async () => {
    const response = await request(app).post("/api/v1/cart/add").send({
      productId: "507f1f77bcf86cd799439011",
      quantity: 1
    });

    expect(response.status).toBe(401);
  });

  it("rejects cart add for unpublished product", async () => {
    const buyer = await createUser();
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, status: "draft" });

    const response = await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: product._id.toString(),
        quantity: 1
      });

    expect(response.status).toBe(400);
  });

  it("blocks cart add when product is out of stock", async () => {
    const buyer = await createUser();
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 0 });

    const response = await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: product._id.toString(),
        quantity: 1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/out of stock/i);
  });

  it("blocks cart add when requested quantity exceeds stock", async () => {
    const buyer = await createUser();
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 2 });

    const response = await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: product._id.toString(),
        quantity: 3
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/only 2 item\(s\) available/i);
  });

  it("blocks cart item quantity update beyond current stock", async () => {
    const buyer = await createUser();
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 2 });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({
        productId: product._id.toString(),
        quantity: 1
      });

    const cart = await Cart.findOne({ user: buyer._id });
    const itemId = cart.items[0]._id.toString();

    const response = await request(app)
      .patch(`/api/v1/cart/item/${itemId}`)
      .set(authHeaderFor(buyer))
      .send({ quantity: 3 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/only 2 item\(s\) available/i);
  });

  it("rejects checkout when cart is empty", async () => {
    const buyer = await createUser({ email: "emptycart@example.com" });

    const response = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/cart is empty/i);
  });

  it("revalidates stock during checkout", async () => {
    const buyer = await createUser({ email: "checkout-stock@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 2 });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 2 });

    await Product.findByIdAndUpdate(product._id, {
      $set: { stock: 1, inStock: true }
    });

    const response = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/only 1 item\(s\) available/i);
  });

  it("allows admin to list all orders but forbids normal user", async () => {
    const admin = await createAdmin();
    const buyer = await createUser();
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const adminResponse = await request(app)
      .get("/api/v1/orders")
      .set(authHeaderFor(admin));
    expect(adminResponse.status).toBe(200);
    expect(adminResponse.body.total).toBe(1);

    const buyerResponse = await request(app)
      .get("/api/v1/orders")
      .set(authHeaderFor(buyer));
    expect(buyerResponse.status).toBe(403);
  });

  it("blocks payment verification by another user", async () => {
    const buyer = await createUser({ email: "owner@example.com" });
    const attacker = await createUser({ email: "attacker@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 5 });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const response = await request(app)
      .post("/api/v1/payments/verify")
      .set(authHeaderFor(attacker))
      .send({
        orderId: checkoutResponse.body.data.orderId,
        razorpay_order_id: checkoutResponse.body.data.razorpayOrderId,
        razorpay_payment_id: `mock_payment_${checkoutResponse.body.data.orderId}`,
        razorpay_signature: "mock_signature"
      });

    expect(response.status).toBe(403);
  });

  it("returns 404 when requesting someone else's order as normal user", async () => {
    const buyer = await createUser({ email: "buyer2@example.com" });
    const otherUser = await createUser({ email: "other2@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const order = await Order.findOne({ user: buyer._id });

    const response = await request(app)
      .get(`/api/v1/orders/${order._id}`)
      .set(authHeaderFor(otherUser));

    expect(response.status).toBe(403);
  });

  it("rejects invalid payment signature", async () => {
    const buyer = await createUser({ email: "sigtest@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const response = await request(app)
      .post("/api/v1/payments/verify")
      .set(authHeaderFor(buyer))
      .send({
        orderId: checkoutResponse.body.data.orderId,
        razorpay_order_id: checkoutResponse.body.data.razorpayOrderId,
        razorpay_payment_id: `mock_payment_${checkoutResponse.body.data.orderId}`,
        razorpay_signature: "wrong_signature"
      });

    expect(response.status).toBe(400);
  });

  it("treats duplicate payment verification as idempotent", async () => {
    const buyer = await createUser({ email: "duplicate-verify@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 5 });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const payload = {
      orderId: checkoutResponse.body.data.orderId,
      razorpay_order_id: checkoutResponse.body.data.razorpayOrderId,
      razorpay_payment_id: `mock_payment_${checkoutResponse.body.data.orderId}`,
      razorpay_signature: "mock_signature"
    };

    const firstResponse = await request(app)
      .post("/api/v1/payments/verify")
      .set(authHeaderFor(buyer))
      .send(payload);

    const secondResponse = await request(app)
      .post("/api/v1/payments/verify")
      .set(authHeaderFor(buyer))
      .send(payload);

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.message).toMatch(/already verified/i);

    const refreshedProduct = await Product.findById(product._id);
    expect(refreshedProduct.stock).toBe(4);
  });

  it("rolls back verification state when stock is no longer available", async () => {
    const buyer = await createUser({ email: "stock-rollback@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 1 });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    await Product.findByIdAndUpdate(product._id, {
      $set: { stock: 0, inStock: false }
    });

    const verifyResponse = await request(app)
      .post("/api/v1/payments/verify")
      .set(authHeaderFor(buyer))
      .send({
        orderId: checkoutResponse.body.data.orderId,
        razorpay_order_id: checkoutResponse.body.data.razorpayOrderId,
        razorpay_payment_id: `mock_payment_${checkoutResponse.body.data.orderId}`,
        razorpay_signature: "mock_signature"
      });

    expect(verifyResponse.status).toBe(400);
    expect(verifyResponse.body.message).toMatch(/out of stock|only \d+ item\(s\) available/i);

    const order = await Order.findById(checkoutResponse.body.data.orderId);
    const refreshedProduct = await Product.findById(product._id);
    const cart = await Cart.findOne({ user: buyer._id });

    expect(order.paymentStatus).toBe("pending");
    expect(order.orderStatus).toBe("created");
    expect(refreshedProduct.stock).toBe(0);
    expect(cart.items).toHaveLength(1);
  });

  it("rolls back stock and order updates when cart clearing fails mid-verification", async () => {
    const buyer = await createUser({ email: "partial-failure@example.com" });
    const category = await createCategory();
    const subCategory = await createSubCategory(category);
    const product = await createProduct({ category, subCategory, stock: 5 });

    await request(app)
      .post("/api/v1/cart/add")
      .set(authHeaderFor(buyer))
      .send({ productId: product._id.toString(), quantity: 1 });

    const checkoutResponse = await request(app)
      .post("/api/v1/orders/checkout")
      .set(authHeaderFor(buyer))
      .send(checkoutPayloadFor(buyer.email));

    const cartClearSpy = jest
      .spyOn(Cart, "findOneAndUpdate")
      .mockRejectedValueOnce(new Error("Injected cart clear failure"));

    const verifyResponse = await request(app)
      .post("/api/v1/payments/verify")
      .set(authHeaderFor(buyer))
      .send({
        orderId: checkoutResponse.body.data.orderId,
        razorpay_order_id: checkoutResponse.body.data.razorpayOrderId,
        razorpay_payment_id: `mock_payment_${checkoutResponse.body.data.orderId}`,
        razorpay_signature: "mock_signature"
      });

    cartClearSpy.mockRestore();

    expect(verifyResponse.status).toBe(500);
    expect(verifyResponse.body.message).toMatch(/injected cart clear failure/i);

    const order = await Order.findById(checkoutResponse.body.data.orderId);
    const refreshedProduct = await Product.findById(product._id);
    const cart = await Cart.findOne({ user: buyer._id });

    expect(order.paymentStatus).toBe("pending");
    expect(order.orderStatus).toBe("created");
    expect(refreshedProduct.stock).toBe(5);
    expect(cart.items).toHaveLength(1);
  });
});
