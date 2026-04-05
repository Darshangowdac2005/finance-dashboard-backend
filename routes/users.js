const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  getMe,
} = require('../controllers/userController');

/**
 * User Routes
 * All routes require JWT authentication.
 * Admin-only routes additionally require role authorization.
 */

// GET /api/users/me  - Authenticated user's own profile (all roles)
router.get('/me', protect, getMe);

// GET /api/users     - List all users (admin only)
router.get('/', protect, authorize('admin'), getAllUsers);

// GET  /api/users/:id   - Get specific user (admin only)
router.get('/:id', protect, authorize('admin'), getUserById);

// PATCH /api/users/:id  - Update user role or status (admin only)
router.patch('/:id', protect, authorize('admin'), updateUser);

module.exports = router;
