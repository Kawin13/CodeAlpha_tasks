const logger = require("../utils/logger");

// Map internal error codes to user-friendly messages
const USER_MESSAGES = {
  ALL_PROVIDERS_FAILED:
    "Translation service is temporarily unavailable. Please try again in a moment.",
  VALIDATION_ERROR: null, // Pass through the specific message
  RATE_LIMIT: "Too many requests. Please wait a moment before trying again.",
};

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  logger.error("Request error", {
    code: err.code,
    message: err.message,
    path: req.path,
    method: req.method,
    status,
  });

  // Friendly message
  const userMessage =
    err.code && err.code in USER_MESSAGES
      ? USER_MESSAGES[err.code] ?? err.message
      : status === 400
      ? err.message
      : "Something went wrong. Please try again.";

  res.status(status).json({
    error: userMessage,
    code: err.code || "INTERNAL_ERROR",
    ...(process.env.NODE_ENV !== "production" && {
      detail: err.message,
      providerErrors: err.providerErrors,
    }),
  });
}

module.exports = errorHandler;
