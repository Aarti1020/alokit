import Banner from "../models/Banner.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import makeSlug from "../utils/slugify.js";

const nowFilter = () => {
  const now = new Date();

  return {
    $and: [
      {
        $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }]
      },
      {
        $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }]
      }
    ]
  };
};

const buildBannerFilter = (query = {}, { admin = false } = {}) => {
  const filter = {};

  if (!admin) {
    filter.status = "active";
    Object.assign(filter, nowFilter());
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.page) {
    filter.page = query.page;
  }

  if (query.type) {
    filter.type = query.type;
  }

  return filter;
};

const assignBannerFields = (banner, payload) => {
  if (payload.title !== undefined) {
    banner.title = payload.title;

    if (payload.slug === undefined) {
      banner.slug = makeSlug(payload.title);
    }
  }
  if (payload.slug !== undefined) banner.slug = makeSlug(payload.slug);
  if (payload.type !== undefined) banner.type = payload.type;
  if (payload.image !== undefined) banner.image = payload.image;
  if (payload.mobileImage !== undefined) banner.mobileImage = payload.mobileImage;
  if (payload.link !== undefined) banner.link = payload.link;
  if (payload.buttonText !== undefined) banner.buttonText = payload.buttonText;
  if (payload.page !== undefined) banner.page = payload.page;
  if (payload.position !== undefined) banner.position = payload.position;
  if (payload.status !== undefined) banner.status = payload.status;
  if (payload.startDate !== undefined) {
    banner.startDate = payload.startDate ? new Date(payload.startDate) : null;
  }
  if (payload.endDate !== undefined) {
    banner.endDate = payload.endDate ? new Date(payload.endDate) : null;
  }
  if (payload.sortOrder !== undefined) banner.sortOrder = payload.sortOrder;
  if (payload.isClickable !== undefined) banner.isClickable = payload.isClickable;
  if (payload.targetType !== undefined) banner.targetType = payload.targetType;
  if (payload.targetValue !== undefined) banner.targetValue = payload.targetValue;
};

const ensureUniqueSlug = async (slug, excludedId = null) => {
  const duplicate = await Banner.findOne({
    slug,
    ...(excludedId ? { _id: { $ne: excludedId } } : {})
  });

  if (duplicate) {
    throw new ApiError(400, "Banner slug already exists");
  }
};

export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find(buildBannerFilter(req.query)).sort({
    sortOrder: 1,
    createdAt: -1
  });

  res.status(200).json({
    success: true,
    message: "Banners fetched successfully",
    results: banners.length,
    data: banners
  });
});

export const getAdminBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find(buildBannerFilter(req.query, { admin: true })).sort({
    sortOrder: 1,
    createdAt: -1
  });

  res.status(200).json({
    success: true,
    message: "Admin banners fetched successfully",
    results: banners.length,
    data: banners
  });
});

export const getAdminBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  res.status(200).json({
    success: true,
    message: "Banner fetched successfully",
    data: banner
  });
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = new Banner();
  assignBannerFields(banner, req.body);
  banner.createdBy = req.user._id;
  banner.updatedBy = req.user._id;
  await ensureUniqueSlug(banner.slug || makeSlug(banner.title || ""));
  await banner.save();

  res.status(201).json({
    success: true,
    message: "Banner created successfully",
    data: banner
  });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  assignBannerFields(banner, req.body);
  banner.updatedBy = req.user._id;
  await ensureUniqueSlug(banner.slug || makeSlug(banner.title || ""), banner._id);
  await banner.save();

  res.status(200).json({
    success: true,
    message: "Banner updated successfully",
    data: banner
  });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully"
  });
});
