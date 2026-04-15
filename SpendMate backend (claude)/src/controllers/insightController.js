const Expense = require('../models/Expense');

exports.getMonthlyInsights = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = parseInt(month) || now.getMonth() + 1;
    const y = parseInt(year) || now.getFullYear();

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: start, $lte: end }
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categories = {};
    expenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Daily spend breakdown
    const daily = {};
    expenses.forEach(e => {
      const day = new Date(e.date).toISOString().split('T')[0];
      daily[day] = (daily[day] || 0) + e.amount;
    });

    res.json({
      month: m,
      year: y,
      total: Math.round(total * 100) / 100,
      topCategory,
      categories,
      daily,
      expenseCount: expenses.length,
      avgPerDay: expenses.length ? Math.round((total / new Date(y, m, 0).getDate()) * 100) / 100 : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getYearlyInsights = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: start, $lte: end }
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthly = Array(12).fill(0);
    const categories = {};

    expenses.forEach(e => {
      monthly[new Date(e.date).getMonth()] += e.amount;
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    res.json({
      year,
      total: Math.round(total * 100) / 100,
      monthly: monthly.map(v => Math.round(v * 100) / 100),
      categories,
      topCategory: Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
