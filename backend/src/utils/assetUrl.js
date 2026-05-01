const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:/i;
const MOCK_CLOUDINARY_HOSTNAMES = new Set(["mock-cloudinary.local"]);
const LOCAL_ASSET_PREFIXES = ["/assets/", "/media/"];

const trimTrailingSlash = (value = "") => value.replace(/\/+$/g, "");
const trimLeadingSlash = (value = "") => value.replace(/^\/+/g, "");
const isLocalAssetPath = (value = "") => LOCAL_ASSET_PREFIXES.some((prefix) => value.startsWith(prefix));

export const getRequestBaseUrl = (req) => {
  if (!req) {
    return "";
  }

  const forwardedProto = req.headers["x-forwarded-proto"];
  const forwardedHost = req.headers["x-forwarded-host"];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) || req.protocol;
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || req.get("host");

  if (!protocol || !host) {
    return "";
  }

  return `${protocol}://${host}`;
};

export const resolveAssetUrl = (value = "", baseUrl = "") => {
  const normalizedValue = typeof value === "string" ? value.trim() : "";

  if (!normalizedValue) {
    return "";
  }

  if (ABSOLUTE_URL_PATTERN.test(normalizedValue) || normalizedValue.startsWith("//")) {
    try {
      const parsed = new URL(normalizedValue);
      if (MOCK_CLOUDINARY_HOSTNAMES.has(parsed.hostname)) {
        const assetPath = `/assets/${trimLeadingSlash(parsed.pathname)}`;
        return `${baseUrl ? trimTrailingSlash(baseUrl) : ""}${assetPath}`;
      }
    } catch {}

    return normalizedValue;
  }

  if (!baseUrl) {
    return normalizedValue.startsWith("/") ? normalizedValue : `/${trimLeadingSlash(normalizedValue)}`;
  }

  return `${trimTrailingSlash(baseUrl)}/${trimLeadingSlash(normalizedValue)}`;
};
