const express = require("express");
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Financial goals management
 */

/**
 * @swagger
 * /api/v1/goals:
 *   post:
 *     summary: Create a new financial goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - targetAmount
 *               - deadline
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/", authMiddleware, createGoal);

/**
 * @swagger
 * /api/v1/goals:
 *   get:
 *     summary: Get all financial goals for the user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user financial goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Failed to fetch goals
 */
router.get("/", authMiddleware, getGoals);

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   get:
 *     summary: Get a specific financial goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to retrieve
 *     responses:
 *       200:
 *         description: Goal details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Goal not found
 */
router.get("/:id", authMiddleware, getGoalById);

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   put:
 *     summary: Update a financial goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - targetAmount
 *               - deadline
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Goal not found
 */
router.put("/:id", authMiddleware, updateGoal);

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   delete:
 *     summary: Delete a financial goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to delete
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       404:
 *         description: Goal not found
 */
router.delete("/:id", authMiddleware, deleteGoal);

module.exports = router;
