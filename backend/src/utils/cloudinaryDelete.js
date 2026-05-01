import cloudinary from "../config/cloudinary.js";
import env from "../config/env.js";
import ApiError from "./ApiError.js";
import { deleteLocalAssets } from "./localAssetStorage.js";

const cloudinaryDelete = async (publicIds = []) => {
  const uniquePublicIds = [...new Set((publicIds || []).filter(Boolean))];

  if (!uniquePublicIds.length) {
    return { deleted: {} };
  }

  const localAssetIds = uniquePublicIds.filter((publicId) => publicId.startsWith("/assets/"));
  const cloudinaryPublicIds = uniquePublicIds.filter((publicId) => !publicId.startsWith("/assets/"));
  const deleted = {};

  if (localAssetIds.length) {
    const localDeleteResult = await deleteLocalAssets(localAssetIds);
    Object.assign(deleted, localDeleteResult.deleted || {});
  }

  if (!cloudinaryPublicIds.length) {
    return { deleted };
  }

  if (env.cloudinaryMockMode || !env.hasCloudinaryCredentials) {
    throw new ApiError(503, "Cloudinary is not configured for remote asset deletion.");
  }

  try {
    const imageResult = await cloudinary.api.delete_resources(cloudinaryPublicIds, {
      resource_type: "image"
    });
    const videoResult = await cloudinary.api.delete_resources(cloudinaryPublicIds, {
      resource_type: "video"
    });

    return {
      ...imageResult,
      deleted: {
        ...deleted,
        ...(imageResult.deleted || {}),
        ...(videoResult.deleted || {})
      }
    };
  } catch (error) {
    throw new ApiError(502, error.message || "Failed to delete Cloudinary product media");
  }
};

export default cloudinaryDelete;
