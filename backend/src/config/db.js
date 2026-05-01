import mongoose from "mongoose";
import env from "./env.js";
import Product from "../models/Product.js";
import { resetMongoTransactionCapabilityCache } from "../utils/mongoTransactions.js";

const dropLegacyProductSkuUniqueIndexes = async () => {
  try {
    const indexes = await Product.collection.indexes();
    const legacySkuIndexes = indexes.filter(
      (index) => index.unique && Object.keys(index.key || {}).some((key) => key.includes("sku"))
    );

    await Promise.all(
      legacySkuIndexes.map((index) => Product.collection.dropIndex(index.name))
    );

    if (legacySkuIndexes.length) {
      console.log(
        `Dropped legacy unique product SKU index${legacySkuIndexes.length > 1 ? "es" : ""}: ${legacySkuIndexes
          .map((index) => index.name)
          .join(", ")}`
      );
    }
  } catch (error) {
    if (error?.codeName !== "NamespaceNotFound") {
      console.warn("Unable to drop legacy product SKU unique indexes:", error.message);
    }
  }
};

const connectDB = async () => {
  try {
    const isSrv = env.mongoUri.startsWith("mongodb+srv://");

    const connectOptions = {
      ...(env.mongoReplicaSet ? { replicaSet: env.mongoReplicaSet } : {}),
      ...(!isSrv && typeof env.mongoDirectConnection === "boolean"
        ? { directConnection: env.mongoDirectConnection }
        : {})
    };

    const conn = await mongoose.connect(env.mongoUri, connectOptions);

    resetMongoTransactionCapabilityCache();
    await dropLegacyProductSkuUniqueIndexes();

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
