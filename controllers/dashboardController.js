const DashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get financial summary (total income, expenses, net balance)
// @route   GET /api/dashboard/summary
// @access  viewer, analyst, admin
// ─────────────────────────────────────────────────────────────────────────────
const getSummary = asyncHandler(async (req, res) => {
  const summary = await DashboardService.getSummary();

  res.status(200).json({
    success: true,
    data: summary,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get expense/income breakdown by category
// @route   GET /api/dashboard/category-breakdown
// @access  analyst, admin
// ─────────────────────────────────────────────────────────────────────────────
const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const breakdown = await DashboardService.getCategoryBreakdown();

  res.status(200).json({
    success: true,
    count: breakdown.length,
    data: breakdown,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get financial trends (weekly or monthly)
// @route   GET /api/dashboard/trends?period=weekly|monthly
// @access  analyst, admin
// ─────────────────────────────────────────────────────────────────────────────
const getTrends = asyncHandler(async (req, res) => {
  const { period } = req.query;

  if (period && !['weekly', 'monthly'].includes(period)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid period. Use "weekly" or "monthly".',
    });
  }

  const trends = await DashboardService.getTrends(period || 'monthly');

  res.status(200).json({
    success: true,
    period: period || 'monthly',
    count: trends.length,
    data: trends,
  });
});

module.exports = { getSummary, getCategoryBreakdown, getTrends };
