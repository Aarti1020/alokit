import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app.js";
import User from "../src/models/User.js";
import { getEmailOutbox } from "../src/services/email.service.js";

describe("Auth API", () => {
  it("registers a user and returns a token", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      fullName: "Auth User",
      email: "auth.user@example.com",
      password: "Test1234",
      phone: "9999999999"
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.role).toBe("user");
  });

  it("rejects duplicate registration", async () => {
    await User.create({
      fullName: "Existing User",
      email: "duplicate@example.com",
      password: "Test1234",
      phone: "9999999999"
    });

    const response = await request(app).post("/api/v1/auth/register").send({
      fullName: "Existing User",
      email: "duplicate@example.com",
      password: "Test1234",
      phone: "9999999999"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already exists/i);
  });

  it("rejects invalid registration payload", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      fullName: "",
      email: "bad-email",
      password: "123"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors.some((error) => error.field === "fullName")).toBe(true);
  });

  it("logs in an existing user", async () => {
    await User.create({
      fullName: "Login User",
      email: "login@example.com",
      password: "Test1234",
      phone: "9999999999"
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "login@example.com",
      password: "Test1234"
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.email).toBe("login@example.com");
  });

  it("rejects invalid credentials", async () => {
    await User.create({
      fullName: "Bad Login User",
      email: "badlogin@example.com",
      password: "Test1234",
      phone: "9999999999"
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "badlogin@example.com",
      password: "wrong-password"
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/invalid credentials/i);
  });

  it("returns 401 for me without token", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token is missing/i);
  });

  it("sends forgot-password email without exposing reset token in the response", async () => {
    await User.create({
      fullName: "Forgot User",
      email: "forgot@example.com",
      password: "Test1234",
      phone: "9999999999"
    });

    const response = await request(app).post("/api/v1/auth/forgot-password").send({
      email: "forgot@example.com"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeNull();

    const outbox = getEmailOutbox();
    expect(outbox).toHaveLength(1);
    expect(outbox[0].to).toBe("forgot@example.com");
    expect(outbox[0].subject).toMatch(/reset your alokit password/i);
    expect(outbox[0].text).toMatch(/reset your password using this link/i);
  });

  it("resets password using the emailed token and sends a confirmation email", async () => {
    await User.create({
      fullName: "Reset User",
      email: "reset@example.com",
      password: "Test1234",
      phone: "9999999999"
    });

    await request(app).post("/api/v1/auth/forgot-password").send({
      email: "reset@example.com"
    });

    const outbox = getEmailOutbox();
    expect(outbox).toHaveLength(1);

    const resetUrl = outbox[0].text.match(/https?:\/\/\S+/)?.[0];
    expect(resetUrl).toBeTruthy();

    const resetToken = new URL(resetUrl).searchParams.get("token");
    expect(resetToken).toBeTruthy();

    const response = await request(app).post("/api/v1/auth/reset-password").send({
      token: resetToken,
      password: "NewTest1234",
      confirmPassword: "NewTest1234"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeTruthy();

    const updatedUser = await User.findOne({ email: "reset@example.com" }).select(
      "+resetPasswordToken +resetPasswordExpiresAt"
    );

    expect(updatedUser.resetPasswordToken).toBe("");
    expect(updatedUser.resetPasswordExpiresAt).toBeNull();

    const sentEmails = getEmailOutbox();
    expect(sentEmails).toHaveLength(2);
    expect(sentEmails[1].subject).toMatch(/password was changed/i);
  });
});
