const express = require("express");
const router = express.Router();
const aimodelController = require("../controllers/aiModelController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Predictions
 *   description: AI-based prediction operations (expenses, goals, budgets, categorization)
 */

// Expense Forecasting
/**
 * @swagger
 * /api/v1/predictions/expenses:
 *   post:
 *     summary: Predicted future expenses
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: month
 *         in: query
 *         required: true
 *         description: The month for which you want predictions (e.g., "2025-03")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Predicted future expenses
 */
router.post("/expenses", authMiddleware, aimodelController.getExpensePrediction);

// Goal Achievement Prediction
/**
 * @swagger
 * /api/v1/predictions/goals:
 *   post:
 *     summary: Predict goal achievement likelihood
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prediction of goal achievement
 */
router.post("/goals", authMiddleware, aimodelController.getGoalPrediction);

// Budget Recommendation
/**
 * @swagger
 * /api/v1/predictions/budget:
 *   post:
 *     summary: AI-based budget recommendations
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Budget recommendation based on past expenses
 */
router.post("/budget", authMiddleware, aimodelController.getBudgetRecommendation);

// Expense Categorization
/**
 * @swagger
 * /api/v1/predictions/categorize:
 *   post:
 *     summary: Categorize a new expense using NLP
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Uber ride from airport"
 *     responses:
 *       200:
 *         description: Predicted expense category
 */
router.post("/categorize", authMiddleware, aimodelController.categorizeExpense);

module.exports = router;
