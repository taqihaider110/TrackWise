const express = require("express");
const { saveProfile, getProfile } = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile operations
 */

/**
 * @swagger
 * /api/v1/profile:
 *   post:
 *     summary: Create or update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               initialIncome:
 *                 type: number
 *               initialExpense:
 *                 type: number
 *             required:
 *               - name
 *               - gender
 *               - dob
 *               - initialIncome
 *               - initialExpense
 *     responses:
 *       200:
 *         description: Profile saved or updated
 *       400:
 *         description: Invalid request
 */
router.post("/", authMiddleware, saveProfile);

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: Profile not found
 */
router.get("/", authMiddleware, getProfile);

module.exports = router;
