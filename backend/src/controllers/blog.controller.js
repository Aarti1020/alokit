import Blog from "../models/Blog.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import getPagination from "../utils/pagination.js";
import makeSlug from "../utils/slugify.js";
import { sanitizeString } from "../utils/sanitizeInput.js";

const buildBlogFilter = (query = {}, { admin = false } = {}) => {
  const filter = {};

  if (!admin) {
    filter.status = "published";
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.title = { $regex: query.search, $options: "i" };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.tag) {
    filter.tags = query.tag;
  }

  if (query.featured !== undefined) {
    filter.isFeatured = query.featured === "true";
  }

  return filter;
};

const normalizeSeo = (seo = {}) => ({
  metaTitle: seo.metaTitle || "",
  metaDescription: seo.metaDescription || "",
  metaKeywords: Array.isArray(seo.metaKeywords) ? seo.metaKeywords : [],
  ogTitle: seo.ogTitle || "",
  ogDescription: seo.ogDescription || "",
  ogImage: seo.ogImage || "",
  canonicalUrl: seo.canonicalUrl || "",
  robots: seo.robots || "index,follow"
});

const assignBlogFields = (blog, payload, userId) => {
  if (payload.title !== undefined) {
    blog.title = sanitizeString(payload.title);

    if (payload.slug === undefined) {
      blog.slug = makeSlug(payload.title);
    }
  }
  if (payload.slug !== undefined) blog.slug = makeSlug(payload.slug);
  if (payload.excerpt !== undefined) blog.excerpt = payload.excerpt;
  if (payload.content !== undefined) blog.content = payload.content;
  if (payload.featuredImage !== undefined) {
    blog.featuredImage = sanitizeString(payload.featuredImage);
  }
  if (payload.images !== undefined) {
    blog.images = Array.isArray(payload.images) ? payload.images : [];
  }
  if (payload.tags !== undefined) {
    blog.tags = Array.isArray(payload.tags) ? payload.tags : [];
  }
  if (payload.category !== undefined) blog.category = sanitizeString(payload.category);
  if (payload.authorName !== undefined) {
    blog.authorName = sanitizeString(payload.authorName);
  }
  if (payload.status !== undefined) blog.status = payload.status;
  if (payload.isFeatured !== undefined) blog.isFeatured = payload.isFeatured;
  if (payload.publishedAt !== undefined) {
    blog.publishedAt = payload.publishedAt ? new Date(payload.publishedAt) : null;
  }
  if (payload.seo !== undefined) blog.seo = normalizeSeo(payload.seo);
  if (!blog.createdBy) blog.createdBy = userId;
  blog.updatedBy = userId;
};

const ensureUniqueSlug = async (slug, excludedId = null) => {
  const duplicate = await Blog.findOne({
    slug,
    ...(excludedId ? { _id: { $ne: excludedId } } : {})
  });

  if (duplicate) {
    throw new ApiError(400, "Blog slug already exists");
  }
};

export const getBlogs = asyncHandler(async (req, res) => {
  const filter = buildBlogFilter(req.query);
  const { page, limit, skip } = getPagination(req.query);
  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    message: "Blogs fetched successfully",
    results: blogs.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: blogs
  });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: "published"
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  res.status(200).json({
    success: true,
    message: "Blog fetched successfully",
    data: blog
  });
});

export const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({
    status: "published",
    isFeatured: true
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    message: "Featured blogs fetched successfully",
    results: blogs.length,
    data: blogs
  });
});

export const getRelatedBlogs = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: "published"
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const orConditions = [];

  if (blog.category) {
    orConditions.push({ category: blog.category });
  }

  if (blog.tags.length) {
    orConditions.push({ tags: { $in: blog.tags } });
  }

  const relatedBlogs = orConditions.length
    ? await Blog.find({
        _id: { $ne: blog._id },
        status: "published",
        $or: orConditions
      })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(4)
    : [];

  res.status(200).json({
    success: true,
    message: "Related blogs fetched successfully",
    results: relatedBlogs.length,
    data: relatedBlogs
  });
});

export const getAdminBlogs = asyncHandler(async (req, res) => {
  const filter = buildBlogFilter(req.query, { admin: true });
  const { page, limit, skip } = getPagination(req.query);
  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    message: "Admin blogs fetched successfully",
    results: blogs.length,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    total,
    data: blogs
  });
});

export const getAdminBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  res.status(200).json({
    success: true,
    message: "Blog fetched successfully",
    data: blog
  });
});

export const createBlog = asyncHandler(async (req, res) => {
  const blog = new Blog();
  assignBlogFields(blog, req.body, req.user._id);
  await ensureUniqueSlug(blog.slug || makeSlug(blog.title || ""));
  await blog.save();

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  assignBlogFields(blog, req.body, req.user._id);
  await ensureUniqueSlug(blog.slug || makeSlug(blog.title || ""), blog._id);
  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: blog
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully"
  });
});
