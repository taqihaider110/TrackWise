const { Income, Expense, Goal, Debt } = require('../models');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total income
    const incomes = await Income.findAll({ where: { userId } });
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

    // Total expenses
    const expenses = await Expense.findAll({ where: { userId } });
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate savings
    const savings = totalIncome - totalExpenses;

    // Calculate savings rate
    const savingsRate = (totalIncome === 0) ? 0 : (savings / totalIncome) * 100;

    // Income vs expense ratio
    const incomeVsExpenseRatio = totalIncome / (totalExpenses || 1); // Prevent division by zero

    // Category breakdown for expenses
    const categoryDistribution = {};
    expenses.forEach(exp => {
      categoryDistribution[exp.category] = (categoryDistribution[exp.category] || 0) + exp.amount;
    });

    // Recent incomes and expenses (latest 5)
    const recentIncomes = incomes.slice(-5).reverse();  // Latest 5 incomes
    const recentExpenses = expenses.slice(-5).reverse(); // Latest 5 expenses

    // Financial goal and progress
    const goal = await Goal.findOne({ where: { userId } });
    const savingsProgress = goal ? (savings / goal.target) * 100 : 0;

    // Debts (optional)
    const debts = await Debt.findAll({ where: { userId } });
    const totalDebt = debts.reduce((sum, debt) => sum + debt.amountOwed, 0);

    res.status(200).json({
      totalIncome,
      totalExpenses,
      savings,
      savingsRate,
      incomeVsExpenseRatio,
      recentIncomes,
      recentExpenses,
      categoryDistribution,
      goal: goal ? goal.target : 0,
      savingsProgress,
      totalDebt,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};