const express = require("express");
const {
  createSavingsProgress,
  getSavingsProgress,
  getSavingsProgressById,
  updateSavingsProgress,
  deleteSavingsProgress,
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
 *   post:
 *     summary: Create a new savings progress
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goalId:
 *                 type: integer
 *               amountSaved:
 *                 type: number
 *               progressDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *             required:
 *               - goalId
 *               - amountSaved
 *               - progressDate
 *     responses:
 *       201:
 *         description: Savings progress created successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/", authMiddleware, createSavingsProgress);

/**
 * @swagger
 * /api/v1/savings-progress:
 *   get:
 *     summary: Get all savings progress for the user
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user savings progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Failed to fetch savings progress
 */
router.get("/", authMiddleware, getSavingsProgress);

/**
 * @swagger
 * /api/v1/savings-progress/{id}:
 *   get:
 *     summary: Get a specific savings progress by ID
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the savings progress to retrieve
 *     responses:
 *       200:
 *         description: Savings progress details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Savings progress not found
 */
router.get("/:id", authMiddleware, getSavingsProgressById);

/**
 * @swagger
 * /api/v1/savings-progress/{id}:
 *   put:
 *     summary: Update a savings progress by ID
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the savings progress to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goalId:
 *                 type: integer
 *               amountSaved:
 *                 type: number
 *               progressDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Savings progress updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Savings progress not found
 */
router.put("/:id", authMiddleware, updateSavingsProgress);

/**
 * @swagger
 * /api/v1/savings-progress/{id}:
 *   delete:
 *     summary: Delete a savings progress by ID
 *     tags: [Savings Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the savings progress to delete
 *     responses:
 *       200:
 *         description: Savings progress deleted successfully
 *       404:
 *         description: Savings progress not found
 */
router.delete("/:id", authMiddleware, deleteSavingsProgress);

module.exports = router;