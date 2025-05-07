const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Expense = require("../models/Expense");
const moment = require("moment");

// Add multiple expenses
const addExpenses = async (req, res) => {
    try {
        const expenses = req.body.expense;  // Expecting the array to be under the 'expense' key

        if (!Array.isArray(expenses)) {
            return res.status(400).json({ error: "Invalid data format. Expected an array of expenses." });
        }

        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        // Map over the expenses array and create each expense in the database
        const createdExpenses = await Expense.bulkCreate(
            expenses.map(expense => ({
                userId: req.user.id,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: expense.date,
            }))
        );

        res.status(201).json(createdExpenses);
    } catch (error) {
        console.error("Error adding expenses:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getExpenses = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
        }

        // Get query parameters and provide defaults
        let { month, year, page = 1, pageSize = 10 } = req.query;

        // Ensure page and pageSize are integers
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(pageSize, 10);

        // Check for invalid parsed page or limit
        if (isNaN(parsedPage) || parsedPage <= 0) {
            return res.status(400).json({ error: "Invalid page number" });
        }
        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Invalid limit" });
        }

        const offset = (parsedPage - 1) * parsedLimit;

        const whereClause = {
            userId: req.user.id,
        };

        let totalExpenses = 0;
        let totalAmount = 0;

        // Filter by month and year if provided
        if (month && year) {
            const startDate = new Date(`${year}-${month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);

            whereClause.createdAt = {
                [Op.between]: [startDate, endDate], // Use createdAt to filter the month/year range
            };

            // Fetch expenses and calculate the total sum for the month
            const { count, rows: expenses } = await Expense.findAndCountAll({
                where: whereClause,
                offset,
                limit: parsedLimit,
                order: [['createdAt', 'DESC']],
            });

            // Calculate the total amount for the filtered month
            totalAmount = await Expense.sum('amount', { where: whereClause });

            // Return the paginated response with filtered total expenses and sum
            res.status(200).json({
                totalExpenses: count, // Count of filtered expenses (month/year)
                totalAmount: totalAmount, // Total amount for the filtered month
                expenses,
                pagination: {
                    totalRecords: count,
                    currentPage: parsedPage,
                    pageSize: parsedLimit,
                    totalPages: Math.ceil(count / parsedLimit),
                },
            });

        } else {
            // No month/year filter provided - Fetch all expenses and return total count
            const { count, rows: expenses } = await Expense.findAndCountAll({
                where: whereClause,
                offset,
                limit: parsedLimit,
                order: [['createdAt', 'DESC']],
            });

            // Calculate total sum of all expenses (no month/year filter)
            totalAmount = await Expense.sum('amount', { where: whereClause });

            // Return the paginated response with the total sum of all expenses
            res.status(200).json({
                totalExpenses: count, // Total count of all expenses
                totalAmount: totalAmount, // Total sum of all expenses
                expenses,
                pagination: {
                    totalRecords: count,
                    currentPage: parsedPage,
                    pageSize: parsedLimit,
                    totalPages: Math.ceil(count / parsedLimit),
                },
            });
        }

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

        // Query to get expenses in the last 12 months based on createdAt
        const expenses = await Expense.findAll({
            where: {
                userId,
                createdAt: {
                    [Op.between]: [startDate.toDate(), endDate.toDate()],  // Filtering using createdAt
                },
            },
            order: [["createdAt", "DESC"]],  // Sort by createdAt instead of date
        });

        const summaryMap = {};

        expenses.forEach((expense) => {
            const m = moment(expense.createdAt);  // Use createdAt instead of date
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

        const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        if (expense.userId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to update this expense" });
        }

        expense.amount = amount;
        expense.category = category;
        expense.description = description;
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

        // Calculate total expenses for the selected month using createdAt
        const totalExpenses = await Expense.sum('amount', {
            where: {
                userId: req.user.id,
                createdAt: {
                    [Op.gte]: startDate,  // means >= startDate
                    [Op.lt]: endDate,     // means < endDate
                },
            },
        });

        // Get breakdown by category using createdAt
        const categoryBreakdown = await Expense.findAll({
            attributes: ['category', [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']],
            where: {
                userId: req.user.id,
                createdAt: {
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
