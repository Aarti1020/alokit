const baseUrl = process.env.SMOKE_TEST_BASE_URL || "http://127.0.0.1:5000";
const startupTimeoutMs = Number(process.env.SMOKE_TEST_STARTUP_TIMEOUT_MS) || 15000;
const requestTimeoutMs = Number(process.env.SMOKE_TEST_REQUEST_TIMEOUT_MS) || 10000;
const resetTokenOverride = process.env.SMOKE_TEST_PASSWORD_RESET_TOKEN || "";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async () => {
  const start = Date.now();

  while (Date.now() - start < startupTimeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting.
    }

    await sleep(500);
  }

  throw new Error(`Server did not become healthy within ${startupTimeoutMs}ms`);
};

const request = async (path, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const raw = await response.text();
    let json = null;

    try {
      json = raw ? JSON.parse(raw) : null;
    } catch {
      json = raw;
    }

    return { response, body: json };
  } finally {
    clearTimeout(timeout);
  }
};

const expectStatus = (name, actual, expected) => {
  if (actual !== expected) {
    throw new Error(`${name} failed. Expected ${expected}, got ${actual}`);
  }
};

let exitCode = 0;

try {
  await waitForServer();

  const checks = [];

  const root = await request("/");
  expectStatus("Root health", root.response.status, 200);
  checks.push("GET /");

  const health = await request("/api/v1/health");
  expectStatus("API health", health.response.status, 200);
  checks.push("GET /api/v1/health");

  for (const path of [
    "/api/v1/categories",
    "/api/v1/subcategories",
    "/api/v1/products",
    "/api/v1/search?q=test",
    "/api/v1/collections",
    "/api/v1/homepage",
    "/api/v1/faqs",
    "/api/v1/banners",
    "/api/v1/pages",
    "/api/v1/blogs"
  ]) {
    const result = await request(path);
    expectStatus(`Public endpoint ${path}`, result.response.status, 200);
    checks.push(`GET ${path}`);
  }

  const email = `smoke.${Date.now()}@example.com`;
  const password = "Test1234";

  const register = await request("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: "Smoke Test User",
      email,
      password,
      phone: "9999999999"
    })
  });
  expectStatus("Auth register", register.response.status, 201);
  checks.push("POST /api/v1/auth/register");

  const token = register.body?.data?.token;
  if (!token) {
    throw new Error("Register response did not include a token");
  }

  const login = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  expectStatus("Auth login", login.response.status, 200);
  checks.push("POST /api/v1/auth/login");

  const forgotPassword = await request("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  });
  expectStatus("Auth forgot password", forgotPassword.response.status, 200);
  checks.push("POST /api/v1/auth/forgot-password");

  const resetToken =
    resetTokenOverride ||
    forgotPassword.body?.data?.preview?.resetToken ||
    forgotPassword.body?.data?.resetToken;
  if (!resetToken) {
    throw new Error(
      "Forgot password did not return a test reset token. Set SMOKE_TEST_PASSWORD_RESET_TOKEN or enable EMAIL_DEV_EXPOSE_RESET_TOKEN=true in local mail mode."
    );
  }

  const resetPassword = await request("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token: resetToken,
      password: "NewTest1234",
      confirmPassword: "NewTest1234"
    })
  });
  expectStatus("Auth reset password", resetPassword.response.status, 200);
  checks.push("POST /api/v1/auth/reset-password");

  const me = await request("/api/v1/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  expectStatus("Auth me", me.response.status, 200);
  checks.push("GET /api/v1/auth/me");

  const newsletter = await request("/api/v1/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({
      email: `newsletter.${Date.now()}@example.com`
    })
  });
  expectStatus("Newsletter subscribe", newsletter.response.status, 201);
  checks.push("POST /api/v1/newsletter/subscribe");

  console.log("\nSmoke test passed.");
  console.log(`Base URL: ${baseUrl}`);
  console.log("Checks:");
  for (const check of checks) {
    console.log(`- ${check}`);
  }
} catch (error) {
  exitCode = 1;
  console.error("\nSmoke test failed.");
  console.error(`Make sure the backend is already running at ${baseUrl} before executing this script.`);
  console.error(error instanceof Error ? error.message : error);
}

process.exit(exitCode);
