const express = require('express');
const router = express.Router();
const otpController = require('../../controllers/userController/otp');

/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: One-Time Password management for user authentication
 */

/**
 * @swagger
 * /api/otp/check-phone/{phone}:
 *   get:
 *     summary: Check if a phone number exists and send OTP (if applicable)
 *     tags: [OTP]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status check complete
 */
router.get('/check-phone/:phone', otpController.checkPhone);

/**
 * @swagger
 * /api/otp/reset-password:
 *   post:
 *     summary: Verify OTP and reset password
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, otp, newPassword]
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or bad request
 */
router.post('/reset-password', otpController.verifyAndResetPassword);

module.exports = router;