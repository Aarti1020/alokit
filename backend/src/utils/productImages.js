import cloudinaryUpload from "./cloudinaryUpload.js";
import { sanitizeString } from "./sanitizeInput.js";

const PRODUCT_MEDIA_LOG_PREFIX = "[product-media]";

const toArray = (value) => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const logProductMedia = (level, message, metadata = {}) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const logger = typeof console[level] === "function" ? console[level] : console.log;
  if (Object.keys(metadata).length) {
    logger(`${PRODUCT_MEDIA_LOG_PREFIX} ${message}`, metadata);
    return;
  }

  logger(`${PRODUCT_MEDIA_LOG_PREFIX} ${message}`);
};

const normalizeProductImageObject = (image, index, fallbackAlt, mapUrl) => {
  if (typeof image === "string") {
    const url = mapUrl(image);
    if (!url) {
      return null;
    }

    return {
      publicId: "",
      url,
      alt: sanitizeString(fallbackAlt || ""),
      isPrimary: index === 0
    };
  }

  if (!image || typeof image !== "object") {
    return null;
  }

  const url = mapUrl(image.url || image.secure_url || "");
  if (!url) {
    return null;
  }

  return {
    publicId: sanitizeString(image.publicId || image.public_id || ""),
    url,
    alt: sanitizeString(image.alt || fallbackAlt || ""),
    isPrimary: Boolean(image.isPrimary)
  };
};

export const normalizeProductImages = ({
  images = [],
  fallbackAlt = "",
  mapUrl = (value) => sanitizeString(value || "")
} = {}) => {
  const normalizedImages = toArray(images)
    .map((image, index) => normalizeProductImageObject(image, index, fallbackAlt, mapUrl))
    .filter((image) => image?.url);

  if (normalizedImages.length && !normalizedImages.some((image) => image.isPrimary)) {
    normalizedImages[0].isPrimary = true;
  }

  return normalizedImages.map((image, index, list) => ({
    publicId: sanitizeString(image.publicId || ""),
    url: sanitizeString(image.url || ""),
    alt: sanitizeString(image.alt || fallbackAlt || ""),
    isPrimary: list.some((item) => item.isPrimary) ? Boolean(image.isPrimary) : index === 0
  }));
};

export const resolveProductThumbnail = (images = []) =>
  sanitizeString(images.find((image) => image?.isPrimary)?.url || images[0]?.url || "");

export const normalizeProductMedia = (
  productDoc = {},
  {
    fallbackAlt = "",
    mapUrl = (value) => sanitizeString(value || ""),
    logContext = ""
  } = {}
) => {
  const imageSources = [
    productDoc.images,
    productDoc.galleryImages,
    productDoc.featuredImage || productDoc.thumbnail
      ? [productDoc.featuredImage || productDoc.thumbnail]
      : []
  ];
  const images =
    imageSources
      .map((source) =>
        normalizeProductImages({
          images: source,
          fallbackAlt,
          mapUrl
        })
      )
      .find((normalizedImages) => normalizedImages.length > 0) || [];

  const galleryImages = normalizeProductImages({
    images: productDoc.galleryImages,
    fallbackAlt,
    mapUrl
  });
  const thumbnail = resolveProductThumbnail(images);
  const primaryImageObject = images.find((image) => image.isPrimary) || images[0] || null;
  const primaryImage = sanitizeString(primaryImageObject?.url || thumbnail || "");

  if (
    logContext &&
    (productDoc.thumbnail || productDoc.featuredImage || productDoc.galleryImages?.length) &&
    !images.length
  ) {
    logProductMedia("warn", "Unable to normalize legacy product media into canonical images", {
      context: logContext,
      productId: productDoc._id?.toString?.() || "",
      slug: productDoc.slug || ""
    });
  }

  return {
    images,
    thumbnail,
    primaryImage,
    primaryImageObject,
    featuredImage: primaryImage,
    galleryImages: galleryImages.length
      ? galleryImages.map((image) => image.url)
      : images.map((image) => image.url),
    hasMedia: images.length > 0
  };
};

export const buildProductImages = async (
  files = [],
  fallbackAlt = "",
  imageAlts = [],
  options = {}
) => {
  if (!Array.isArray(files) || !files.length) {
    return [];
  }

  logProductMedia("info", "Uploading product images", {
    count: files.length,
    folder: options.folder || "alokit/products"
  });

  const uploadedImages = await Promise.all(
    files.map(async (file, index) => {
      const uploadResult = await cloudinaryUpload(file, {
        folder: options.folder || "alokit/products",
        fileName: `${fallbackAlt || "product-image"}-${index + 1}`,
        requireCloudinary: true
      });

      return {
        publicId: sanitizeString(uploadResult.publicId || uploadResult.public_id || ""),
        url: sanitizeString(uploadResult.url || uploadResult.secure_url || ""),
        alt: sanitizeString(imageAlts[index] || fallbackAlt || ""),
        isPrimary: index === 0
      };
    })
  );

  return normalizeProductImages({
    images: uploadedImages,
    fallbackAlt
  });
};

export const buildProductVideo = async (file, fallbackTitle = "", options = {}) => {
  if (!file?.buffer) {
    return null;
  }

  logProductMedia("info", "Uploading product video", {
    folder: options.folder || "alokit/products/videos",
    size: file.size || 0
  });

  const uploadResult = await cloudinaryUpload(file, {
    folder: options.folder || "alokit/products/videos",
    fileName: `${fallbackTitle || "product-video"}-video`,
    resourceType: "video",
    requireCloudinary: true
  });

  return {
    publicId: sanitizeString(uploadResult.publicId || uploadResult.public_id || ""),
    url: sanitizeString(uploadResult.url || uploadResult.secure_url || ""),
    mimeType: sanitizeString(file.mimetype || ""),
    size: Number(file.size) || 0
  };
};

export const getProductMediaPublicIds = (productDoc = {}) =>
  [
    ...normalizeProductMedia(productDoc, {
      fallbackAlt: productDoc.title || productDoc.name || ""
    }).images.map((image) => image.publicId),
    productDoc.productVideo?.publicId
  ].filter(Boolean);

export const hasProductImageContent = ({
  files = [],
  images = [],
  galleryImages = [],
  featuredImage = "",
  thumbnail = ""
} = {}) =>
  Boolean(
    (Array.isArray(files) && files.length) ||
      (Array.isArray(files?.images) && files.images.length) ||
      normalizeProductMedia(
        {
          images,
          galleryImages,
          featuredImage,
          thumbnail
        },
        { fallbackAlt: "" }
      ).images.length
  );

export { logProductMedia };
