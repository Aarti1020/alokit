import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Product from "../models/Product.js";
import Collection from "../models/Collection.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import asyncHandler from "../utils/asyncHandler.js";
import makeSlug from "../utils/slugify.js";
import ApiError from "../utils/ApiError.js";
import getPagination from "../utils/pagination.js";
import { sanitizeObject, sanitizeString } from "../utils/sanitizeInput.js";
import { getOptimizedImageVariants } from "../utils/imageHelpers.js";
import { getRequestBaseUrl, resolveAssetUrl } from "../utils/assetUrl.js";
import cloudinaryDelete from "../utils/cloudinaryDelete.js";
import {
  buildProductImages,
  buildProductVideo,
  getProductMediaPublicIds,
  logProductMedia,
  normalizeProductMedia
} from "../utils/productImages.js";

const productPopulate = [
  { path: "category", select: "name slug" },
  { path: "subCategory", select: "name slug category" }
];

export const getProductStockState = (product = {}) => {
  const stock = Number(product.stock) || 0;
  const lowStockThreshold = Number(product.lowStockThreshold) || 0;
  const isOutOfStock = stock <= 0;

  return {
    stock,
    lowStockThreshold,
    soldCount: Number(product.soldCount) || 0,
    isOutOfStock,
    canAddToCart: stock > 0,
    isLowStock: stock > 0 && stock <= lowStockThreshold,
    stockMessage: isOutOfStock ? "Out of Stock" : "In Stock"
  };
};

export const buildPublicProductFilter = (overrides = {}) => ({
  status: "active",
  isDeleted: false,
  $or: [
    { featuredImage: { $exists: true, $ne: "" } },
    { thumbnail: { $exists: true, $ne: "" } },
    { "images.0.url": { $exists: true, $ne: "" } },
    { "galleryImages.0": { $exists: true, $ne: "" } }
  ],
  ...overrides
});

const publicImageAvailabilityFilter = buildPublicProductFilter().$or;

export const serializeProduct = (product, options = {}) => {
  const baseUrl = options.baseUrl || "";
  const item = product.toObject ? product.toObject() : product;
  const media = normalizeProductMedia(item, {
    fallbackAlt: item.title || item.name || "",
    mapUrl: (value) => resolveAssetUrl(sanitizeString(value || ""), baseUrl),
    logContext: "serializeProduct"
  });
  const effectivePrice = item.salePrice > 0 ? item.salePrice : item.basePrice;
  const primaryImageObject = media.primaryImageObject;
  const primaryImage = media.primaryImage || "";
  const primaryImageVariants = primaryImageObject
    ? getOptimizedImageVariants(primaryImageObject)
    : {
        original: primaryImage,
        thumbnail: primaryImage,
        productCard: primaryImage,
        productDetail: primaryImage
      };
  const stockState = getProductStockState(item);

  return {
    ...item,
    images: media.images.map((image) => ({
      ...image,
      variants: getOptimizedImageVariants(image)
    })),
    featuredImage: media.featuredImage,
    thumbnail: media.thumbnail,
    galleryImages: media.galleryImages,
    productVideo: item.productVideo?.url
      ? {
          ...item.productVideo,
          url: resolveAssetUrl(sanitizeString(item.productVideo.url || ""), baseUrl)
        }
      : null,
    primaryImage,
    primaryImageData: primaryImageObject
      ? {
          ...primaryImageObject,
          variants: primaryImageVariants
        }
      : null,
    effectivePrice,
    ...stockState,
    listingCard: {
      id: item._id,
      title: item.title || item.name,
      slug: item.slug,
      productType: item.productType,
      image: primaryImageVariants.productCard || primaryImage,
      basePrice: item.basePrice,
      salePrice: item.salePrice,
      effectivePrice,
      emiPrice: item.emiPrice,
      inStock: item.inStock,
      isFeatured: item.isFeatured,
      stock: stockState.stock,
      isOutOfStock: stockState.isOutOfStock,
      canAddToCart: stockState.canAddToCart,
      isLowStock: stockState.isLowStock,
      stockMessage: stockState.stockMessage,
      imageData: primaryImageObject
        ? {
            ...primaryImageObject,
            variants: primaryImageVariants
          }
        : null
    }
  };
};

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const buildImageAltTexts = (value) => normalizeStringArray(value).map((alt) => sanitizeString(alt));

