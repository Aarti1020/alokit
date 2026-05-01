import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import env from "../config/env.js";

const MAX_DIMENSION = 1600;

export const optimizeImageBuffer = async (buffer) => {
  const transformer = sharp(buffer, { failOn: "none" }).rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true
  });

  return transformer.webp({
    quality: 82,
    effort: 4
  }).toBuffer();
};

export const buildCloudinaryPublicId = ({ folder = "", fileName = "" } = {}) => {
  const safeFolder = folder.trim().replace(/^\/+|\/+$/g, "");
  const safeFileName = fileName
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return [safeFolder, safeFileName || `image-${Date.now()}`].filter(Boolean).join("/");
};

export const getOptimizedImageVariants = (image = {}) => {
  const publicId =
    typeof image?.publicId === "string"
      ? image.publicId.trim()
      : typeof image?.public_id === "string"
        ? image.public_id.trim()
        : "";
  const imageUrl = typeof image?.url === "string" ? image.url.trim() : "";
  const usesLocalAssetUrl =
    imageUrl.startsWith("/assets/") ||
    imageUrl.startsWith("/media/") ||
    imageUrl.includes("/assets/") ||
    imageUrl.includes("/media/");
  const usesLocalAssetPublicId =
    publicId.startsWith("/") ||
    publicId.startsWith("http://") ||
    publicId.startsWith("https://") ||
    publicId.includes("/assets/") ||
    publicId.includes("/media/");

  if (!publicId) {
    return {
      original: imageUrl,
      thumbnail: imageUrl,
      productCard: imageUrl,
      productDetail: imageUrl
    };
  }

  if (usesLocalAssetUrl || usesLocalAssetPublicId || env.cloudinaryMockMode || !env.hasCloudinaryCredentials) {
    return {
      original: imageUrl,
      thumbnail: imageUrl,
      productCard: imageUrl,
      productDetail: imageUrl
    };
  }

  const buildVariant = (transformations) =>
    cloudinary.url(publicId, {
      secure: true,
      format: "webp",
      quality: "auto:good",
      fetch_format: "auto",
      transformation: transformations
    });

  return {
    original: imageUrl,
    thumbnail: buildVariant([{ width: 320, height: 320, crop: "fill", gravity: "auto" }]),
    productCard: buildVariant([{ width: 640, height: 640, crop: "fill", gravity: "auto" }]),
    productDetail: buildVariant([{ width: 1200, height: 1200, crop: "limit" }])
  };
};
