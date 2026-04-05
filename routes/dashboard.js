const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getSummary,
  getCategoryBreakdown,
  getTrends,
} = require('../controllers/dashboardController');

/**
 * Dashboard Routes
 *
 * GET /api/dashboard/summary            - Financial summary (all roles)
 * GET /api/dashboard/category-breakdown - Category breakdown (analyst, admin)
 * GET /api/dashboard/trends             - Time-based trends (analyst, admin)
 */

// Summary is accessible to all authenticated users (including viewers)
router.get('/summary', protect, getSummary);

// Detailed analytics require analyst or admin role
router.get('/category-breakdown', protect, authorize('analyst', 'admin'), getCategoryBreakdown);
router.get('/trends', protect, authorize('analyst', 'admin'), getTrends);

module.exports = router;
