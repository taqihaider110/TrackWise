const SavingsProgress = require("../models/SavingsProgress");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Op, Sequelize, literal } = require("sequelize");
const { startOfMonth, endOfMonth, format, subMonths } = require("date-fns");

// Controller to fetch all savings for the user with pagination
exports.getAllSavingsForUser = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "User ID is missing" });

    // 1. Fetch all distinct months from income and expense
    const [incomeMonths, expenseMonths] = await Promise.all([
      Income.findAll({
        attributes: [[literal(`TO_CHAR("date", 'YYYY-MM')`), "month"]],
        where: { userId },
        raw: true,
      }),
      Expense.findAll({
        attributes: [[literal(`TO_CHAR("date", 'YYYY-MM')`), "month"]],
        where: { userId },
        raw: true,
      }),
    ]);

    const allMonthsSet = new Set([
      ...incomeMonths.map((m) => m.month),
      ...expenseMonths.map((m) => m.month),
    ]);
    const allMonths = Array.from(allMonthsSet).sort();

    // 2. Fetch existing savings progress for those months
    const existingProgress = await SavingsProgress.findAll({
      where: {
        userId,
        month: { [Op.in]: allMonths },
      },
      raw: true,
    });

    const progressMap = new Map(existingProgress.map((p) => [p.month, p]));

    // 3. Calculate and conditionally upsert only changed data
    for (const label of allMonths) {
      const monthStart = new Date(`${label}-01`);
      const monthEnd = endOfMonth(monthStart);

      const [income, expense] = await Promise.all([
        Income.sum("amount", {
          where: {
            userId,
            date: { [Op.between]: [monthStart, monthEnd] },
          },
        }),
        Expense.sum("amount", {
          where: {
            userId,
            date: { [Op.between]: [monthStart, monthEnd] },
          },
        }),
      ]);

      const totalIncome = income || 0;
      const totalExpense = expense || 0;
      const savings = totalIncome - totalExpense;

      const existing = progressMap.get(label);

      if (
        !existing ||
        existing.totalIncome !== totalIncome ||
        existing.totalExpense !== totalExpense ||
        existing.savings !== savings
      ) {
        await SavingsProgress.upsert({
          userId,
          goalId: null,
          month: label,
          totalIncome,
          totalExpense,
          savings,
          updatedAt: new Date(),
        });
      }
    }

    // 4. Fetch paginated results
    const savingsRecords = await SavingsProgress.findAndCountAll({
      where: { userId },
      order: [["month", "DESC"]],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
    });

    // 5. Calculate overall totals
    const [totalSavings, totalMonths] = await Promise.all([
      SavingsProgress.sum("savings", { where: { userId } }),
      SavingsProgress.count({ where: { userId } }),
    ]);
    res.status(200).json({
      totalRecords: savingsRecords.count,
      savings: savingsRecords.rows,
      totalPages: Math.ceil(savingsRecords.count / pageSize),
      currentPage: parseInt(page),
      totalSavings: totalSavings || 0,
      averageSavings: totalMonths > 0 ? parseFloat((totalSavings / totalMonths).toFixed(2)) : 0,
    });
  } 
  catch (error) {
    console.error("Error in getAllSavingsForUser:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller to get monthly saving progress for a given month
exports.getMonthlySavingProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "User ID is missing" });

    const now = new Date();
    const targetDate = req.query.month ? new Date(`${req.query.month}-01`) : now;
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);
    const formattedMonth = format(startDate, "yyyy-MM");

    const [totalIncome, totalExpense] = await Promise.all([
      Income.sum("amount", {
        where: {
          userId,
          date: { [Op.between]: [startDate, endDate] },
        },
      }),
      Expense.sum("amount", {
        where: {
          userId,
          date: { [Op.between]: [startDate, endDate] },
        },
      }),
    ]);

    const incomeVal = totalIncome || 0;
    const expenseVal = totalExpense || 0;
    const savings = incomeVal - expenseVal;

    // Check if record already exists and is the same
    const existing = await SavingsProgress.findOne({
      where: { userId, month: formattedMonth },
    });

    const shouldUpdate =
      !existing ||
      existing.totalIncome !== incomeVal ||
      existing.totalExpense !== expenseVal ||
      existing.savings !== savings;

    if (shouldUpdate) {
      await SavingsProgress.upsert({
        userId,
        goalId: null, // Adjust if necessary
        month: formattedMonth,
        totalIncome: incomeVal,
        totalExpense: expenseVal,
        savings,
        updatedAt: new Date(),
      });
    }

    return res.status(200).json({
      month: formattedMonth,
      totalIncome: incomeVal,
      totalExpense: expenseVal,
      savings,
    });
  } catch (error) {
    console.error("Error in getMonthlySavingProgress:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPast12MonthsSavings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const userId = req.user.id;

    // Step 1: Generate last 12 months' labels
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i);
      return format(startOfMonth(date), 'yyyy-MM');
    });

    const monthStartDates = last12Months.map(month => new Date(`${month}-01`));
    const monthEnd = new Date(); // max range to cover all 12 months

    // Step 2: Get all incomes grouped by month
    const incomeData = await Income.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('date')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalIncome']
      ],
      where: {
        userId,
        date: { [Op.between]: [monthStartDates[0], monthEnd] }
      },
      group: ['month'],
      raw: true
    });

    // Step 3: Get all expenses grouped by month
    const expenseData = await Expense.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('date')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalExpense']
      ],
      where: {
        userId,
        date: { [Op.between]: [monthStartDates[0], monthEnd] }
      },
      group: ['month'],
      raw: true
    });

    // Convert income & expense data into a lookup map
    const incomeMap = new Map();
    for (const row of incomeData) {
      incomeMap.set(format(new Date(row.month), 'yyyy-MM'), parseFloat(row.totalIncome));
    }

    const expenseMap = new Map();
    for (const row of expenseData) {
      expenseMap.set(format(new Date(row.month), 'yyyy-MM'), parseFloat(row.totalExpense));
    }

    // Step 4: Combine and compute monthly savings
    const savingsData = [];
    let totalSavings = 0;

    for (const month of last12Months) {
      const income = incomeMap.get(month) || 0;
      const expense = expenseMap.get(month) || 0;
      const savings = income - expense;
      totalSavings += savings;

      // Upsert into SavingsProgress table
      await SavingsProgress.upsert({
        userId,
        goalId: null,
        month,
        totalIncome: income,
        totalExpense: expense,
        savings,
        updatedAt: new Date(),
      });

      savingsData.push({ month, totalIncome: income, totalExpense: expense, savings });
    }

    res.status(200).json({
      totalSavings,
      savingsProgress: savingsData,
    });
  } catch (error) {
    console.error('Error in getPast12MonthsSavings:', error);
    res.status(500).json({ error: error.message });
  }
};