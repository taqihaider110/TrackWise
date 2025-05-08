const express = require("express");
const {
  registerProfile,
  getProfile,
  createBaseProfile,
  getBaseProfile,
  saveOrUpdateProfileAddress,
  getProfileAddress,
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
 * /api/v1/user/profile:
 *   post:
 *     summary: Create or update user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
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
 *               - firstname
 *               - lastname
 *               - dob
 *               - phone_no
 *     responses:
 *       200:
 *         description: Profile saved or updated
 *       400:
 *         description: Invalid request
 */
router.post("/user/profile", authMiddleware, registerProfile);


/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile with account info
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: Profile not found
 */
router.get("/user/profile", authMiddleware, getProfile);


/**
 * @swagger
 * /api/v1/profile/info-details:
 *   get:
 *     summary: Get profile information (with username and email)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Base profile retrieved
 *       404:
 *         description: Base profile not found
 */
router.get("/profile/info-details", authMiddleware, getBaseProfile);

/**
 * @swagger
 * /api/v1/profile/info-details:
 *   post:
 *     summary: Create the profile information (non-nullable fields)
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
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               phone_no:
 *                 type: string
 *             required:
 *               - firstname
 *               - lastname
 *               - dob
 *               - phone_no
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Base profile already exists and cannot be updated. This is a one-time operation.
 *       500:
 *         description: Internal server error
 */
router.post("/profile/info-details", authMiddleware, createBaseProfile);

/**
 * @swagger
 * /api/v1/profile/address:
 *   get:
 *     summary: Get user's address details (nullable)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address details retrieved
 *       404:
 *         description: Address details not found
 */
router.get("/profile/address", authMiddleware, getProfileAddress);

/**
 * @swagger
 * /api/v1/profile/address:
 *   put:
 *     summary: Update user's address details
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
 *         description: User's Address details updated
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.put("/profile/address", authMiddleware, saveOrUpdateProfileAddress);

module.exports = router;
