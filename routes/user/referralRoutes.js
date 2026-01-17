const express = require("express");
const { generateReferralCode, getReferralCode, applyReferral } = require("../../controllers/userController/referral");
const protect = require("../../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Referrals
 *   description: Referral code and rewards management
 */

/**
 * @swagger
 * /api/user/referral/generate:
 *   post:
 *     summary: Generate a unique referral code for the user
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral code generated
 */
router.post("/generate", protect, generateReferralCode);

/**
 * @swagger
 * /api/user/referral/my-code:
 *   get:
 *     summary: Get user's referral code and wallet balance
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's referral information
 */
router.get("/my-code", protect, getReferralCode);

/**
 * @swagger
 * /api/user/referral/apply:
 *   post:
 *     summary: Apply another user's referral code
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [referralCode]
 *             properties:
 *               referralCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Referral applied successfully
 */
router.post("/apply", protect, applyReferral);

module.exports = router;
