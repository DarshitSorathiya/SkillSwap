class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong (ApiError)",
    errors = [],
    stack = "",
    cause = null
  ) {
    super(message, { cause });
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
    this.cause = cause;
    this.data = null;
    this.success = false;
  }
}

export { ApiError };
