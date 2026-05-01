import nodemailer from "nodemailer";
import env from "../config/env.js";
import { emailTemplates } from "./email/templates.js";

const emailOutbox = [];

const redactEmailAddress = (email = "") => {
  const [localPart = "", domain = ""] = String(email).split("@");
  if (!localPart || !domain) {
    return "redacted";
  }

  if (localPart.length <= 2) {
    return `${localPart[0] || "*"}***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
};

const buildSafeErrorDetails = (error) => ({
  name: error?.name || "Error",
  message: error?.message || "Unknown email error",
  code: error?.code || "UNKNOWN"
});

const logEmailEvent = (level, message, metadata = {}) => {
  const logger = level === "error" ? console.error : console.info;
  logger(`[email] ${message}`, metadata);
};

const createSmtpTransport = () =>
  nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth:
      env.smtpUser && env.smtpPassword
        ? {
            user: env.smtpUser,
            pass: env.smtpPassword
          }
        : undefined
  });

const createLocalTransport = () => ({
  async sendMail(message) {
    const entry = {
      id: `local-${Date.now()}-${emailOutbox.length + 1}`,
      mode: "local",
      to: message.to,
      from: message.from,
      subject: message.subject,
      text: message.text,
      html: message.html,
      sentAt: new Date().toISOString()
    };

    emailOutbox.push(entry);

    logEmailEvent("info", "Captured email in local mail mode", {
      to: redactEmailAddress(message.to),
      subject: message.subject
    });

    return {
      messageId: entry.id,
      accepted: [message.to],
      rejected: [],
      localPreview: entry
    };
  }
});

const getTransport = () => {
  if (env.emailMode === "smtp") {
    return createSmtpTransport();
  }

  return createLocalTransport();
};

const shouldRetry = (error) =>
  Boolean(
    error?.code &&
      ["ETIMEDOUT", "ECONNECTION", "ECONNRESET", "ESOCKET", "EAI_AGAIN"].includes(error.code)
  );

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class EmailService {
  constructor() {
    this.transport = getTransport();
  }

  async send({ to, subject, text, html, metadata = {} }) {
    const message = {
      from: env.emailFrom,
      to,
      subject,
      text,
      html
    };

    let attempt = 0;

    while (attempt <= env.emailSendRetries) {
      try {
        const result = await this.transport.sendMail(message);

        return {
          provider: env.emailMode,
          messageId: result.messageId || "",
          preview: result.localPreview || null,
          metadata
        };
      } catch (error) {
        attempt += 1;

        logEmailEvent("error", "Email delivery attempt failed", {
          attempt,
          maxAttempts: env.emailSendRetries + 1,
          provider: env.emailMode,
          to: redactEmailAddress(to),
          subject,
          metadata,
          error: buildSafeErrorDetails(error)
        });

        if (attempt > env.emailSendRetries || !shouldRetry(error)) {
          throw error;
        }

        await wait(200 * attempt);
      }
    }

    throw new Error("Email delivery failed");
  }

  async sendForgotPasswordEmail({ to, fullName, resetUrl, expiresInMinutes, resetToken }) {
    const template = emailTemplates.forgotPassword({
      fullName,
      resetUrl,
      expiresInMinutes
    });

    const delivery = await this.send({
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
      metadata: {
        template: "forgotPassword"
      }
    });

    if (delivery.preview && env.emailDevExposeResetToken) {
      delivery.preview = {
        ...delivery.preview,
        resetUrl,
        resetToken
      };
    }

    return delivery;
  }

  async sendPasswordResetConfirmationEmail({ to, fullName }) {
    const template = emailTemplates.passwordResetConfirmation({ fullName });

    return this.send({
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
      metadata: {
        template: "passwordResetConfirmation"
      }
    });
  }
}

let emailService;

export const getEmailService = () => {
  if (!emailService) {
    emailService = new EmailService();
  }

  return emailService;
};

export const getEmailOutbox = () => [...emailOutbox];

export const clearEmailOutbox = () => {
  emailOutbox.length = 0;
};
