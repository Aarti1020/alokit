const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Images must be 2MB or smaller and video must be between 2048 KB and 5120 KB"
        : err.code === "LIMIT_FILE_COUNT"
          ? "You can upload up to 8 images and 1 video only"
          : "Invalid file upload request";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier";
  }

  if (err.code === 11000) {
    statusCode = 400;
    const duplicateField = Object.keys(err.keyValue)[0];
    message = `${duplicateField} already exists`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

export default errorMiddleware;
