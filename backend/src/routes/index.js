import express from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import subCategoryRoutes from "./subcategory.routes.js";
import productRoutes from "./product.routes.js";
 import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";
import paymentRoutes from "./payment.routes.js";
import leadRoutes from "./lead.routes.js";
import contactRoutes from "./contact.routes.js";
import reviewRoutes from "./review.routes.js";
import blogRoutes from "./blog.routes.js";
import pageRoutes from "./page.routes.js";
import faqRoutes from "./faq.routes.js";
import homepageRoutes from "./homepage.routes.js";
import bannerRoutes from "./banner.routes.js";
import seoRoutes from "./seo.routes.js";
import collectionRoutes from "./collection.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import searchRoutes from "./search.routes.js";
import rudrakshaCalculatorRoutes from "./rudrakshaCalculator.routes.js";
import adminRoutes from "./admin.routes.js";
import { getMongoTransactionCapability } from "../utils/mongoTransactions.js";

const router = express.Router();

router.get("/health", async (req, res, next) => {
  try {
    const capability = await getMongoTransactionCapability();

    res.status(200).json({
      success: true,
      message: "API is healthy",
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
        mongoTransactions: capability
      }
    });
  } catch (error) {
    next(error);
  }
});

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/categories", categoryRoutes);
router.use("/subcategories", subCategoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/leads", leadRoutes);
router.use("/contact", contactRoutes);
router.use("/reviews", reviewRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/rudraksha-calculator", rudrakshaCalculatorRoutes);
router.use("/", searchRoutes);
router.use("/", blogRoutes);
router.use("/", pageRoutes);
router.use("/", faqRoutes);
router.use("/", homepageRoutes);
router.use("/", bannerRoutes);
router.use("/", seoRoutes);
router.use("/", collectionRoutes);

export default router;
