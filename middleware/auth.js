const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect
 * Middleware to verify the JWT token from the Authorization header.
 * Attaches the authenticated user object to `req.user`.
 */
const protect = async (req, res, next) => {
  let token;

  // Expect: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data (excludes password via select: false in schema)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact an administrator.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

/**
 * authorize
 * Role-based access control middleware factory.
 * Usage: authorize('admin', 'analyst')
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
