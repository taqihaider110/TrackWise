const Income = require("../models/Income");
const { Op } = require("sequelize");
const { sequelize } = require("../config/db"); // Import sequelize from the config

// Add Income (Handle multiple incomes)
exports.addIncome = async (req, res) => {
  try {
    const { incomes } = req.body; // Expecting an array of income objects

    // Ensure the userId is available from the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // If incomes is an array, add all the incomes
    if (Array.isArray(incomes)) {
      const newIncomes = await Income.bulkCreate(
        incomes.map(income => ({
          ...income,
          userId: req.user.id, // Ensure the userId is correctly set for each income
        }))
      );

      return res.status(201).json(newIncomes);
    }

    // If the input is a single income, add it normally
    const { source, amount, date, category } = req.body;

    const newIncome = await Income.create({
      source,
      amount,
      date,
      category,
      userId: req.user.id, // Ensure the userId is correctly set
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
    const { month, year, page = 1, pageSize = 10 } = req.query;

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const where = { userId: req.user.id };

    if (month && year) {
      where.date = {
        [Op.between]: [
          new Date(year, month - 1, 1),
          new Date(year, month, 0),
        ],
      };
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);
    const offset = (parsedPage - 1) * parsedPageSize;

    // Fetch paginated incomes
    const incomes = await Income.findAll({
      where,
      limit: parsedPageSize,
      offset,
      order: [['date', 'DESC']],
    });

    // Get total income amount
    const totalIncome = await Income.sum('amount', { where });

    // Get total count for pagination metadata
    const totalCount = await Income.count({ where });

    res.status(200).json({
      incomes,
      totalIncome,
      pagination: {
        totalRecords: totalCount,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalPages: Math.ceil(totalCount / parsedPageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(400).json({ error: error.message });
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

    const income = await Income.findByPk(id);
    if (!income || income.userId !== req.user.id) {
      return res.status(404).json({ error: "Income source not found or unauthorized" });
    }

    // Update the income
    income.source = source;
    income.amount = amount;
    income.date = date;
    income.category = category;

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
      return res.status(404).json({ error: "Income source not found or unauthorized" });
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
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: { userId: req.user.id },
      group: ['category'],
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching income categories:", error);
    res.status(400).json({ error: error.message });
  }
};
