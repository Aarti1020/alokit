const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const createForgotPasswordTemplate = ({ fullName, resetUrl, expiresInMinutes }) => {
  const safeName = escapeHtml(fullName || "there");
  const safeResetUrl = escapeHtml(resetUrl);

  return {
    subject: "Reset your Alokit password",
    text: [
      `Hi ${fullName || "there"},`,
      "",
      "We received a request to reset your Alokit password.",
      `Reset your password using this link: ${resetUrl}`,
      "",
      `This link expires in ${expiresInMinutes} minutes.`,
      "If you did not request this, you can safely ignore this email."
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <p>Hi ${safeName},</p>
        <p>We received a request to reset your Alokit password.</p>
        <p>
          <a
            href="${safeResetUrl}"
            style="display: inline-block; padding: 12px 20px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 6px;"
          >
            Reset Password
          </a>
        </p>
        <p>If the button does not work, copy and paste this URL into your browser:</p>
        <p><a href="${safeResetUrl}">${safeResetUrl}</a></p>
        <p>This link expires in ${expiresInMinutes} minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `
  };
};

const createPasswordResetConfirmationTemplate = ({ fullName }) => {
  const safeName = escapeHtml(fullName || "there");

  return {
    subject: "Your Alokit password was changed",
    text: [
      `Hi ${fullName || "there"},`,
      "",
      "This is a confirmation that your Alokit password was changed successfully.",
      "If you did not make this change, please contact support immediately."
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <p>Hi ${safeName},</p>
        <p>This is a confirmation that your Alokit password was changed successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      </div>
    `
  };
};

export const emailTemplates = {
  forgotPassword: createForgotPasswordTemplate,
  passwordResetConfirmation: createPasswordResetConfirmationTemplate
};