const getProductAssetIds = (product) =>
  getProductMediaPublicIds(product);

const getUploadedImageFiles = (req) =>
  Array.isArray(req.files?.images)
    ? req.files.images
    : Array.isArray(req.files)
      ? req.files
      : [];

const getUploadedVideoFile = (req) =>
  Array.isArray(req.files?.video) ? req.files.video[0] || null : null;

const replaceProductAssets = async (existingProduct, nextImages) => {
  const previousPublicIds = getProductAssetIds(existingProduct);
  const nextPublicIds = (nextImages || []).map((image) => image.publicId).filter(Boolean);
  const publicIdsToDelete = previousPublicIds.filter((publicId) => !nextPublicIds.includes(publicId));

  await cloudinaryDelete(publicIdsToDelete);
};

const cleanupUploadedImages = async (images = []) => {
  await cloudinaryDelete(
    (images || []).map((image) => image.publicId).filter(Boolean)
  );
};

const cleanupUploadedMedia = async ({ images = [], video = null } = {}) => {
  await cloudinaryDelete(
    [
      ...(images || []).map((image) => image.publicId),
      video?.publicId
    ].filter(Boolean)
  );
};

const cleanupDeletedProductReferences = async (product) => {
  if (!product?._id) {
    return;
  }

  await Promise.all([
    Collection.updateMany(
      { productIds: product._id },
      { $pull: { productIds: product._id } }
    ),
    Cart.updateMany(
      {},
      {
        $pull: {
          items: {
            $or: [{ product: product._id }, { productId: product._id }]
          }
        }
      }
    ),
    Wishlist.updateMany(
      {},
      {
        $pull: {
          items: { product: product._id }
        }
      }
    )
  ]);
};

