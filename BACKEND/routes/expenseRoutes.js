const express = require("express");
const {
  addExpenses,
  getExpenses,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
} = require("../controllers/expenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management operations
 */

/**
 * @swagger
 * /api/v1/expenses:
 *   post:
 *     summary: Add multiple new expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 date:
 *                   type: string
 *                   format: date
 *                 description:
 *                   type: string
 *             required:
 *               - category
 *               - amount
 *               - date
 *     responses:
 *       201:
 *         description: Expenses added successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/", authMiddleware, addExpenses);

/**
 * @swagger
 * /api/v1/expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: month
 *         in: query
 *         required: false
 *         description: "The month to filter expenses by (format: MM)"
 *       - name: year
 *         in: query
 *         required: false
 *         description: "The year to filter by (e.g., 2025)"
 *     responses:
 *       200:
 *         description: List of all expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expenses:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalExpenses:
 *                   type: number
 */
router.get("/", authMiddleware, getExpenses);

/**
 * @swagger
 * /api/v1/expenses/monthly-summary:
 *   get:
 *     summary: Get monthly summary of expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: month
 *         in: query
 *         required: true
 *         description: "The month to filter by (format: MM)"
 *       - name: year
 *         in: query
 *         required: true
 *         description: "The year to filter by (e.g., 2025)"
 *     responses:
 *       200:
 *         description: Monthly summary with total and breakdown by category
 */
router.get("/monthly-summary", authMiddleware, getMonthlySummary);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the expense to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       404:
 *         description: Expense not found
 */
router.put("/:id", authMiddleware, updateExpense);

/**
 * @swagger
 * /api/v1/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the expense to delete
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
