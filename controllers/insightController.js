const insightService = require("../services/insightService");
const asyncHandler = require("../utils/asyncHandler");

exports.getInsights = asyncHandler(async (req, res) => {
  const insights = await insightService.generateInsights();
  res.status(200).json({ success: true, data: { insights } });
});
