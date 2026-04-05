const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users (with optional filters)
// @route   GET /api/users
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const users = await User.find(filter).select('-password').lean();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  res.status(200).json({ success: true, data: user });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update user role or active status
// @route   PATCH /api/users/:id
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;

  // Admins cannot deactivate or change their own role to prevent lockout
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Admins cannot modify their own role or status.',
    });
  }

  const allowedUpdates = {};
  if (role !== undefined) {
    if (!['viewer', 'analyst', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be viewer, analyst, or admin.',
      });
    }
    allowedUpdates.role = role;
  }
  if (isActive !== undefined) allowedUpdates.isActive = isActive;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    allowedUpdates,
    { returnDocument: 'after', runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: user,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get currently authenticated user's profile
// @route   GET /api/users/me
// @access  All authenticated users
// ─────────────────────────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').lean();
  res.status(200).json({ success: true, data: user });
});

module.exports = { getAllUsers, getUserById, updateUser, getMe };
