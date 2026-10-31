const Income = require("../models/Income");
const Expense = require("../models/Expense");

const DAY = 24 * 60 * 60 * 1000;

const sumAmount = (items) => items.reduce((acc, t) => acc + t.amount, 0);

// GET /api/v1/dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = Date.now();
    const since30 = new Date(now - 30 * DAY);
    const since60 = new Date(now - 60 * DAY);

    const [allIncome, allExpense, last60Income, last30Expense] = await Promise.all([
      Income.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Income.find({ userId, date: { $gte: since60 } }).sort({ date: -1 }),
      Expense.find({ userId, date: { $gte: since30 } }).sort({ date: -1 }),
    ]);

    const [latestIncome, latestExpense] = await Promise.all([
      Income.find({ userId }).sort({ date: -1 }).limit(5),
      Expense.find({ userId }).sort({ date: -1 }).limit(5),
    ]);

    const totalIncome = allIncome[0]?.total || 0;
    const totalExpenses = allExpense[0]?.total || 0;

    const recentTransactions = [
      ...latestIncome.map((t) => ({ ...t.toObject(), type: "income" })),
      ...latestExpense.map((t) => ({ ...t.toObject(), type: "expense" })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.status(200).json({
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      last30DaysExpenses: {
        total: sumAmount(last30Expense),
        transactions: last30Expense,
      },
      last60DaysIncome: {
        total: sumAmount(last60Income),
        transactions: last60Income,
      },
      recentIncome: latestIncome,
      recentExpenses: latestExpense,
      recentTransactions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
