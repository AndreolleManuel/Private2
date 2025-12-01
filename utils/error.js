import { httpStatusCodes } from "./index.js";

// Parent class for custom HTTP errors
export class HttpError extends Error {
  constructor(message, statusCode, { code, details } = {}) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}


// Specific HTTP error classes
export class NotFoundError extends HttpError {
  constructor(message = "Resource not found", details) {
    super(message, httpStatusCodes.NOT_FOUND, { code: "NOT_FOUND", details });
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", details) {
    super(message, httpStatusCodes.BAD_REQUEST, { code: "BAD_REQUEST", details });
    this.name = "BadRequestError";
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict", details) {
    super(message, httpStatusCodes.CONFLICT, { code: "CONFLICT", details });
    this.name = "ConflictError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details) {
    super(message, httpStatusCodes.FORBIDDEN, { code: "FORBIDDEN", details });
    this.name = "ForbiddenError";
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal server error", details) {
    super(message, httpStatusCodes.INTERNAL_SERVER_ERROR, { code: "INTERNAL_SERVER_ERROR", details });
    this.name = "InternalServerError";
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = "Too many requests", details) {
    super(message, httpStatusCodes.TOO_MANY_REQUESTS, { code: "TOO_MANY_REQUESTS", details });
    this.name = "TooManyRequestsError";
  }
}

export class ValidationError extends HttpError {
  constructor(message = "Validation error", details) {
    super(message, httpStatusCodes.UNPROCESSABLE_ENTITY, { code: "VALIDATION_ERROR", details });
    this.name = "ValidationError";
  }
}
