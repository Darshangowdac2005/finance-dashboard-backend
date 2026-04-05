const InsightService = require('../services/insightService');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Generate human-readable spending insights (current vs last week)
// @route   GET /api/insights
// @access  analyst, admin
// ─────────────────────────────────────────────────────────────────────────────
const getInsights = asyncHandler(async (req, res) => {
  const insightData = await InsightService.generateInsights();

  res.status(200).json({
    success: true,
    data: insightData,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Detect anomalous expense transactions (> 2x average)
// @route   GET /api/records/anomalies
// @access  analyst, admin
// ─────────────────────────────────────────────────────────────────────────────
const getAnomalies = asyncHandler(async (req, res) => {
  const anomalyData = await InsightService.detectAnomalies();

  res.status(200).json({
    success: true,
    data: anomalyData,
  });
});

module.exports = { getInsights, getAnomalies };
