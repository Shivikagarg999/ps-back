const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/paymentController/paymentController");
const protect = require("../../middlewares/auth");

router.use(protect);


/**
 * @swagger
 * /api/payments/create-order:
 *   post:
 *     summary: Create a Razorpay order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in INR
 *               currency:
 *                 type: string
 *                 default: INR
 *               receipt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order created successfully
 *       500:
 *         description: Server error
 */
router.post("/create-order", paymentController.createOrder);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify Razorpay payment signature
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id, razorpay_payment_id, razorpay_signature]
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *               bookingId:
 *                 type: string
 *                 description: Optional booking ID to update status
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid signature
 *       500:
 *         description: Server error
 */
router.post("/verify", paymentController.verifyPayment);

module.exports = router;
