export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/controllers/auth.controller.js",
    "src/controllers/category.controller.js",
    "src/controllers/subcategory.controller.js",
    "src/controllers/product.controller.js",
    "src/controllers/cart.controller.js",
    "src/controllers/order.controller.js",
    "src/controllers/payment.controller.js",
    "src/middlewares/auth.middleware.js",
    "src/middlewares/error.middleware.js",
    "src/middlewares/notFound.middleware.js",
    "src/utils/verifyRazorpaySignature.js"
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  }
};
