const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Expense  = require('../models/Expense');
const Income = require('../models/Income');
const Goal = require('../models/Goal');
const SavingsProgress = require('../models/SavingsProgress');

const getDashboardSummary = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        const userId = req.user.id;

        // Validate the page query parameter (optional)
        let { page = 1, pageSize = 5 } = req.query;
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(pageSize, 10);

        if (isNaN(parsedPage) || parsedPage <= 0) {
            return res.status(400).json({ error: "Invalid page number" });
        }

        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Invalid limit" });
        }

        const offset = (parsedPage - 1) * parsedLimit;

        // Get total income and expenses using aggregation
        const totalIncome = await Income.sum('amount', { where: { userId } });
        const totalExpenses = await Expense.sum('amount', { where: { userId } });

        // Calculate savings
        const savings = totalIncome - totalExpenses;

        // Calculate savings rate
        const savingsRate = totalIncome === 0 ? 0 : (savings / totalIncome) * 100;

        // Income vs expense ratio (handle division by 0)
        const incomeVsExpenseRatio = totalIncome && totalExpenses ? totalIncome / totalExpenses : 0;

        // Get the category distribution for expenses
        const categoryDistribution = await Expense.findAll({
            attributes: ['category', [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
            where: { userId },
            group: ['category'],
            raw: true,
        });

        // Fetch the latest incomes and expenses with pagination
        const { count: incomeCount, rows: recentIncomes } = await Income.findAndCountAll({
            where: { userId },
            offset,
            limit: parsedLimit,
            order: [['date', 'DESC']],
        });

        const { count: expenseCount, rows: recentExpenses } = await Expense.findAndCountAll({
            where: { userId },
            offset,
            limit: parsedLimit,
            order: [['date', 'DESC']],
        });

        // Get the financial goal and savings progress
        const goal = await Goal.findOne({ where: { userId } });
        const savingsProgress = await SavingsProgress.findOne({ where: { userId } });

        const savingsProgressPercentage = savingsProgress ? savingsProgress.progress : 0;

        // Return dashboard summary
        res.status(200).json({
            totalIncome,
            totalExpenses,
            savings,
            savingsRate,
            incomeVsExpenseRatio,
            recentIncomes,
            recentExpenses,
            categoryDistribution,
            goal: goal ? goal.target : 0, // Default to 0 if no goal
            savingsProgress: savingsProgressPercentage,
            pagination: {
                totalIncomes: incomeCount,
                totalExpenses: expenseCount,
                currentPage: parsedPage,
                pageSize: parsedLimit,
                totalPages: Math.ceil(Math.max(incomeCount, expenseCount) / parsedLimit),
            },
        });
    } catch (error) {
        console.error("Dashboard summary error:", error);
        res.status(500).json({ error: "Failed to load dashboard data" });
    }
};

module.exports = {
    getDashboardSummary,
};
