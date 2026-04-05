const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getInsights } = require('../controllers/insightController');

/**
 * Insight Engine Routes
 *
 * GET /api/insights  - Generate spending insights (analyst, admin)
 *   Compares current week vs previous week expenses by category.
 *   Flags categories with > 30% increase and provides human-readable messages.
 */
router.get('/', protect, authorize('analyst', 'admin'), getInsights);

module.exports = router;
