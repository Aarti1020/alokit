import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import calculateCartTotals from "../utils/calculateCartTotals.js";

const ensureProductCanBePurchased = (product, quantity, { notFoundMessage = "Published product not found" } = {}) => {
  if (!product) {
    throw new ApiError(404, notFoundMessage);
  }

  if (product.status !== "active" || product.isDeleted) {
    throw new ApiError(400, "Product is not available for purchase");
  }

  if (product.stock <= 0) {
    throw new ApiError(400, "Product is out of stock");
  }

  if (Number(quantity) > Number(product.stock)) {
    throw new ApiError(400, `Only ${product.stock} item(s) available in stock`);
  }
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: []
    });
  }

  return cart;
};

const getCartResponse = async (cart) => {
  const productIds = cart.items.map((item) => item.productId || item.product);
  const products = await Product.find({
    _id: { $in: productIds }
  })
    .populate("category", "name")
    .populate("subCategory", "name");

  if (products.length !== cart.items.length) {
    throw new ApiError(400, "Some cart products are no longer available");
  }

  const { items, pricing } = calculateCartTotals(cart.items, products);

  const enrichedItems = items.map((item) => {
    const product = products.find(
      (productDoc) => productDoc._id.toString() === item.product.toString()
    );

    return {
      ...item,
      productId: item.productId || item.product,
      categoryName: product?.category?.name || "",
      subCategoryName: product?.subCategory?.name || "",
      productName: item.productName || product?.title || product?.name || "",
      productSlug: item.productSlug || product?.slug || "",
      featuredImage:
        item.featuredImage || product?.featuredImage || product?.thumbnail || "",
      selectedVariant: item.selectedVariant || null,
      unitPrice:
        item.unitPrice ||
        (item.selectedVariant?.salePrice > 0
          ? item.selectedVariant.salePrice
          : item.selectedVariant?.price || 0)
    };
  });

  return {
    _id: cart._id,
    user: cart.user,
    items: enrichedItems,
    pricing,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt
  };
};

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, selectedVariant } = req.body;

  const product = await Product.findById(productId);

  const requestedQuantity = Number(quantity);
  ensureProductCanBePurchased(product, requestedQuantity, {
    notFoundMessage: "Product not found"
  });

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const nextQuantity = existingItem.quantity + requestedQuantity;
    ensureProductCanBePurchased(product, nextQuantity, {
      notFoundMessage: "Product not found"
    });

    existingItem.quantity = nextQuantity;
    existingItem.selectedVariant = selectedVariant || existingItem.selectedVariant || null;
    existingItem.productName = product.title || product.name;
    existingItem.productSlug = product.slug;
    existingItem.featuredImage = product.featuredImage || product.thumbnail || "";
    existingItem.unitPrice =
      selectedVariant?.salePrice > 0
        ? Number(selectedVariant.salePrice)
        : selectedVariant?.price > 0
          ? Number(selectedVariant.price)
          : Number(product.salePrice) > 0
            ? Number(product.salePrice)
            : Number(product.basePrice);
  } else {
    cart.items.push({
      product: product._id,
      productId: product._id,
      productName: product.title || product.name,
      productSlug: product.slug,
      featuredImage: product.featuredImage || product.thumbnail || "",
      selectedVariant: selectedVariant || null,
      unitPrice:
        selectedVariant?.salePrice > 0
          ? Number(selectedVariant.salePrice)
          : selectedVariant?.price > 0
            ? Number(selectedVariant.price)
            : Number(product.salePrice) > 0
              ? Number(product.salePrice)
              : Number(product.basePrice),
      quantity: requestedQuantity
    });
  }

  await cart.save();

  const cartResponse = await getCartResponse(cart);

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    data: cartResponse
  });
});

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const cartResponse = await getCartResponse(cart);

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cartResponse
  });
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const cartItem = cart.items.id(req.params.itemId);

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  const product = await Product.findById(cartItem.product);
  ensureProductCanBePurchased(product, Number(quantity), {
    notFoundMessage: "Product not found"
  });

  cartItem.quantity = Number(quantity);
  cartItem.productId = cartItem.productId || cartItem.product;
  await cart.save();

  const cartResponse = await getCartResponse(cart);

  res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    data: cartResponse
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const initialLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  if (cart.items.length === initialLength) {
    throw new ApiError(404, "Product not found in cart");
  }

  await cart.save();

  const cartResponse = await getCartResponse(cart);

  res.status(200).json({
    success: true,
    message: "Cart item removed successfully",
    data: cartResponse
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  const cartResponse = await getCartResponse(cart);

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: cartResponse
  });
});
