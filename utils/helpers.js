const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a given user ID.
 *
 * @param {string} id - MongoDB user ObjectId
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Build a paginated query response envelope.
 *
 * @param {Array}  data       - Array of result documents
 * @param {number} total      - Total document count (before pagination)
 * @param {number} page       - Current page number
 * @param {number} limit      - Items per page
 * @returns {Object} Paginated response object
 */
const buildPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    success: true,
    count: data.length,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data,
  };
};

/**
 * Parse pagination parameters from request query.
 * Defaults: page=1, limit=20, max limit capped at 100.
 *
 * @param {Object} query - req.query object
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { generateToken, buildPaginatedResponse, parsePagination };
