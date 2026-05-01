import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import env from "./config/env.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = new Set(
  [
    env.clientUrl,
    env.adminClientUrl,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://alokit.co",
    "https://www.alokit.co",
    "https://admin.alokit.co"
  ].filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  "/assets",
  express.static(path.join(__dirname, "../public/assets"), {
    fallthrough: false,
    maxAge: env.nodeEnv === "production" ? "7d" : 0
  })
);

app.use(
  "/media",
  express.static(path.join(__dirname, "../public/media"), {
    fallthrough: false,
    maxAge: env.nodeEnv === "production" ? "7d" : 0
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Alokit API is running",
    data: {
      apiBase: env.localApiBase
    }
  });
});

app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;