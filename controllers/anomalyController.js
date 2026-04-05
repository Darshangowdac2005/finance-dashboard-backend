const Record = require("../models/Record");
const asyncHandler = require("../utils/asyncHandler");

exports.getAnomalies = asyncHandler(async (req, res) => {
  const expenses = await Record.find({ type: "expense" });

  // Edge case: if no expense records exist, return an empty array to prevent division by zero gracefully
  if (!expenses.length) {
    return res.status(200).json({ success: true, data: { averageExpense: 0, anomalies: [] } });
  }

  const avg =
    expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;

  const anomalies = expenses.filter(e => e.amount > 2 * avg);

  res.status(200).json({
    success: true,
    data: {
      averageExpense: avg,
      anomalies
    }
  });
});
