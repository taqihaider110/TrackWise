const Income = require("../models/Income");
const { Op } = require("sequelize");
const { sequelize } = require("../config/db"); // Import sequelize from the config
const moment = require("moment");

// Add Income (Handle multiple incomes)
exports.addIncome = async (req, res) => {
  try {
    const { incomes } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const userId = req.user.id;

    // Bulk Add
    if (Array.isArray(incomes)) {
      if (incomes.length === 0) {
        return res.status(400).json({ error: "Income list cannot be empty." });
      }

      const errors = [];
      const validIncomes = [];

      for (let i = 0; i < incomes.length; i++) {
        const income = incomes[i];
        const { source, amount, date, category } = income;

        if (!source || !source.trim() || !category || !category.trim()) {
          errors.push(`Entry ${i + 1}: 'source' and 'category' are required.`);
          continue;
        }

        if (!amount || amount <= 0) {
          errors.push(`Entry ${i + 1}: 'amount' must be greater than 0.`);
          continue;
        }

        if (!date || isNaN(new Date(date))) {
          errors.push(`Entry ${i + 1}: 'date' must be a valid date.`);
          continue;
        }

        const parsedDate = new Date(date);
        const today = new Date();
        if (parsedDate > today) {
          errors.push(`Entry ${i + 1}: 'date' cannot be in the future.`);
          continue;
        }

        validIncomes.push({
          source: source.trim(),
          amount,
          date: parsedDate,
          category: category.trim(),
          userId,
        });
      }

      if (validIncomes.length === 0) {
        return res.status(400).json({ error: "All entries are invalid", details: errors });
      }

      const newIncomes = await Income.bulkCreate(validIncomes);
      return res.status(201).json({
        message: `${newIncomes.length} income(s) added successfully.`,
        errors: errors.length ? errors : undefined,
        data: newIncomes,
      });
    }

    // Single Add
    const { source, amount, date, category } = req.body;

    if (!source || !source.trim() || !category || !category.trim()) {
      return res.status(400).json({ error: "'source' and 'category' are required." });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "'amount' must be greater than 0." });
    }

    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ error: "'date' must be a valid date." });
    }

    const parsedDate = new Date(date);
    const today = new Date();
    if (parsedDate > today) {
      return res.status(400).json({ error: "'date' cannot be in the future." });
    }

    const newIncome = await Income.create({
      source: source.trim(),
      amount,
      date: parsedDate,
      category: category.trim(),
      userId,
    });

    res.status(201).json(newIncome);
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(400).json({ error: error.message });
  }
};


// Get all Incomes (with filtering by month + pagination)
exports.getIncomes = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    let { month, year, page = 1, pageSize = 10 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    if (isNaN(parsedPage) || parsedPage <= 0) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    if (isNaN(parsedPageSize) || parsedPageSize <= 0) {
      return res.status(400).json({ error: "Invalid page size" });
    }

    const offset = (parsedPage - 1) * parsedPageSize;

    const whereClause = { userId: req.user.id };

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      whereClause.date = {
        [Op.gte]: startDate, // Greater than or equal to the first day of the month
        [Op.lt]: endDate, // Less than the first day of the next month (end of current month)
      };
    }

    const { count, rows: incomes } = await Income.findAndCountAll({
      where: whereClause,
      offset,
      limit: parsedPageSize,
      order: [["date", "DESC"]],
    });

    const totalAmount = await Income.sum("amount", { where: whereClause });

    res.status(200).json({
      totalIncomes: count,
      totalAmount,
      incomes,
      pagination: {
        totalRecords: count,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalPages: Math.ceil(count / parsedPageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ error: "Server error while fetching incomes" });
  }
};

// Update Income
exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { source, amount, date, category } = req.body;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Validation
    if (!source || !source.trim()) {
      return res.status(400).json({ error: "'source' is required and cannot be empty." });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ error: "'category' is required and cannot be empty." });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "'amount' must be greater than 0." });
    }

    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ error: "'date' must be a valid date." });
    }

    const parsedDate = new Date(date);
    const today = new Date();
    if (parsedDate > today) {
      return res.status(400).json({ error: "'date' cannot be in the future." });
    }

    // Find and authorize income
    const income = await Income.findByPk(id);
    if (!income || income.userId !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Income source not found or unauthorized" });
    }

    // Update the income
    income.source = source.trim();
    income.amount = amount;
    income.date = parsedDate;
    income.category = category.trim();

    await income.save();
    res.status(200).json(income);
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(400).json({ error: error.message });
  }
};


// Delete Income
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const income = await Income.findByPk(id);
    if (!income || income.userId !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Income source not found or unauthorized" });
    }

    await income.destroy();
    res.status(200).json({ message: "Income source deleted" });
  } catch (error) {
    console.error("Error deleting income:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get income categories and breakdown
exports.getIncomeCategories = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const categories = await Income.findAll({
      attributes: [
        "category",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      where: { userId: req.user.id },
      group: ["category"],
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching income categories:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get monthly income summary and category breakdown
exports.getMonthlyIncomeSummary = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and Year are required" });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    // Total income for the month
    const totalIncome = await Income.sum("amount", {
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: startDate, // means >= startDate
          [Op.lt]: endDate, // means < endDate
        },
      },
    });

    // Breakdown by category
    const categoryBreakdown = await Income.findAll({
      attributes: [
        "category",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: startDate, // means >= startDate
          [Op.lt]: endDate, // means < endDate
        },
      },
      group: ["category"],
      order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
      raw: true,
    });

    res.status(200).json({
      totalIncome,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Error fetching monthly income summary:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//12 months income summary
exports.getPast12MonthsIncome = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const userId = req.user.id;
    // Set the end date to the last day of the current month
    const endDate = moment().endOf("month");
    // Set the start date to 11 months back from the start of the current month (total 12 months range)
    const startDate = moment().subtract(11, "months").startOf("month");

    const incomes = await Income.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate.toDate(), endDate.toDate()],
        },
      },
      order: [["date", "DESC"]],
    });

    const summaryMap = {};

    incomes.forEach((income) => {
      const m = moment(income.date);
      const key = m.format("YYYY-MM");

      if (!summaryMap[key]) {
        summaryMap[key] = {
          month: m.format("MMM"),
          year: m.year(),
          totalAmount: 0,
          incomeCount: 0,
        };
      }

      summaryMap[key].totalAmount += income.amount;
      summaryMap[key].incomeCount += 1;
    });

    const sortedSummary = Object.keys(summaryMap)
      .sort((a, b) => moment(b, "YYYY-MM") - moment(a, "YYYY-MM"))
      .map((key) => summaryMap[key]);

    res.status(200).json(sortedSummary);
  } catch (error) {
    console.error("Error fetching past 12 months' income summary:", error);
    res.status(500).json({ error: error.message });
  }
};
