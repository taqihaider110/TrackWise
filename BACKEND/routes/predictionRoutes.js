const express = require("express");
const { getExpensePrediction } = require("../controllers/predictionController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Predictions
 *   description: Prediction operations for future expenses
 */

/**
 * @swagger
 * /api/v1/predictions:
 *   get:
 *     summary: Get predicted future expenses
 *     tags: [Predictions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: month
 *         in: query
 *         required: false
 *         description: The month for which you want predictions (e.g., "2025-03")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Predicted future expenses based on past trends
 *       400:
 *         description: Invalid request or no predictions available
 */
router.get("/", authMiddleware, getExpensePrediction);

module.exports = router;
