import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import env from "../config/env.js";
import ApiError from "./ApiError.js";
import { buildCloudinaryPublicId, optimizeImageBuffer } from "./imageHelpers.js";
import { uploadLocalAsset } from "./localAssetStorage.js";

const uploadWithCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

const cloudinaryUpload = async (file, options = {}) => {
  if (!file?.buffer) {
    throw new ApiError(400, "Upload file is required");
  }

  const requireCloudinary = options.requireCloudinary !== false;
  const folder = options.folder || `${env.cloudinaryFolder}/products`;
  const resourceType = options.resourceType || "image";
  const publicId = buildCloudinaryPublicId({
    folder,
    fileName: options.fileName || file.originalname || "product-media"
  });

  const uploadBuffer =
    resourceType === "image" ? await optimizeImageBuffer(file.buffer) : file.buffer;

  if (env.cloudinaryMockMode || !env.hasCloudinaryCredentials) {
    if (requireCloudinary) {
      throw new ApiError(
        503,
        "Cloudinary is not configured for media uploads. Product uploads require Cloudinary storage."
      );
    }

    return uploadLocalAsset(
      {
        ...file,
        buffer: uploadBuffer
      },
      {
        folder,
        fileName: options.fileName || file.originalname || "product-media"
      }
    );
  }

  try {
    const uploadResult = await uploadWithCloudinary(uploadBuffer, {
      public_id: publicId,
      overwrite: true,
      resource_type: resourceType
    });

    return {
      ...uploadResult,
      publicId: uploadResult.public_id || publicId,
      url: uploadResult.secure_url || uploadResult.url || ""
    };
  } catch (error) {
    if (!requireCloudinary && env.nodeEnv !== "production") {
      return uploadLocalAsset(
        {
          ...file,
          buffer: uploadBuffer
        },
        {
          folder,
          fileName: options.fileName || file.originalname || "product-media"
        }
      );
    }

    throw new ApiError(
      502,
      error.message || "Failed to upload media to Cloudinary for product upload"
    );
  }
};

export default cloudinaryUpload;
