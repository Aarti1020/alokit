import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import makeSlug from "../utils/slugify.js";
import ApiError from "../utils/ApiError.js";

export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category, description, isActive } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Parent category not found");
  }

  const slug = makeSlug(name);

  const existingSubCategory = await SubCategory.findOne({
    category,
    $or: [{ slug }, { name: { $regex: `^${name}$`, $options: "i" } }]
  });

  if (existingSubCategory) {
    throw new ApiError(400, "Subcategory already exists in this category");
  }

  const subCategory = await SubCategory.create({
    name,
    slug,
    category,
    description,
    isActive
  });

  res.status(201).json({
    success: true,
    message: "Subcategory created successfully",
    data: subCategory
  });
});

export const getAllSubCategories = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const subCategories = await SubCategory.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Subcategories fetched successfully",
    results: subCategories.length,
    data: subCategories
  });
});

export const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id).populate(
    "category",
    "name slug"
  );

  if (!subCategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  res.status(200).json({
    success: true,
    message: "Subcategory fetched successfully",
    data: subCategory
  });
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  const { name, category, description, isActive } = req.body;
  const currentSubCategory = await SubCategory.findById(req.params.id);

  if (!currentSubCategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  const updateData = {};
  const categoryId = category || currentSubCategory.category.toString();
  const nextName = name || currentSubCategory.name;
  const nextSlug = makeSlug(nextName);

  if (category) {
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new ApiError(404, "Parent category not found");
    }
  }

  const duplicateSubCategory = await SubCategory.findOne({
    _id: { $ne: req.params.id },
    category: categoryId,
    $or: [{ slug: nextSlug }, { name: { $regex: `^${nextName}$`, $options: "i" } }]
  });

  if (duplicateSubCategory) {
    throw new ApiError(400, "Subcategory already exists in this category");
  }

  if (name !== undefined) {
    updateData.name = name;
    updateData.slug = nextSlug;
  }

  if (category !== undefined) updateData.category = categoryId;
  if (description !== undefined) updateData.description = description;
  if (isActive !== undefined) updateData.isActive = isActive;

  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate("category", "name slug");

  res.status(200).json({
    success: true,
    message: "Subcategory updated successfully",
    data: subCategory
  });
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  const linkedProducts = await Product.countDocuments({
    subCategory: req.params.id,
    isDeleted: false
  });

  if (linkedProducts > 0) {
    throw new ApiError(400, "Cannot delete subcategory because products are linked to it");
  }

  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

  if (!subCategory) {
    throw new ApiError(404, "Subcategory not found");
  }

  res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully"
  });
});
