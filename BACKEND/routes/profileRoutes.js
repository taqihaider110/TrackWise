const express = require("express");
const {
  saveProfile,
  getProfile,
  createBaseProfile,
  saveOrUpdateOptionalProfileDetails,
  getBaseProfileFields,
  getOptionalProfileFields,
} = require("../controllers/profileController");
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
 *               full_name:
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
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               full_address:
 *                 type: string
 *             required:
 *               - full_name
 *               - gender
 *               - dob
 *               - initialIncome
 *               - initialExpense
 *               - firstname
 *               - lastname
 *     responses:
 *       200:
 *         description: Profile saved or updated
 *       400:
 *         description: Invalid request
 */
router.post("/profile", authMiddleware, saveProfile);

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
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 full_name:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *                 initialIncome:
 *                   type: number
 *                 initialExpense:
 *                   type: number
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 phone_no:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 full_address:
 *                   type: string
 *       404:
 *         description: Profile not found
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /api/v1/profile/base:
 *   get:
 *     summary: Get base profile fields (non-nullable)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Base profile retrieved
 *       404:
 *         description: Base profile not found
 */
router.get("/base", authMiddleware, getBaseProfileFields);

/**
 * @swagger
 * /api/v1/profile/details:
 *   get:
 *     summary: Get optional profile fields (nullable)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Optional profile details retrieved
 *       404:
 *         description: Optional profile not found
 */
router.get("/details", authMiddleware, getOptionalProfileFields);

/**
 * @swagger
 * /api/v1/profile/createBase:
 *   post:
 *     summary: Create the base profile fields (non-nullable)
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
 *               full_name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 example: Male
 *               dob:
 *                 type: string
 *                 format: date
 *               initialIncome:
 *                 type: number
 *               initialExpense:
 *                 type: number
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phone_no:
 *                 type: string
 *             required:
 *               - full_name
 *               - gender
 *               - dob
 *               - initialIncome
 *               - initialExpense
 *               - firstname
 *               - lastname
 *               - phone_no
 *           example:
 *             full_name: "Taqi Haider"
 *             gender: "Male"
 *             dob: "1992-05-08"
 *             initialIncome: 50000
 *             initialExpense: 20000
 *             firstname: "Taqi"
 *             lastname: "Haider"
 *             phone_no: "+923001234567"
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Base profile already exists and cannot be updated. This is a one-time operation.
 *       500:
 *         description: Internal server error
 */
router.post("/createBase", authMiddleware, createBaseProfile);


/**
 * @swagger
 * /api/v1/profile/details:
 *   put:
 *     summary: Update optional profile fields (nullable)
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
 *               phone_no:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               full_address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Optional profile updated
 */
router.put("/details", authMiddleware, saveOrUpdateOptionalProfileDetails);

module.exports = router;