const runProductDeletionCleanup = async (product) => {
  const cleanupTasks = [
    {
      label: "cloudinary assets",
      run: () => cloudinaryDelete(getProductAssetIds(product))
    },
    {
      label: "linked references",
      run: () => cleanupDeletedProductReferences(product)
    }
  ];

  const results = await Promise.allSettled(cleanupTasks.map((task) => task.run()));

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Product delete cleanup warning: failed to clean ${cleanupTasks[index].label} for product ${product?._id}`,
        result.reason
      );
    }
  });
};

const mapSortOption = (sort) => {
  switch (sort) {
    case "price_asc":
      return { salePrice: 1, basePrice: 1, createdAt: -1 };
    case "price_desc":
      return { salePrice: -1, basePrice: -1, createdAt: -1 };
    case "name_asc":
      return { title: 1, name: 1 };
    case "name_desc":
      return { title: -1, name: -1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
};

const normalizeProductPayload = (payload = {}, options = {}) => {
  const productData = sanitizeObject(payload);
  const has = (key) => Object.prototype.hasOwnProperty.call(productData, key);
  const nextName = sanitizeString(productData.name || productData.title || "");
  const nextTitle = sanitizeString(productData.title || productData.name || "");
  const nextSeo = has("seo") ? productData.seo || {} : null;
  const mediaSource = options.uploadedImages?.length
    ? { images: options.uploadedImages }
    : has("images") || has("galleryImages") || has("featuredImage") || has("thumbnail")
      ? {
          images: productData.images,
          galleryImages: productData.galleryImages,
          featuredImage: productData.featuredImage,
          thumbnail: productData.thumbnail
        }
      : options.currentProduct || {};
  const media = normalizeProductMedia(mediaSource, {
    fallbackAlt:
      nextTitle ||
      nextName ||
      options.currentProduct?.title ||
      options.currentProduct?.name ||
      ""
  });
  const primaryImageObject = media.primaryImageObject;

  return {
    ...productData,
    ...(has("name") || has("title")
      ? {
          name: nextName,
          title: nextTitle
        }
      : {}),
    ...(has("slug") || has("name") || has("title")
      ? {
          slug: productData.slug
            ? makeSlug(productData.slug)
            : makeSlug(nextTitle || nextName)
        }
      : {}),
    ...((has("featuredImage") || has("thumbnail") || media.images.length || options.currentProduct)
      ? {
          featuredImage: media.featuredImage,
          thumbnail: media.thumbnail
        }
      : {}),
    ...((has("galleryImages") || has("images") || media.images.length || options.currentProduct)
      ? {
          galleryImages: media.galleryImages,
          images: media.images
        }
      : {}),
    ...(has("tags")
      ? {
          tags: Array.isArray(productData.tags) ? productData.tags : []
        }
      : {}),
    ...(has("collections")
      ? {
          collections: Array.isArray(productData.collections)
            ? productData.collections
            : []
        }
      : {}),
    ...(has("specifications")
      ? {
          specifications:
            productData.specifications && typeof productData.specifications === "object"
              ? productData.specifications
              : {}
        }
      : {}),
    ...(has("variants")
      ? {
          variants: Array.isArray(productData.variants) ? productData.variants : []
        }
      : {}),
    ...(has("emiPrice")
      ? {
          emiPrice: Number(productData.emiPrice)
        }
      : {}),
    ...(has("inStock") || has("stock")
      ? {
          inStock:
            productData.inStock !== undefined
              ? productData.inStock
              : Number(productData.stock) > 0
        }
      : {}),
    ...(nextSeo
      ? {
          seo: {
            metaTitle: sanitizeString(
              nextSeo.metaTitle || productData.seoTitle || nextTitle
            ),
            metaDescription: sanitizeString(
              nextSeo.metaDescription ||
                productData.seoDescription ||
                productData.shortDescription ||
                ""
            ),
            metaKeywords: Array.isArray(nextSeo.metaKeywords) ? nextSeo.metaKeywords : [],
            ogTitle: sanitizeString(nextSeo.ogTitle || nextTitle),
            ogDescription: sanitizeString(
              nextSeo.ogDescription || productData.shortDescription || ""
            ),
            ogImage: sanitizeString(
              nextSeo.ogImage ||
                primaryImageObject?.url ||
                media.featuredImage ||
                media.thumbnail ||
                ""
            ),
            canonicalUrl: sanitizeString(nextSeo.canonicalUrl || ""),
            robots: sanitizeString(nextSeo.robots || "index,follow")
          }
        }
      : {}),
    ...(has("seoTitle") || nextSeo
      ? {
          seoTitle: sanitizeString(
            productData.seoTitle || nextSeo?.metaTitle || nextTitle || ""
          )
        }
      : {}),
    ...(has("seoDescription") || nextSeo
      ? {
          seoDescription: sanitizeString(
            productData.seoDescription ||
              nextSeo?.metaDescription ||
              productData.shortDescription ||
              ""
          )
        }
      : {})
  };
};

const buildProductFilter = (query = {}) => {
  const filter = buildPublicProductFilter();

  if (query.category) {
    filter.category = query.category;
  }

  if (query.subCategory) {
    filter.subCategory = query.subCategory;
  }

  if (query.productType) {
    filter.productType = query.productType;
  }

  if (query.collection) {
    filter.collections = query.collection;
  }

  if (query.featured !== undefined) {
    filter.isFeatured = query.featured === "true";
  }

  if (query.showOnHomepage !== undefined) {
    filter.showOnHomepage = query.showOnHomepage === "true";
  }

  if (query.inStock !== undefined) {
    filter.stock = query.inStock === "true" ? { $gt: 0 } : { $lte: 0 };
  }

  if (query.stockStatus === "in_stock") {
    filter.stock = { $gt: 0 };
  }

  if (query.stockStatus === "out_of_stock") {
    filter.stock = { $lte: 0 };
  }

  if (query.minPrice || query.maxPrice) {
    filter.$expr = {};
    const priceConditions = [];
    const priceExpression = {
      $cond: [{ $gt: ["$salePrice", 0] }, "$salePrice", "$basePrice"]
    };

    if (query.minPrice) {
      priceConditions.push({
        $gte: [priceExpression, Number(query.minPrice)]
      });
    }

    if (query.maxPrice) {
      priceConditions.push({
        $lte: [priceExpression, Number(query.maxPrice)]
      });
    }

    filter.$expr = priceConditions.length > 1 ? { $and: priceConditions } : priceConditions[0];
  }

  if (query.search) {
    const searchConditions = [
      { name: { $regex: query.search, $options: "i" } },
      { title: { $regex: query.search, $options: "i" } },
      { shortDescription: { $regex: query.search, $options: "i" } },
      { tags: { $elemMatch: { $regex: query.search, $options: "i" } } }
    ];

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
      delete filter.$or;
    } else {
      filter.$or = searchConditions;
    }
  }

  return filter;
};

const buildAdminProductFilter = (query = {}) => {
  const filter = {
    isDeleted: false
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.subCategory) {
    filter.subCategory = query.subCategory;
  }

  if (query.productType) {
    filter.productType = query.productType;
  }

  if (query.collection) {
    filter.collections = query.collection;
  }

  if (query.featured !== undefined) {
    filter.isFeatured = query.featured === "true";
  }

  if (query.showOnHomepage !== undefined) {
    filter.showOnHomepage = query.showOnHomepage === "true";
  }

  if (query.inStock !== undefined) {
    filter.stock = query.inStock === "true" ? { $gt: 0 } : { $lte: 0 };
  }

  if (query.stockStatus === "in_stock") {
    filter.stock = { $gt: 0 };
  }

  if (query.stockStatus === "out_of_stock") {
    filter.stock = { $lte: 0 };
  }

  if (query.minPrice || query.maxPrice) {
    const priceConditions = [];
    const priceExpression = {
      $cond: [{ $gt: ["$salePrice", 0] }, "$salePrice", "$basePrice"]
    };

    if (query.minPrice) {
      priceConditions.push({
        $gte: [priceExpression, Number(query.minPrice)]
      });
    }

    if (query.maxPrice) {
      priceConditions.push({
        $lte: [priceExpression, Number(query.maxPrice)]
      });
    }

    if (priceConditions.length) {
      filter.$expr =
        priceConditions.length > 1 ? { $and: priceConditions } : priceConditions[0];
    }
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { title: { $regex: query.search, $options: "i" } },
      { sku: { $regex: query.search, $options: "i" } },
      { shortDescription: { $regex: query.search, $options: "i" } },
      { tags: { $elemMatch: { $regex: query.search, $options: "i" } } }
    ];
  }

  return filter;
};

const validatePricing = (basePrice, salePrice) => {
  if (salePrice !== undefined && Number(salePrice) > Number(basePrice)) {
    throw new ApiError(400, "Sale price cannot be greater than base price");
  }
};

const resolveUniqueProductSlug = async (slug, excludedProductId = null) => {
  const baseSlug = makeSlug(slug || "product");
  let nextSlug = baseSlug;
  let suffix = 2;

  while (
    await Product.exists({
      slug: nextSlug,
      ...(excludedProductId ? { _id: { $ne: excludedProductId } } : {})
    })
  ) {
    nextSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return nextSlug;
};

const validateProductRelations = async (categoryId, subCategoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  if (subCategory.category.toString() !== categoryId.toString()) {
    throw new ApiError(400, "Subcategory does not belong to the selected category");
  }
};

export const createProduct = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const imageAlts = buildImageAltTexts(req.body.imageAlts);
  const imageFiles = getUploadedImageFiles(req);
  const videoFile = getUploadedVideoFile(req);
  const uploadedImages = imageFiles.length
    ? await buildProductImages(
        imageFiles,
        sanitizeString(req.body.title || req.body.name || "product-image"),
        imageAlts
      )
    : [];
  const uploadedVideo = videoFile
    ? await buildProductVideo(videoFile, sanitizeString(req.body.title || req.body.name || "product-video"))
    : null;

  try {
    const payload = normalizeProductPayload(req.body, { uploadedImages });
    if (uploadedVideo) {
      payload.productVideo = uploadedVideo;
    }
    if (!payload.images?.length) {
      throw new ApiError(400, "At least one product image is required");
    }
    payload.slug = await resolveUniqueProductSlug(payload.slug || payload.title || payload.name);

    validatePricing(payload.basePrice, payload.salePrice ?? 0);
    await validateProductRelations(payload.category, payload.subCategory);
    logProductMedia("info", "Creating product with canonical media", {
      sku: payload.sku,
      slug: payload.slug,
      imageCount: payload.images.length
    });

    const createdProduct = await Product.create({
      ...payload,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null
    });
    const product = await Product.findById(createdProduct._id).populate(productPopulate);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: serializeProduct(product, { baseUrl })
    });
  } catch (error) {
    await cleanupUploadedMedia({ images: uploadedImages, video: uploadedVideo });
    throw error;
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const filter = buildProductFilter(req.query);
  const { page, limit, skip } = getPagination(req.query);
  const sort = mapSortOption(req.query.sort);
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate(productPopulate)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    results: products.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: products.map((product) => serializeProduct(product, { baseUrl }))
  });
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const filter = buildAdminProductFilter(req.query);
  const { page, limit, skip } = getPagination(req.query);
  const sort = mapSortOption(req.query.sort);
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate(productPopulate)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const serializedProducts = products.map((product) => serializeProduct(product, { baseUrl }));

  const missingMediaCount = serializedProducts.filter(
    (product) => !product.thumbnail && !product.images?.length
  ).length;

  logProductMedia("info", "Admin products fetched", {
    page,
    limit,
    total,
    results: serializedProducts.length,
    missingMediaCount
  });

  res.status(200).json({
    success: true,
    message: "Admin products fetched successfully",
    results: serializedProducts.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: serializedProducts
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const product = await Product.findOne(
    buildPublicProductFilter({
      slug: req.params.slug
    })
  ).populate(productPopulate);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: serializeProduct(product, { baseUrl })
  });
});

export const getRelatedProducts = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const product = await Product.findOne(
    buildPublicProductFilter({
      slug: req.params.slug
    })
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const orConditions = [];

  if (product.subCategory) {
    orConditions.push({ subCategory: product.subCategory });
  }

  if (product.category) {
    orConditions.push({ category: product.category });
  }

  if (product.productType) {
    orConditions.push({ productType: product.productType });
  }

  if (product.collections?.length) {
    orConditions.push({ collections: { $in: product.collections } });
  }

  const relatedProducts = orConditions.length
    ? await Product.find({
        _id: { $ne: product._id },
        status: "active",
        isDeleted: false,
        $and: [{ $or: publicImageAvailabilityFilter }, { $or: orConditions }]
      })
        .populate(productPopulate)
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(8)
    : [];

  res.status(200).json({
    success: true,
    message: "Related products fetched successfully",
    results: relatedProducts.length,
    data: relatedProducts.map((relatedProduct) => serializeProduct(relatedProduct, { baseUrl }))
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const existingProduct = await Product.findById(req.params.id);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const imageAlts = buildImageAltTexts(req.body.imageAlts);
  const imageFiles = getUploadedImageFiles(req);
  const videoFile = getUploadedVideoFile(req);
  const uploadedImages = imageFiles.length
    ? await buildProductImages(
        imageFiles,
        sanitizeString(
          req.body.title ||
          req.body.name ||
          existingProduct.title ||
          existingProduct.name ||
          "product-image"
        ),
        imageAlts
      )
    : [];
  const uploadedVideo = videoFile
    ? await buildProductVideo(
        videoFile,
        sanitizeString(
          req.body.title ||
          req.body.name ||
          existingProduct.title ||
          existingProduct.name ||
          "product-video"
        )
      )
    : null;

  try {
    const payload = normalizeProductPayload(req.body, {
      uploadedImages: uploadedImages.length ? uploadedImages : undefined,
      currentProduct: existingProduct
    });
    if (uploadedVideo) {
      payload.productVideo = uploadedVideo;
    }
    const updateData = {
      ...payload,
      updatedBy: req.user?._id || existingProduct.updatedBy || null
    };

    if (req.body.name === undefined && req.body.title === undefined) {
      delete updateData.name;
      delete updateData.title;
    }

    if (req.body.slug === undefined && req.body.name === undefined && req.body.title === undefined) {
      delete updateData.slug;
    }

    if (!uploadedImages.length && req.body.images === undefined && req.body.galleryImages === undefined) {
      delete updateData.images;
      delete updateData.galleryImages;
      if (req.body.featuredImage === undefined && req.body.thumbnail === undefined) {
        delete updateData.featuredImage;
        delete updateData.thumbnail;
      }
    }

    const categoryId = updateData.category || existingProduct.category.toString();
    const subCategoryId =
      updateData.subCategory || existingProduct.subCategory.toString();
    const nextBasePrice =
      updateData.basePrice !== undefined ? updateData.basePrice : existingProduct.basePrice;
    const nextSalePrice =
      updateData.salePrice !== undefined ? updateData.salePrice : existingProduct.salePrice;

    if (updateData.category || updateData.subCategory) {
      await validateProductRelations(categoryId, subCategoryId);
    }

    validatePricing(nextBasePrice, nextSalePrice);
    logProductMedia("info", "Updating product media", {
      productId: existingProduct._id.toString(),
      uploadedImageCount: uploadedImages.length,
      resultingImageCount: updateData.images?.length ?? existingProduct.images?.length ?? 0
    });

    if (updateData.slug) {
      updateData.slug = await resolveUniqueProductSlug(updateData.slug, req.params.id);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (uploadedImages.length) {
      await replaceProductAssets(existingProduct, uploadedImages);
    }
    if (uploadedVideo && existingProduct.productVideo?.publicId) {
      await cloudinaryDelete([existingProduct.productVideo.publicId]);
    }

    logProductMedia("info", "Updated product final media state", {
      productId: updatedProduct._id.toString(),
      imageCount: updatedProduct.images?.length || 0,
      thumbnail: updatedProduct.thumbnail || ""
    });

    const product = await Product.findById(updatedProduct._id).populate(productPopulate);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: serializeProduct(product, { baseUrl })
    });
  } catch (error) {
    await cleanupUploadedMedia({ images: uploadedImages, video: uploadedVideo });
    throw error;
  }
});

export const replaceProductImages = asyncHandler(async (req, res) => {
  const baseUrl = getRequestBaseUrl(req);
  const existingProduct = await Product.findById(req.params.id);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  if (!req.files?.length) {
    throw new ApiError(400, "At least one product image is required");
  }

  const imageAlts = buildImageAltTexts(req.body.imageAlts);
  const uploadedImages = await buildProductImages(
    req.files,
    sanitizeString(existingProduct.title || existingProduct.name || "product-image"),
    imageAlts
  );
  const media = normalizeProductMedia(
    {
      images: uploadedImages
    },
    {
      fallbackAlt: sanitizeString(existingProduct.title || existingProduct.name || "product-image")
    }
  );

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: media.images,
        galleryImages: media.galleryImages,
        featuredImage: media.featuredImage,
        thumbnail: media.thumbnail,
        updatedBy: req.user?._id || existingProduct.updatedBy || null
      },
      {
        new: true,
        runValidators: true
      }
    ).populate(productPopulate);

    await replaceProductAssets(existingProduct, uploadedImages);

    res.status(200).json({
      success: true,
      message: "Product images updated successfully",
      data: serializeProduct(updatedProduct, { baseUrl })
    });
  } catch (error) {
    await cleanupUploadedImages(uploadedImages);
    throw error;
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isDeleted = true;
  product.status = "inactive";
  product.deletedAt = new Date();
  product.collections = [];
  product.updatedBy = req.user?._id || product.updatedBy || null;
  await product.save();
  await runProductDeletionCleanup(product);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});
