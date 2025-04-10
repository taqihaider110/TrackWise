// routes/landingRoutes.js
const express = require("express");
const router = express.Router();
const { getLandingInfo } = require("../controllers/landingController");

/**
 * @swagger
 * tags:
 *   name: General
 *   description: API Information and Landing Route
 */

/**
 * @swagger
 * /api/v1/landing:
 *   get:
 *     summary: Get information about the application and its features
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Basic landing route with project info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to AI-Driven Personal Finance Tracker!
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Track income and expenses", "AI-based budget planning", "Future expense predictions"]
 *                 about:
 *                   type: string
 *                   example: Built to help you manage and forecast your finances with smart insights.
 *                 contact:
 *                   type: string
 *                   format: email
 *                   example: support@aifinanceapp.com
 */
router.get("/", getLandingInfo);

module.exports = router;
