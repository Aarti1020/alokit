import mongoose from "mongoose";
import ApiError from "./ApiError.js";
import env from "../config/env.js";

const LOCAL_MONGO_URI_PATTERN = /^mongodb:\/\/(127\.0\.0\.1|localhost)(:\d+)?/i;

let cachedCapability = null;

const isLocalMongoUri = (mongoUri = "") => LOCAL_MONGO_URI_PATTERN.test(mongoUri);
const isLocalMongoHost = (host = "") => host === "127.0.0.1" || host === "localhost";

const resolveTopology = (hello = {}) => {
  if (hello.msg === "isdbgrid") {
    return "sharded";
  }

  if (hello.setName) {
    return "replicaSet";
  }

  if (hello.isWritablePrimary || hello.ismaster) {
    return "standalone";
  }

  return "unknown";
};

const fetchHello = async (connection) => {
  const admin = connection.db.admin();

  try {
    return await admin.command({ hello: 1 });
  } catch {
    return admin.command({ isMaster: 1 });
  }
};

export const resetMongoTransactionCapabilityCache = () => {
  cachedCapability = null;
};

export const getMongoTransactionCapability = async (connection = mongoose.connection) => {
  const nodeEnv = process.env.NODE_ENV || env.nodeEnv;
  const currentMongoUri = process.env.MONGO_URI || env.mongoUri || "";
  const transactionsRequired =
    process.env.MONGO_TRANSACTIONS_REQUIRED === "true" || nodeEnv === "production";
  const allowTransactionFallback =
    process.env.MONGO_ALLOW_TRANSACTION_FALLBACK === "true" ||
    (process.env.MONGO_ALLOW_TRANSACTION_FALLBACK !== "false" &&
      nodeEnv !== "production" &&
      (isLocalMongoUri(currentMongoUri) || isLocalMongoHost(connection.host)));

  if (cachedCapability && cachedCapability.connectionName === connection.name) {
    return cachedCapability.value;
  }

  if (connection.readyState !== 1) {
    const capability = {
      supported: false,
      fallbackAllowed: allowTransactionFallback,
      topology: "unknown",
      mode: "disconnected"
    };

    cachedCapability = {
      connectionName: connection.name,
      value: capability
    };

    return capability;
  }

  const hello = await fetchHello(connection);
  const topology = resolveTopology(hello);
  const supported =
    Boolean(hello.logicalSessionTimeoutMinutes) &&
    (topology === "replicaSet" || topology === "sharded");
  const fallbackAllowed =
    !supported &&
    !transactionsRequired &&
    allowTransactionFallback;

  const capability = {
    supported,
    fallbackAllowed,
    topology,
    mode: supported ? "transaction" : fallbackAllowed ? "fallback" : "unsupported"
  };

  cachedCapability = {
    connectionName: connection.name,
    value: capability
  };

  return capability;
};

export const runMongoTransaction = async (work, { connection = mongoose.connection } = {}) => {
  const capability = await getMongoTransactionCapability(connection);

  if (capability.supported) {
    const session = await mongoose.startSession();

    try {
      let result;

      await session.withTransaction(async () => {
        result = await work({
          session,
          capability
        });
      });

      return {
        result,
        capability
      };
    } finally {
      await session.endSession();
    }
  }

  if (capability.fallbackAllowed) {
    const result = await work({
      session: null,
      capability
    });

    return {
      result,
      capability
    };
  }

  throw new ApiError(
    500,
    "MongoDB transactions require a replica set or mongos deployment. Configure a replica set for production or enable local standalone fallback only in development."
  );
};
