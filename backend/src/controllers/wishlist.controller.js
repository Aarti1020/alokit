import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      items: []
    });
  }

  return wishlist;
};

const buildWishlistResponse = async (wishlist) => {
  await wishlist.populate({
    path: "items.product",
    match: { status: "active", isDeleted: false },
    populate: [
      { path: "category", select: "name slug" },
      { path: "subCategory", select: "name slug category" }
    ]
  });

  const items = wishlist.items
    .filter((item) => item.product)
    .map((item) => ({
      itemId: item._id,
      addedAt: item.addedAt,
      product: item.product
    }));

  return {
    _id: wishlist._id,
    user: wishlist.user,
    items,
    totalItems: items.length,
    createdAt: wishlist.createdAt,
    updatedAt: wishlist.updatedAt
  };
};

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const response = await buildWishlistResponse(wishlist);

  res.status(200).json({
    success: true,
    message: "Wishlist fetched successfully",
    data: response
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.productId);

  if (!product || product.status !== "active" || product.isDeleted) {
    throw new ApiError(404, "Active product not found");
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const alreadyExists = wishlist.items.some(
    (item) => item.product.toString() === req.body.productId
  );

  if (!alreadyExists) {
    wishlist.items.push({
      product: product._id
    });
    await wishlist.save();
  }

  const response = await buildWishlistResponse(wishlist);

  res.status(200).json({
    success: true,
    message: alreadyExists ? "Product already exists in wishlist" : "Product added to wishlist",
    data: response
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const initialLength = wishlist.items.length;

  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  if (wishlist.items.length === initialLength) {
    throw new ApiError(404, "Product not found in wishlist");
  }

  await wishlist.save();
  const response = await buildWishlistResponse(wishlist);

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    data: response
  });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.items = [];
  await wishlist.save();

  const response = await buildWishlistResponse(wishlist);

  res.status(200).json({
    success: true,
    message: "Wishlist cleared successfully",
    data: response
  });
});
