import mongoose from "mongoose";
import env from "../src/config/env.js";
import Product from "../src/models/Product.js";
import { normalizeProductMedia, logProductMedia } from "../src/utils/productImages.js";

export const backfillProductMedia = async (options = {}) => {
  const shouldManageConnection =
    options.manageConnection !== false && mongoose.connection.readyState === 0;

  if (shouldManageConnection) {
    await mongoose.connect(env.mongoUri);
  }

  const products = await Product.find({});
  let updatedCount = 0;
  let skippedImagelessCount = 0;
  let unchangedCount = 0;

  for (const product of products) {
    const media = normalizeProductMedia(product, {
      fallbackAlt: product.title || product.name || "",
      logContext: "backfillProductMedia"
    });

    if (!media.images.length) {
      skippedImagelessCount += 1;
      logProductMedia("warn", "Skipping product with no recoverable media", {
        productId: product._id?.toString(),
        slug: product.slug || "",
        title: product.title || product.name || ""
      });
      continue;
    }

    const nextImages = media.images.map((image, index, list) => ({
      publicId: image.publicId || "",
      url: image.url || "",
      alt: image.alt || product.title || product.name || "",
      isPrimary: list.some((item) => item.isPrimary) ? Boolean(image.isPrimary) : index === 0
    }));

    const needsUpdate =
      JSON.stringify(product.images || []) !== JSON.stringify(nextImages) ||
      (product.thumbnail || "") !== (media.thumbnail || "") ||
      (product.featuredImage || "") !== (media.featuredImage || "") ||
      JSON.stringify(product.galleryImages || []) !== JSON.stringify(media.galleryImages || []);

    if (!needsUpdate) {
      if (
        product.images?.length &&
        product.images.some((image) => image?.publicId?.startsWith("legacy/"))
      ) {
        updatedCount += 1;
        logProductMedia("info", "Product media already backfilled", {
          productId: product._id?.toString(),
          slug: product.slug || "",
          imageCount: nextImages.length,
          thumbnail: media.thumbnail || ""
        });
        continue;
      }

      unchangedCount += 1;
      continue;
    }

    product.images = nextImages;
    product.thumbnail = media.thumbnail;
    product.featuredImage = media.featuredImage;
    product.galleryImages = media.galleryImages;

    await product.save();
    updatedCount += 1;

    logProductMedia("info", "Backfilled product media", {
      productId: product._id?.toString(),
      slug: product.slug || "",
      imageCount: nextImages.length,
      thumbnail: media.thumbnail || ""
    });
  }

  logProductMedia("info", "Product media backfill completed", {
    updatedCount,
    skippedImagelessCount,
    unchangedCount
  });

  if (shouldManageConnection && mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  return {
    updatedCount,
    skippedImagelessCount,
    unchangedCount
  };
};

const isDirectRun =
  process.argv[1] &&
  new URL(import.meta.url).pathname.toLowerCase().endsWith(
    process.argv[1].replace(/\\/g, "/").toLowerCase()
  );

if (isDirectRun) {
  backfillProductMedia()
    .then((summary) => {
      console.log("Product media backfill summary:", summary);
      process.exit(0);
    })
    .catch(async (error) => {
      console.error("Product media backfill failed:", error);
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      process.exit(1);
    });
}
