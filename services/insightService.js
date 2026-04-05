const Record = require("../models/Record");

exports.generateInsights = async () => {
  const insights = [];

  const now = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(now.getDate() - 7);

  const prevWeek = new Date();
  prevWeek.setDate(now.getDate() - 14);

  // Current week expenses
  const current = await Record.aggregate([
    { $match: { type: "expense", date: { $gte: lastWeek } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);

  // Previous week expenses
  const previous = await Record.aggregate([
    { $match: { type: "expense", date: { $gte: prevWeek, $lt: lastWeek } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);

  const prevMap = {};
  previous.forEach(p => {
    prevMap[p._id] = p.total;
  });

  // Compare current spending against previous to detect meaningful trends
  current.forEach(c => {
    const prev = prevMap[c._id] || 0;

    // We only generate an insight if previous spending exists to serve as a valid baseline
    if (prev > 0) {
      const increase = ((c.total - prev) / prev) * 100;
      // Filter out small differences; only flag significant changes (> 30%)
      if (increase > 30) {
        // Professional phrasing for a polished user experience
        insights.push(`Your ${c._id} spending increased by ${increase.toFixed(1)}% compared to last week.`);
      }
    }
  });

  if (insights.length === 0) {
    insights.push("Your spending is stable this week");
  }

  return insights;
};
