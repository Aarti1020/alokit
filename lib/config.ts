const trimTrailingSlash = (value: string) => value.replace(/\/+$/g, "");
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);
const INVALID_REMOTE_IMAGE_HOSTNAMES = new Set(["images.alokit.local", "mock-cloudinary.local"]);
const EMBEDDED_ASSET_PATH_PATTERN = /\/((?:public\/)?(?:assets|media))\/[^?#]+/i;
const DUPLICATE_EXTENSION_PATTERN = /(\.[a-z0-9]+)\1$/i;

const normalizeAssetPath = (value: string) => value.replace(DUPLICATE_EXTENSION_PATTERN, "$1");

const normalizeLegacyImagePath = (value: string) => value.trim().replace(/\\/g, "/");

const defaultApiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.alokit.co/api/v1"
    : "/backend-proxy/api/v1";

const defaultBackendOrigin =
  process.env.NODE_ENV === "production"
    ? "https://api.alokit.co"
    : "http://localhost:5000";

export const API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || defaultApiBaseUrl
);

export const BACKEND_ORIGIN = trimTrailingSlash(
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN || defaultBackendOrigin
);

export const buildApiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const buildAssetUrl = (value?: string | null) => {
  if (!value) return "";
  value = normalizeLegacyImagePath(value);

  if (value.startsWith("/backend-proxy/") || value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("/assets/")) {
    return `/backend-proxy${normalizeAssetPath(value)}`;
  }

  if (value.startsWith("/media/")) {
    return `/backend-proxy${normalizeAssetPath(value)}`;
  }

  if (value.startsWith("/public/assets/")) {
  return `/backend-proxy${normalizeAssetPath(value.replace("/public", ""))}`;
}

if (value.startsWith("/public/media/")) {
  return `/backend-proxy${normalizeAssetPath(value.replace("/public", ""))}`;
}

if (
  value.startsWith(`${BACKEND_ORIGIN}/public/assets/`) ||
  value.startsWith(`${BACKEND_ORIGIN}/public/media/`)
) {
  const fixed = value
    .replace(BACKEND_ORIGIN, "")
    .replace("/public", "");

  return `/backend-proxy${normalizeAssetPath(fixed)}`;
}

 

  try {
    const parsed = new URL(value);
    if (INVALID_REMOTE_IMAGE_HOSTNAMES.has(parsed.hostname)) {
      return "";
    }

    const embeddedAssetPath = parsed.pathname.match(EMBEDDED_ASSET_PATH_PATTERN)?.[0];
    if (embeddedAssetPath) {
      return `/backend-proxy${normalizeAssetPath(embeddedAssetPath)}`;
    }

    if (
      LOCAL_HOSTNAMES.has(parsed.hostname) &&
      (
        parsed.pathname.startsWith("/assets/") ||
        parsed.pathname.startsWith("/media/") ||
        parsed.pathname.startsWith("/public/assets/") ||
        parsed.pathname.startsWith("/public/media/")
      )
    ) {
      return `/backend-proxy${normalizeAssetPath(parsed.pathname)}`;
    }
  } catch {}

  return value;
};

export const buildDisplayImageUrl = (value?: string | null) => {
  if (!value) return "";

const assetUrl = buildAssetUrl(value);

if (assetUrl) {
  return assetUrl;
}

  value = normalizeLegacyImagePath(value);

  try {
    const parsed = new URL(value);
    if (INVALID_REMOTE_IMAGE_HOSTNAMES.has(parsed.hostname)) {
      return "";
    }

    const embeddedAssetPath = parsed.pathname.match(EMBEDDED_ASSET_PATH_PATTERN)?.[0];
    if (embeddedAssetPath) {
      return `/backend-proxy${normalizeAssetPath(embeddedAssetPath)}`;
    }

    if (
      LOCAL_HOSTNAMES.has(parsed.hostname) &&
      (
        parsed.pathname.startsWith("/assets/") ||
        parsed.pathname.startsWith("/media/") ||
        parsed.pathname.startsWith("/public/assets/") ||
        parsed.pathname.startsWith("/public/media/")
      )
    ) {
      return `/backend-proxy${normalizeAssetPath(parsed.pathname)}`;
    }
  } catch {
    return value;
  }

  return value;
};
