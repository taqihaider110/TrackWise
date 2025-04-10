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
 *     summary: Get financial overview (income, expense, savings)
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
 *                 totalExpenses:
 *                   type: number
 *                 savings:
 *                   type: number
 *       400:
 *         description: Error while fetching dashboard summary
 */
router.get("/", authMiddleware, getDashboardSummary);

module.exports = router;
