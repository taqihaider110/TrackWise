const express = require("express");
const {
  getAllSavingsForUser,
  getMonthlySavingProgress,
  getPast12MonthsSavings,
} = require("../controllers/savingsProgressController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Savings Progress
 *   description: Savings progress tracking
 */

/**
 * @swagger
 * /api/v1/savings-progress:
 *   get:
 *     summary: Get paginated savings records for a user by month
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Number of records per page
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *           format: yyyy-MM
 *         description: Month in yyyy-MM format (e.g., 2025-05)
 *     responses:
 *       200:
 *         description: Paginated savings records
 *       400:
 *         description: Invalid input or request
 */
router.get("/", authMiddleware, getAllSavingsForUser);

/**
 * @swagger
 * /api/v1/savings-progress/monthly:
 *   get:
 *     summary: Get net savings (income - expense) for a given month and update record
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *           format: yyyy-MM
 *         description: Month in yyyy-MM format (e.g., 2025-05)
 *     responses:
 *       200:
 *         description: Net savings for the specified month
 *       400:
 *         description: Invalid input or request
 */
router.get("/monthly", authMiddleware, getMonthlySavingProgress);

/**
 * @swagger
 * /api/v1/savings-progress/past-12-months:
 *   get:
 *     summary: Get savings progress for the past 12 months and update history
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of savings progress for each month in the past year
 *       400:
 *         description: Failed to fetch data
 */
router.get("/past-12-months", authMiddleware, getPast12MonthsSavings);

module.exports = router;
