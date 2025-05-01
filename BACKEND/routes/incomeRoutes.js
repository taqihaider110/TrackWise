const express = require("express");
const {
  addIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  getIncomeCategories,
  getPast12MonthsIncome,
  getMonthlyIncomeSummary,
} = require("../controllers/incomeController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Income management operations
 */

/**
 * @swagger
 * /api/v1/incomes:
 *   post:
 *     summary: Add new income sources (single or multiple)
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               incomes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     source:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     date:
 *                       type: string
 *                       format: date
 *                     category:
 *                       type: string
 *             required:
 *               - incomes
 *     responses:
 *       201:
 *         description: Income sources added successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/", authMiddleware, addIncome);


/**
 * @swagger
 * /api/v1/incomes:
 *   get:
 *     summary: Get all income sources (filter by month and year, with pagination)
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: month
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Month to filter (1-12)"
 *       - name: year
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Year to filter (e.g., 2025)"
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Page number for pagination (default is 1)"
 *       - name: pageSize
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: "Number of records per page (default is 10)"
 *     responses:
 *       200:
 *         description: List of all income sources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 incomes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalIncome:
 *                   type: number
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get("/", authMiddleware, getIncomes);

/**
 * @swagger
 * /api/v1/incomes/categories:
 *   get:
 *     summary: Get income categories breakdown
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Income categories breakdown
 */
router.get("/categories", authMiddleware, getIncomeCategories);

/**
 * @swagger
 * /api/v1/incomes/past-12-months:
 *   get:
 *     summary: Get summarized income data for the past 12 months (including current month)
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly summaries of income for the past 12 months
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: Apr
 *                   year:
 *                     type: integer
 *                     example: 2025
 *                   totalAmount:
 *                     type: number
 *                     example: 5000
 *                   incomeCount:
 *                     type: integer
 *                     example: 10
 *                   sourceDistribution:
 *                     type: object
 *                     additionalProperties:
 *                       type: number
 *                     example:
 *                       Salary: 3000
 *                       Freelance: 2000
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/past-12-months", authMiddleware, getPast12MonthsIncome); // Add this line for the route

/**
 * @swagger
 * /api/v1/incomes/monthly-summary:
 *   get:
 *     summary: Get monthly income summary and category breakdown
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: month
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *         description: "Month to summarize (1-12)"
 *       - name: year
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: "Year to summarize (e.g., 2025)"
 *     responses:
 *       200:
 *         description: Monthly income summary and breakdown by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                   example: 5000
 *                 categoryBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Freelance
 *                       totalAmount:
 *                         type: number
 *                         example: 2000
 *       400:
 *         description: Invalid input or missing user ID
 *       500:
 *         description: Server error
 */
router.get("/monthly-summary", authMiddleware, getMonthlyIncomeSummary);


/**
 * @swagger
 * /api/v1/incomes/{id}:
 *   put:
 *     summary: Update an income source
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the income to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               source:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Income source updated successfully
 *       404:
 *         description: Income source not found
 */
router.put("/:id", authMiddleware, updateIncome);

/**
 * @swagger
 * /api/v1/incomes/{id}:
 *   delete:
 *     summary: Delete an income source
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the income to delete
 *     responses:
 *       200:
 *         description: Income source deleted successfully
 *       404:
 *         description: Income source not found
 */
router.delete("/:id", authMiddleware, deleteIncome);

module.exports = router;
