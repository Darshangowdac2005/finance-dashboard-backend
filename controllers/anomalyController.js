const Record = require("../models/Record");

exports.getAnomalies = async (req, res) => {
  try {
    const expenses = await Record.find({ type: "expense" });

    const avg =
      expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;

    const anomalies = expenses.filter(e => e.amount > 2 * avg);

    res.status(200).json({
      averageExpense: avg,
      anomalies
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
