import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const explicitEnvFile = process.env.ENV_FILE;
const resolvedEnvPath = explicitEnvFile
  ? join(__dirname, "../../", explicitEnvFile)
  : join(__dirname, "../../.env");

dotenv.config({
  path: resolvedEnvPath,
  quiet: true
});

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const nodeEnv = process.env.NODE_ENV || "development";
const isLocalMongoUri = /^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i.test(
  process.env.MONGO_URI || ""
);
const hasRazorpayCredentials = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);
const hasSmtpCredentials = Boolean(
  process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.SENDER_EMAIL
);
const razorpayMockMode =
  process.env.RAZORPAY_MOCK_MODE === "true" ||
  (process.env.RAZORPAY_MOCK_MODE !== "false" && nodeEnv !== "production");
const emailMode =
  process.env.EMAIL_MODE ||
  (hasSmtpCredentials ? "smtp" : nodeEnv === "production" ? "smtp" : "local");
const mongoTransactionsRequired =
  process.env.MONGO_TRANSACTIONS_REQUIRED === "true" || nodeEnv === "production";
const mongoAllowTransactionFallback =
  process.env.MONGO_ALLOW_TRANSACTION_FALLBACK === "true" ||
  (process.env.MONGO_ALLOW_TRANSACTION_FALLBACK !== "false" &&
    nodeEnv !== "production" &&
    isLocalMongoUri);

if (emailMode === "smtp" && !hasSmtpCredentials && nodeEnv === "production") {
  throw new Error(
    "Missing SMTP configuration for production email sending. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SENDER_EMAIL."
  );
}

const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  mongoReplicaSet: process.env.MONGO_REPLICA_SET || "",
  mongoDirectConnection:
    process.env.MONGO_DIRECT_CONNECTION === "true"
      ? true
      : process.env.MONGO_DIRECT_CONNECTION === "false"
        ? false
        : undefined,
  mongoTransactionsRequired,
  mongoAllowTransactionFallback,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  passwordResetExpiresInMinutes: Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES) || 15,
  passwordResetPath: process.env.PASSWORD_RESET_PATH || "/reset-password",
  apiBaseUrl:
    process.env.API_BASE_URL ||
    process.env.VITE_API_URL ||
    "https://api.alokit.co/api/v1",
  emailMode,
  emailFrom: process.env.SENDER_EMAIL || "no-reply@alokit.local",
  emailSendRetries: Number(process.env.EMAIL_SEND_RETRIES) || 1,
  emailDevExposeResetToken: process.env.EMAIL_DEV_EXPOSE_RESET_TOKEN === "true",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  smtpSecure:
    process.env.SMTP_SECURE === "true" ||
    (!process.env.SMTP_SECURE && Number(process.env.SMTP_PORT) === 465),
  hasSmtpCredentials,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  razorpayMockMode,
  hasRazorpayCredentials,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "alokit",
  cloudinaryMockMode:
    process.env.CLOUDINARY_MOCK_MODE === "true" ||
    (process.env.CLOUDINARY_MOCK_MODE !== "false" &&
      !(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) &&
      nodeEnv !== "production"),
  hasCloudinaryCredentials: Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  ),
  productionApiBase: "https://api.alokit.co",
  localApiBase: "http://localhost:5000/api/v1"
};

export default env;
