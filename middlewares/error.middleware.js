import { httpStatusCodes, HttpError } from "../utils/index.js";

// error handling middleware
export function errorHandler(error, _req, res, _next) {
  console.log(error);

  // Custom application error
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: {
        type: error.name,
        message: error.message,
        code: error.code,
        details: error.details ?? null,
      }
    });
  }
  // Joi validation error
  if (error.name === "ValidationError") {
    return res.status(httpStatusCodes.BAD_REQUEST).json({
      error: {
        type: "ValidationError",
        message: "Validation error",
        details: error.details || error.errors || null
      }
    });
  }
  // Generic error
  res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      type: "InternalServerError",
      message: "Unexpected server error. Please try again later.",
      details: null
    }
  });
}
