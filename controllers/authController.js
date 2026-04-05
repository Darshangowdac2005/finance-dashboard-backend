const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/helpers');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Basic required-field validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password.',
    });
  }

  // Check for duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists.',
    });
  }

  // Create user — role is always 'viewer' on self-registration.
  // Role escalation must go through PATCH /api/users/:id (admin only).
  const user = await User.create({
    name,
    email,
    password,
    role: 'viewer',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user and return JWT
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password.',
    });
  }

  // Explicitly select password since schema defaults to select: false
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account is deactivated. Contact an administrator.',
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

module.exports = { register, login };
