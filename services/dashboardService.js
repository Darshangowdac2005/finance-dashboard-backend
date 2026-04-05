const Record = require('../models/Record');

/**
 * DashboardService
 * Contains all MongoDB aggregation pipelines used by the dashboard endpoints.
 * Separated from controllers to keep business logic reusable and testable.
 */
const DashboardService = {
  /**
   * Compute total income, total expenses, and net balance.
   * @returns {Object} { totalIncome, totalExpenses, netBalance }
   */
  async getSummary() {
    const result = await Record.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = { totalIncome: 0, totalExpenses: 0, incomeCount: 0, expenseCount: 0 };
    result.forEach((item) => {
      if (item._id === 'income') {
        summary.totalIncome = item.total;
        summary.incomeCount = item.count;
      } else if (item._id === 'expense') {
        summary.totalExpenses = item.total;
        summary.expenseCount = item.count;
      }
    });
    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    return summary;
  },

  /**
   * Group records by category and compute totals for each.
   * @returns {Array} [{ category, type, total, count }]
   */
  async getCategoryBreakdown() {
    return Record.aggregate([
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: '$total',
          count: '$count',
        },
      },
      { $sort: { total: -1 } },
    ]);
  },

  /**
   * Generate weekly or monthly spending/income trends.
   * @param {string} period - "weekly" | "monthly" (default: "monthly")
   * @returns {Array} Trend data points
   */
  async getTrends(period = 'monthly') {
    // $isoWeek is used instead of $week: $week counts from 0 and is ambiguous;
    // $isoWeek uses ISO 8601 (Mon-start, range 1-53) which is consistent with
    // the week boundaries in the Insight Engine.
    const groupByFields =
      period === 'weekly'
        ? {
            year: { $isoWeekYear: '$date' },
            week: { $isoWeek: '$date' },
          }
        : {
            year: { $year: '$date' },
            month: { $month: '$date' },
          };

    // Build the group _id combining period fields + record type
    const groupId = { ...groupByFields, type: '$type' };

    // Build the $project stage fields dynamically
    const projectPeriodFields =
      period === 'weekly'
        ? { year: '$_id.year', week: '$_id.week' }
        : { year: '$_id.year', month: '$_id.month' };

    // Build the $sort stage fields dynamically
    const sortFields =
      period === 'weekly' ? { year: 1, week: 1 } : { year: 1, month: 1 };

    const trends = await Record.aggregate([
      {
        $group: {
          _id: groupId,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          ...projectPeriodFields,
          type: '$_id.type',
          total: '$total',
          count: '$count',
        },
      },
      { $sort: sortFields },
    ]);

    return trends;
  },
};

module.exports = DashboardService;
