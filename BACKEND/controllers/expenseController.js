const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Expense = require("../models/Expense");
const moment = require("moment");

// Add multiple expenses
const addExpenses = async (req, res) => {
  try {
    const expenses = req.body.expense; // Expecting an array under 'expense' key

    // Validate that it's an array
    if (!Array.isArray(expenses)) {
      return res.status(400).json({ error: "Invalid data format. Expected an array of expenses." });
    }

    // Empty array check
    if (expenses.length === 0) {
      return res.status(400).json({ error: "Expense list cannot be empty." });
    }

    // Check for user authentication
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const errors = [];
    const validExpenses = [];

    for (let i = 0; i < expenses.length; i++) {
      const { amount, category, description, date } = expenses[i];

      if (!category || !category.trim()) {
        errors.push(`Entry ${i + 1}: 'category' is required.`);
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

      validExpenses.push({
        userId: req.user.id,
        amount,
        category: category.trim(),
        description: description?.trim() || "",
        date: parsedDate,
      });
    }

    // If all are invalid
    if (validExpenses.length === 0) {
      return res.status(400).json({ error: "All entries are invalid", details: errors });
    }

    const createdExpenses = await Expense.bulkCreate(validExpenses);

    res.status(201).json({
      message: `${createdExpenses.length} expense(s) added successfully.`,
      errors: errors.length ? errors : undefined,
      data: createdExpenses,
    });
  } catch (error) {
    console.error("Error adding expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get paginated expenses with filtering by month/year
const getExpenses = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ error: "User ID is missing" });
      }
  
      // Extract query parameters
      let { month, year, page = 1, pageSize = 10 } = req.query;
  
      // Parse page and limit
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(pageSize, 10);
  
      if (isNaN(parsedPage) || parsedPage <= 0) {
        return res.status(400).json({ error: "Invalid page number" });
      }
  
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ error: "Invalid page size" });
      }
  
      const offset = (parsedPage - 1) * parsedLimit;
  
      const whereClause = {
        userId: req.user.id,
      };
  
      // Apply month/year filter if both are provided
      if (month && year) {
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
  
        whereClause.date = {
          [Op.gte]: startDate,  // Greater than or equal to the first day of the month
          [Op.lt]: endDate,     // Less than the first day of the next month (end of current month)
        };
      }
  
      // Get paginated expenses and total count
      const { count, rows: expenses } = await Expense.findAndCountAll({
        where: whereClause,
        offset,
        limit: parsedLimit,
        order: [['date', 'DESC']],
      });
  
      // Get total amount (filtered or not)
      const totalAmount = await Expense.sum('amount', { where: whereClause });
  
      res.status(200).json({
        totalExpenses: count,
        totalAmount,
        expenses,
        pagination: {
          totalRecords: count,
          currentPage: parsedPage,
          pageSize: parsedLimit,
          totalPages: Math.ceil(count / parsedLimit),
        },
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: "Server error while fetching expenses" });
    }
};


const getPast12MonthsExpenses = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        const userId = req.user.id;

        // Set the end date to the last day of the current month
        const endDate = moment().endOf("month"); 
        // Set the start date to 11 months back from the start of the current month (total 12 months range)
        const startDate = moment().subtract(11, "months").startOf("month");

        // Query to get expenses in the last 12 months based on Date
        const expenses = await Expense.findAll({
            where: {
                userId,
                date: {
                    [Op.between]: [startDate.toDate(), endDate.toDate()],
                },
            },
            order: [["date", "DESC"]],
        });

        const summaryMap = {};

        expenses.forEach((expense) => {
            const m = moment(expense.date);
            const key = m.format("YYYY-MM");

            if (!summaryMap[key]) {
                summaryMap[key] = {
                    month: m.format("MMM"),
                    year: m.year(),
                    totalAmount: 0,
                    expenseCount: 0,
                };
            }

            summaryMap[key].totalAmount += expense.amount;
            summaryMap[key].expenseCount += 1;
        });

        // Sort the summary data by month and year
        const sortedSummary = Object.keys(summaryMap)
            .sort((a, b) => moment(b, "YYYY-MM") - moment(a, "YYYY-MM"))
            .map((key) => summaryMap[key]);

        res.status(200).json(sortedSummary);
    } catch (error) {
        console.error("Error generating expense summary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update an expense
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, description, date } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        // Basic field validations
        if (amount === undefined || amount === null || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ error: "Amount must be a positive number greater than 0" });
        }

        if (!category || typeof category !== "string" || category.trim() === "") {
            return res.status(400).json({ error: "Category is required and must be a non-empty string" });
        }

        if (!date || isNaN(Date.parse(date))) {
            return res.status(400).json({ error: "Date is required and must be a valid date" });
        }

        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            return res.status(400).json({ error: "Date cannot be in the future" });
        }

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        if (expense.userId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to update this expense" });
        }

        expense.amount = amount;
        expense.category = category;
        expense.description = description || "";
        expense.date = date;

        await expense.save();
        res.status(200).json(expense);
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        const expense = await Expense.findByPk(id);
        if (!expense || expense.userId !== req.user.id) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        await expense.destroy();
        res.status(200).json({ message: "Expense deleted" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get monthly summary and category breakdown
const getMonthlySummary = async (req, res) => {
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

        // Calculate total expenses for the selected month using Date
        const totalExpenses = await Expense.sum('amount', {
            where: {
                userId: req.user.id,
                date: {
                    [Op.gte]: startDate,  // means >= startDate
                    [Op.lt]: endDate,     // means < endDate
                },
            },
        });

        // Get breakdown by category using Date
        const categoryBreakdown = await Expense.findAll({
            attributes: ['category', [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']],
            where: {
                userId: req.user.id,
                date: {
                    [Op.gte]: startDate,  // means >= startDate
                    [Op.lt]: endDate,     // means < endDate
                },
            },
            group: ['category'],
            raw: true,
        });
        res.status(200).json({
            totalExpenses,
            categoryBreakdown,
        });
    } catch (error) {
        console.error("Error fetching monthly summary:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    addExpenses,
    getExpenses,
    updateExpense,
    deleteExpense,
    getMonthlySummary,
    getPast12MonthsExpenses,
};
