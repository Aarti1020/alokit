import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardAnalytics = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    lowStockProductsCount,
    lowStockProducts,
    recentOrders
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Product.countDocuments({ isDeleted: false }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$pricing.total" } } }
    ]),
    Product.countDocuments({
      isDeleted: false,
      status: "active",
      stock: { $gt: 0 },
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    }),
    Product.find({
      isDeleted: false,
      status: "active",
      stock: { $gt: 0 },
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    })
      .select("name title slug sku stock lowStockThreshold featuredImage thumbnail")
      .sort({ stock: 1, updatedAt: -1 })
      .limit(10),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName email")
      .select("orderNumber pricing.total orderStatus paymentStatus createdAt user")
  ]);

  return {
    overview: {
      totalUsers,
      totalProducts,
      totalOrders,
      revenue: revenueResult[0]?.totalRevenue || 0,
      lowStockProductsCount
    },
    recentOrders,
    lowStockProducts
  };
};
