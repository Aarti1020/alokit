const sanitizeString = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const sanitizeObject = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeObject(item));
  }

  if (payload && typeof payload === "object") {
    return Object.keys(payload).reduce((acc, key) => {
      acc[key] = sanitizeObject(payload[key]);
      return acc;
    }, {});
  }

  return sanitizeString(payload);
};

export { sanitizeString, sanitizeObject };
