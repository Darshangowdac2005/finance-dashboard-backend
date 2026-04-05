const Record = require('../models/Record');

/**
 * InsightService
 * Implements the Insight Engine and Anomaly Detection features.
 *
 * Insight Engine:
 *   - Compares current week vs previous week expenses by category
 *   - Flags categories with > 30% increase and generates human-readable messages
 *
 * Anomaly Detection:
 *   - Calculates average expense amount across all records
 *   - Returns records where the amount is > 2x the average
 */
const InsightService = {
  /**
   * Get the date boundaries (start of a given ISO week).
   * @param {number} weeksAgo - 0 = current week, 1 = previous week
   * @returns {{ start: Date, end: Date }}
   */
  _getWeekRange(weeksAgo = 0) {
    const now = new Date();
    // Get Monday of the current week
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday - weeksAgo * 7);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { start: monday, end: sunday };
  },

  /**
   * Aggregate expense totals by category for a given date range.
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Object} { category: total }
   */
  async _getExpensesByCategory(startDate, endDate) {
    const results = await Record.aggregate([
      {
        $match: {
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Convert array to a plain map for O(1) lookups
    return results.reduce((acc, item) => {
      acc[item._id] = item.total;
      return acc;
    }, {});
  },

  /**
   * Generate human-readable insights by comparing this week vs last week.
   * Flags categories with increase >= THRESHOLD (30%).
   * @returns {{ insights: string[], comparison: Object }}
   */
  async generateInsights() {
    const THRESHOLD = 0.30; // 30% increase threshold

    const currentWeek = this._getWeekRange(0);
    const previousWeek = this._getWeekRange(1);

    const [currentData, previousData] = await Promise.all([
      this._getExpensesByCategory(currentWeek.start, currentWeek.end),
      this._getExpensesByCategory(previousWeek.start, previousWeek.end),
    ]);

    const insights = [];
    const comparison = [];

    // Evaluate each category present in the current week
    for (const [category, currentAmount] of Object.entries(currentData)) {
      const previousAmount = previousData[category] || 0;

      let changePercent = null;
      let direction = 'new';

      if (previousAmount > 0) {
        changePercent = ((currentAmount - previousAmount) / previousAmount) * 100;
        direction = changePercent >= 0 ? 'increased' : 'decreased';
      }

      const comparisonEntry = {
        category,
        currentWeek: parseFloat(currentAmount.toFixed(2)),
        previousWeek: parseFloat(previousAmount.toFixed(2)),
        changePercent: changePercent !== null ? parseFloat(changePercent.toFixed(2)) : null,
        direction,
      };
      comparison.push(comparisonEntry);

      // Generate a natural language insight only for significant increases
      if (changePercent !== null && changePercent >= THRESHOLD * 100) {
        insights.push(
          `Your ${category} expenses increased by ${changePercent.toFixed(1)}% compared to last week.`
        );
      }
    }

    // Mention categories with no activity this week vs last week
    for (const [category, previousAmount] of Object.entries(previousData)) {
      if (!currentData[category]) {
        comparison.push({
          category,
          currentWeek: 0,
          previousWeek: parseFloat(previousAmount.toFixed(2)),
          changePercent: -100,
          direction: 'decreased',
        });
        insights.push(
          `Great news! You had no ${category} expenses this week (was $${previousAmount.toFixed(2)} last week).`
        );
      }
    }

    // If no notable changes, provide a neutral message
    if (insights.length === 0) {
      insights.push('Your spending patterns are stable compared to last week. Keep it up!');
    }

    return {
      period: {
        currentWeek: { start: currentWeek.start, end: currentWeek.end },
        previousWeek: { start: previousWeek.start, end: previousWeek.end },
      },
      insights,
      // Sort: highest increase first; treat null changePercent (new category) as Infinity
      // so new categories appear at the top, before stable categories
      comparison: comparison.sort((a, b) => {
        const aChange = a.changePercent !== null ? a.changePercent : Infinity;
        const bChange = b.changePercent !== null ? b.changePercent : Infinity;
        return bChange - aChange;
      }),
    };
  },

  /**
   * Detect anomalous expense records (amount > 2x average expense).
   * @returns {{ averageExpense: number, anomalies: Array }}
   */
  async detectAnomalies() {
    const MULTIPLIER = 2; // Flag records exceeding 2x the average

    // Step 1: Calculate average expense using aggregation
    const avgResult = await Record.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: null,
          averageAmount: { $avg: '$amount' },
          totalRecords: { $sum: 1 },
        },
      },
    ]);

    if (!avgResult.length || avgResult[0].totalRecords === 0) {
      return {
        averageExpense: 0,
        threshold: 0,
        anomalyCount: 0,
        anomalies: [],
        message: 'No expense records found to analyze.',
      };
    }

    const averageExpense = avgResult[0].averageAmount;
    const threshold = averageExpense * MULTIPLIER;

    // Step 2: Find all expense records exceeding 2x the average
    const anomalies = await Record.find({
      type: 'expense',
      amount: { $gt: threshold },
    })
      .populate('createdBy', 'name email')
      .sort({ amount: -1 })
      .lean();

    return {
      averageExpense: parseFloat(averageExpense.toFixed(2)),
      threshold: parseFloat(threshold.toFixed(2)),
      anomalyCount: anomalies.length,
      anomalies,
      message:
        anomalies.length > 0
          ? `Found ${anomalies.length} unusual transaction(s) exceeding 2x the average expense of $${averageExpense.toFixed(2)}.`
          : 'No anomalies detected. All transactions are within normal range.',
    };
  },
};

module.exports = InsightService;
