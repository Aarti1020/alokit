import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import ApiError from "./ApiError.js";
import { buildCloudinaryPublicId, optimizeImageBuffer } from "./imageHelpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicRoot = path.join(__dirname, "../../public");
const assetsRoot = path.join(publicRoot, "assets");

const ensureDirectory = async (directoryPath) => {
  await fs.mkdir(directoryPath, { recursive: true });
};

const toAssetUrl = (folder = "", fileName = "") =>
  `/assets/${[folder.replace(/^\/+|\/+$/g, ""), fileName].filter(Boolean).join("/")}`;

const toAbsoluteAssetPath = (assetUrl = "") => {
  const normalizedPath = assetUrl.replace(/^\/+/, "");
  return path.join(publicRoot, normalizedPath);
};

export const uploadLocalAsset = async (file, options = {}) => {
  if (!file?.buffer) {
    throw new ApiError(400, "Image file is required");
  }

  const folder = (options.folder || "products").replace(/^\/+|\/+$/g, "");
  const directoryPath = path.join(assetsRoot, folder);
  const baseName = buildCloudinaryPublicId({
    fileName: options.fileName || file.originalname || "product-image"
  });
  const outputFileName = `${baseName}-${Date.now()}.webp`;
  const assetUrl = toAssetUrl(folder, outputFileName);
  const optimizedBuffer = await optimizeImageBuffer(file.buffer);

  await ensureDirectory(directoryPath);
  await fs.writeFile(path.join(directoryPath, outputFileName), optimizedBuffer);

  return {
    public_id: assetUrl,
    secure_url: assetUrl
  };
};

export const deleteLocalAssets = async (assetUrls = []) => {
  const uniqueAssetUrls = [...new Set((assetUrls || []).filter(Boolean))];

  if (!uniqueAssetUrls.length) {
    return { deleted: {} };
  }

  const deleted = {};

  await Promise.all(
    uniqueAssetUrls.map(async (assetUrl) => {
      if (!assetUrl.startsWith("/assets/")) {
        deleted[assetUrl] = "skipped";
        return;
      }

      try {
        await fs.unlink(toAbsoluteAssetPath(assetUrl));
        deleted[assetUrl] = "deleted";
      } catch (error) {
        if (error.code === "ENOENT") {
          deleted[assetUrl] = "not_found";
          return;
        }

        throw new ApiError(500, error.message || "Failed to delete local asset");
      }
    })
  );

  return { deleted };
};
