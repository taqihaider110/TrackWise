const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Financial dashboard summary
 */

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get financial overview (income, expense, savings, savings rate, income vs expense ratio)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                   description: Total income of the user
 *                 totalExpenses:
 *                   type: number
 *                   description: Total expenses of the user
 *                 savings:
 *                   type: number
 *                   description: Total savings (income - expenses)
 *                 savingsRate:
 *                   type: number
 *                   description: The percentage of income saved
 *                 incomeVsExpenseRatio:
 *                   type: number
 *                   description: Ratio of total income to total expenses
 *                 recentIncomes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       source:
 *                         type: string
 *                         description: Source of income
 *                       amount:
 *                         type: number
 *                         description: Amount of income
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Date of income
 *                       category:
 *                         type: string
 *                         description: Category of income
 *                 recentExpenses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         description: Category of expense
 *                       amount:
 *                         type: number
 *                         description: Amount of expense
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Date of expense
 *                       description:
 *                         type: string
 *                         description: Description of expense
 *                 categoryDistribution:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   description: Expense distribution by category
 *                 goal:
 *                   type: number
 *                   description: User's financial goal (if set)
 *                 savingsProgress:
 *                   type: number
 *                   description: Progress towards financial goal in percentage
 *       400:
 *         description: Error while fetching dashboard summary
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getDashboardSummary);

module.exports = router;
