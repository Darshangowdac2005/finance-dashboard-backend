const insightService = require("../services/insightService");

exports.getInsights = async (req, res) => {
  try {
    const insights = await insightService.generateInsights();
    res.status(200).json({ insights });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
