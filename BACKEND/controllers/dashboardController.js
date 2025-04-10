const Income = require("../models/Income");
const Expense = require("../models/Expense");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total income
    const incomes = await Income.findAll({ where: { userId } });
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

    // Total expense
    const expenses = await Expense.findAll({ where: { userId } });
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate savings
    const savings = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      savings,
      recentIncomes: incomes.slice(-5).reverse(),  // Optional: latest 5 incomes
      recentExpenses: expenses.slice(-5).reverse(), // Optional: latest 5 expenses
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(400).json({ error: "Failed to load dashboard data" });
  }
};
