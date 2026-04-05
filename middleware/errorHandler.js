/**
 * Centralized Error Handling Middleware
 * Catches errors thrown anywhere in the Express pipeline and
 * returns a consistent JSON error response.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose Specific Errors ────────────────────────────────────────────────

  // Mongoose bad ObjectId (e.g., invalid record ID format)
  if (err.name === 'CastError') {
    message = `Resource not found. Invalid ID: ${err.value}`;
    statusCode = 404;
  }

  // Mongoose duplicate key (e.g., duplicate email on registration)
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    message = `Duplicate value for field: ${field}. Please use a different value.`;
    statusCode = 400;
  }

  // Mongoose validation errors (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join('. ');
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again.';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Your session has expired. Please log in again.';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development for debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
