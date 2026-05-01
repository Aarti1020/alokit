import multer from "multer";
import ApiError from "../utils/ApiError.js";

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_PRODUCT_IMAGE_COUNT = 8;
const MAX_PRODUCT_IMAGE_SIZE = 2 * 1024 * 1024;
const MIN_PRODUCT_VIDEO_SIZE = 2048 * 1024;
const MAX_PRODUCT_VIDEO_SIZE = 5120 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname !== "video" && ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  if (file.fieldname === "video" && ALLOWED_VIDEO_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new ApiError(400, "Only jpg, jpeg, png, webp images and mp4, webm, mov videos are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_PRODUCT_VIDEO_SIZE,
    files: MAX_PRODUCT_IMAGE_COUNT + 1
  }
});

const parseMaybeJson = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
};

export const parseMultipartFields = (fields = []) => (req, res, next) => {
  if (!req.is("multipart/form-data")) {
    next();
    return;
  }

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      req.body[field] = parseMaybeJson(req.body[field]);
    }
  }

  next();
};

export const validateProductMediaUpload = (req, res, next) => {
  const images = Array.isArray(req.files?.images)
    ? req.files.images
    : Array.isArray(req.files)
      ? req.files
      : [];
  const videos = Array.isArray(req.files?.video) ? req.files.video : [];

  if (images.length > MAX_PRODUCT_IMAGE_COUNT) {
    next(new ApiError(400, `You can upload up to ${MAX_PRODUCT_IMAGE_COUNT} images only`));
    return;
  }

  const oversizedImage = images.find((file) => file.size > MAX_PRODUCT_IMAGE_SIZE);
  if (oversizedImage) {
    next(new ApiError(400, "Each product image must be 2MB or smaller"));
    return;
  }

  if (videos.length > 1) {
    next(new ApiError(400, "Only one product video can be uploaded"));
    return;
  }

  const video = videos[0];
  if (video && (video.size < MIN_PRODUCT_VIDEO_SIZE || video.size > MAX_PRODUCT_VIDEO_SIZE)) {
    next(new ApiError(400, "Product video must be between 2048 KB and 5120 KB"));
    return;
  }

  next();
};

export const uploadProductImages = [
  upload.array("images", MAX_PRODUCT_IMAGE_COUNT),
  validateProductMediaUpload
];
export const uploadProductMedia = [
  upload.fields([
    { name: "images", maxCount: MAX_PRODUCT_IMAGE_COUNT },
    { name: "video", maxCount: 1 }
  ]),
  validateProductMediaUpload
];
export const uploadSingleImage = (fieldName) => upload.single(fieldName);
export default upload;
