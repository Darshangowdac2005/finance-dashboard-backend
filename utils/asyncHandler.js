/**
 * Async Handler Utility
 * Wraps async Express route handlers to automatically
 * forward errors to the centralized error handler.
 * Eliminates the need for try/catch in every controller.
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware with error forwarding
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
