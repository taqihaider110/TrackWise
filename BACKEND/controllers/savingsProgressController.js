const SavingsProgress = require("../models/SavingsProgress");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Op } = require("sequelize");
const { startOfMonth, endOfMonth, format, subMonths } = require("date-fns");

// Controller to fetch all savings for the user with pagination
exports.getAllSavingsForUser = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: "User ID is missing" });

    // 1. Get all distinct months with income or expense
    const [incomeMonths, expenseMonths] = await Promise.all([
      Income.findAll({
        attributes: [[fn("DISTINCT", fn("DATE_FORMAT", col("date"), "%Y-%m")), "month"]],
        where: { userId },
        raw: true
      }),
      Expense.findAll({
        attributes: [[fn("DISTINCT", fn("DATE_FORMAT", col("date"), "%Y-%m")), "month"]],
        where: { userId },
        raw: true
      })
    ]);

    const allMonthsSet = new Set();
    incomeMonths.forEach(m => allMonthsSet.add(m.month));
    expenseMonths.forEach(m => allMonthsSet.add(m.month));
    const allMonths = Array.from(allMonthsSet).sort();

    // 2. Upsert savings for each month
    for (const label of allMonths) {
      const monthStart = new Date(`${label}-01`);
      const monthEnd = endOfMonth(monthStart);

      const [income, expense] = await Promise.all([
        Income.sum("amount", {
          where: {
            userId,
            date: { [Op.between]: [monthStart, monthEnd] }
          }
        }),
        Expense.sum("amount", {
          where: {
            userId,
            date: { [Op.between]: [monthStart, monthEnd] }
          }
        })
      ]);

      const savings = (income || 0) - (expense || 0);

      await SavingsProgress.upsert({
        userId,
        goalId: null,
        month: label,
        totalIncome: income || 0,
        totalExpense: expense || 0,
        savings,
        updatedAt: new Date()
      });
    }

    // 3. Fetch paginated savings progress
    const savingsRecords = await SavingsProgress.findAndCountAll({
      where: { userId },
      order: [["month", "DESC"]],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize)
    });

    // 4. Calculate total and average savings
    const totalSavings = await SavingsProgress.sum("savings", {
      where: { userId }
    });

    const totalMonths = await SavingsProgress.count({
      where: { userId }
    });

    const averageSavings = totalMonths > 0 ? (totalSavings / totalMonths).toFixed(2) : 0;

    // 5. Respond
    res.status(200).json({
      totalRecords: savingsRecords.count,
      savings: savingsRecords.rows,
      totalPages: Math.ceil(savingsRecords.count / pageSize),
      currentPage: parseInt(page),
      totalSavings: totalSavings || 0,
      averageSavings: parseFloat(averageSavings)
    });

  } catch (error) {
    console.error("Error in getAllSavingsForUser:", error);
    res.status(400).json({ error: error.message });
  }
};

// Controller to get monthly saving progress for a given month
exports.getMonthlySavingProgress = async (req, res) => {
  try {
    const { month } = req.query;
    if (!req.user?.id) return res.status(400).json({ error: "User ID is missing" });

    const targetDate = month ? new Date(`${month}-01`) : new Date();
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);

    const [totalIncome, totalExpense] = await Promise.all([
      Income.sum("amount", {
        where: {
          userId: req.user.id,
          date: { [Op.between]: [startDate, endDate] },
        },
      }),
      Expense.sum("amount", {
        where: {
          userId: req.user.id,
          date: { [Op.between]: [startDate, endDate] },
        },
      }),
    ]);

    const savings = (totalIncome || 0) - (totalExpense || 0);

    // Update or insert the record in SavingsProgress table
    await SavingsProgress.upsert({
      userId: req.user.id,
      goalId: null, // Assuming null for goalId, you can adjust if required
      month: format(startDate, "yyyy-MM"),
      totalIncome: totalIncome || 0,
      totalExpense: totalExpense || 0,
      savings,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(200).json({
      month: month || targetDate.toISOString().slice(0, 7),
      totalIncome: totalIncome || 0,
      totalExpense: totalExpense || 0,
      savings,
    });
  } catch (error) {
    console.error("Error in getMonthlySavingProgress:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getPast12MonthsSavings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const savingsData = [];
    let totalSavings = 0;

    // Iterate through the last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));
      const label = format(monthStart, "yyyy-MM");

      const [income, expense] = await Promise.all([
        Income.sum("amount", {
          where: {
            userId: req.user.id,
            date: { [Op.between]: [monthStart, monthEnd] },
          },
        }),
        Expense.sum("amount", {
          where: {
            userId: req.user.id,
            date: { [Op.between]: [monthStart, monthEnd] },
          },
        }),
      ]);

      const savings = (income || 0) - (expense || 0);
      totalSavings += savings;

      // Update or insert the record in SavingsProgress table for each month
      await SavingsProgress.upsert({
        userId: req.user.id,
        goalId: null, // Adjust this if needed
        month: label,
        totalIncome: income || 0,
        totalExpense: expense || 0,
        savings,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      savingsData.push({
        month: label,
        totalIncome: income || 0,
        totalExpense: expense || 0,
        savings,
      });
    }

    res.status(200).json({
      totalSavings,
      savingsProgress: savingsData.reverse(),
    });
  } catch (error) {
    console.error("Error in getPast12MonthsSavings:", error);
    res.status(400).json({ error: error.message });
  }
};