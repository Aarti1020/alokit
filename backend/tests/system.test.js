import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import app from "../src/app.js";

describe("System API", () => {
  it("returns root status payload", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.apiBase).toBeTruthy();
  });

  it("returns health details including mongo transaction capability", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.timestamp).toBeTruthy();
    expect(response.body.data.mongoTransactions).toMatchObject({
      supported: expect.any(Boolean),
      fallbackAllowed: expect.any(Boolean),
      topology: expect.any(String),
      mode: expect.any(String)
    });
  });

  it("allows CORS preflight for configured frontend origins", async () => {
    const response = await request(app)
      .options("/api/v1/auth/login")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("does not grant CORS for unknown origins", async () => {
    const response = await request(app)
      .options("/api/v1/auth/login")
      .set("Origin", "https://evil.example.com")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/route not found/i);
  });
});

