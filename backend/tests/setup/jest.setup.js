import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Writable } from "stream";

process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "test-cloud";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "test-key";
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "test-secret";
process.env.CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "alokit";
process.env.CLOUDINARY_MOCK_MODE = "false";

let mongoServer;
let clearEmailOutbox = () => {};
let resetMongoTransactionCapabilityCache = () => {};

global.__cloudinaryMock = {
  failNextUpload: false,
  uploadedAssets: [],
  deletedAssets: []
};

beforeAll(async () => {
  const shouldUseExternalMongo =
    process.env.USE_EXTERNAL_TEST_MONGO === "true" &&
    Boolean(process.env.TEST_MONGO_URI || process.env.MONGO_URI);

  if (!shouldUseExternalMongo) {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: "alokit_test"
      }
    });

    process.env.MONGO_URI = mongoServer.getUri();
  } else if (process.env.TEST_MONGO_URI) {
    process.env.MONGO_URI = process.env.TEST_MONGO_URI;
  }

  if (mongoose.connection.readyState === 0) {
    const emailService = await import("../../src/services/email.service.js");
    const mongoTransactions = await import("../../src/utils/mongoTransactions.js");
    const cloudinaryModule = await import("../../src/config/cloudinary.js");

    clearEmailOutbox = emailService.clearEmailOutbox;
    resetMongoTransactionCapabilityCache =
      mongoTransactions.resetMongoTransactionCapabilityCache;

    const cloudinary = cloudinaryModule.default;

    cloudinary.uploader.upload_stream = (options = {}, callback) =>
      new Writable({
        write(chunk, encoding, done) {
          done();
        },
        final(done) {
          if (global.__cloudinaryMock.failNextUpload) {
            global.__cloudinaryMock.failNextUpload = false;
            callback(new Error("Mock Cloudinary upload failed"));
            done();
            return;
          }

          const publicId = options.public_id || `${process.env.CLOUDINARY_FOLDER}/products/mock-image`;
          const version = Date.now();
          const secureUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${version}/${publicId}.webp`;

          global.__cloudinaryMock.uploadedAssets.push({
            publicId,
            secureUrl,
            options
          });
          callback(null, {
            asset_id: `asset_${version}`,
            public_id: publicId,
            secure_url: secureUrl,
            url: secureUrl,
            version
          });
          done();
        }
      });

    cloudinary.api.delete_resources = async (publicIds = []) => {
      const deleted = {};

      for (const publicId of publicIds) {
        deleted[publicId] = "deleted";
        global.__cloudinaryMock.deletedAssets.push(publicId);
      }

      return { deleted };
    };

    cloudinary.url = (publicId, options = {}) => {
      const transformations = Array.isArray(options.transformation)
        ? options.transformation
            .flatMap((item) =>
              Object.entries(item).map(([key, value]) => `${key}_${value}`)
            )
            .join(",")
        : "";

      const transformationSegment = transformations ? `${transformations}/` : "";

      return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformationSegment}${publicId}.webp`;
    };

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5_000
    });
    resetMongoTransactionCapabilityCache();
  }
}, 60_000);

beforeEach(async () => {
  clearEmailOutbox();
  global.__cloudinaryMock.failNextUpload = false;
  global.__cloudinaryMock.uploadedAssets = [];
  global.__cloudinaryMock.deletedAssets = [];
  const { collections } = mongoose.connection;
  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    resetMongoTransactionCapabilityCache();
  }

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = undefined;
  }
}, 60_000);
