const hasFilledHoneypot = (payload = {}) => {
  return typeof payload.website === "string" && payload.website.trim().length > 0;
};

const buildSpamSafeSuccess = (message) => ({
  success: true,
  message,
  data: null
});

export { buildSpamSafeSuccess, hasFilledHoneypot };
