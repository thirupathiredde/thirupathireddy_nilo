/**
 * Application error classes and error-handling middleware.
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ExternalServiceError extends AppError {
  constructor(service, message = 'External service failed') {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
  }
}

/**
 * Global error handler for Express.
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode ?? 500;
  const code = err.code ?? 'INTERNAL_ERROR';
  const message = err.message ?? 'An unexpected error occurred';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(err.details && { details: err.details }),
    },
  });
}

/**
 * Async route wrapper to catch promise rejections.
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
