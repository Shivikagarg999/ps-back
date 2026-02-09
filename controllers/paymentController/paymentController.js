const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../../models/booking/booking");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay Order
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: amount * 100,
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay Create Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to create Razorpay order", error: error.message });
    }
};

/**
 * Verify Payment Signature
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            if (bookingId) {
                await Booking.findByIdAndUpdate(bookingId, {
                    paymentStatus: "paid",
                    paymentMethod: "Online",
                });
            }

            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature, payment verification failed",
            });
        }
    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).json({ success: false, message: "Payment verification error", error: error.message });
    }
};

/**
 * Get All Transactions
 */
exports.getAllTransactions = async (req, res) => {
    try {
        const { count = 100, skip = 0 } = req.query;

        const payments = await razorpay.payments.all({
            count: parseInt(count),
            skip: parseInt(skip),
        });

        res.status(200).json({
            success: true,
            count: payments.count,
            items: payments.items
        });
    } catch (error) {
        console.error("Razorpay Fetch Transactions Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch transactions", error: error.message });
    }
};
