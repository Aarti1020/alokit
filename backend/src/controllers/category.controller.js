import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import makeSlug from "../utils/slugify.js";
import ApiError from "../utils/ApiError.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, isActive } = req.body;

  const slug = makeSlug(name);

  const existingCategory = await Category.findOne({
    $or: [{ slug }, { name: { $regex: `^${name}$`, $options: "i" } }]
  });

  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
    isActive
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    results: categories.length,
    data: categories
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image, isActive } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const updateData = {};

  if (name) {
    const slug = makeSlug(name);
    const duplicateCategory = await Category.findOne({
      _id: { $ne: req.params.id },
      $or: [{ slug }, { name: { $regex: `^${name}$`, $options: "i" } }]
    });

    if (duplicateCategory) {
      throw new ApiError(400, "Category already exists");
    }

    updateData.name = name;
    updateData.slug = slug;
  }

  if (description !== undefined) updateData.description = description;
  if (image !== undefined) updateData.image = image;
  if (isActive !== undefined) updateData.isActive = isActive;

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const linkedProducts = await Product.countDocuments({
    category: req.params.id,
    isDeleted: false
  });

  if (linkedProducts > 0) {
    throw new ApiError(400, "Cannot delete category because products are linked to it");
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully"
  });
});
