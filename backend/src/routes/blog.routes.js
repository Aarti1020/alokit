import express from "express";
import {
  createBlog,
  deleteBlog,
  getAdminBlogById,
  getAdminBlogs,
  getBlogBySlug,
  getBlogs,
  getFeaturedBlogs,
  getRelatedBlogs,
  updateBlog
} from "../controllers/blog.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  blogIdParamValidator,
  blogSlugParamValidator,
  createBlogValidator,
  publicBlogListValidator,
  updateBlogValidator
} from "../validators/blog.validator.js";

const router = express.Router();

router.get("/blogs/featured/list", getFeaturedBlogs);
router.get("/blogs/related/:slug", blogSlugParamValidator, validate, getRelatedBlogs);
router.get("/blogs/:slug", blogSlugParamValidator, validate, getBlogBySlug);
router.get("/blogs", publicBlogListValidator, validate, getBlogs);

router.get(
  "/admin/blogs/:id",
  protect,
  authorize("admin", "superAdmin"),
  blogIdParamValidator,
  validate,
  getAdminBlogById
);
router.get("/admin/blogs", protect, authorize("admin", "superAdmin"), getAdminBlogs);
router.post(
  "/admin/blogs",
  protect,
  authorize("admin", "superAdmin"),
  createBlogValidator,
  validate,
  createBlog
);
router.put(
  "/admin/blogs/:id",
  protect,
  authorize("admin", "superAdmin"),
  updateBlogValidator,
  validate,
  updateBlog
);
router.delete(
  "/admin/blogs/:id",
  protect,
  authorize("admin", "superAdmin"),
  blogIdParamValidator,
  validate,
  deleteBlog
);

export default router;
