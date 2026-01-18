const cron = require('node-cron');
const Booking = require('../models/booking/booking');

const initPaymentCleanup = () => {
    // Run every 1 minute
    cron.schedule('* * * * *', async () => {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            // Find bookings that:
            // 1. Were created more than 5 minutes ago
            // 2. Are for online payment
            // 3. Are still in 'pending' payment status
            const result = await Booking.deleteMany({
                paymentMethod: 'Online',
                paymentStatus: 'pending',
                createdAt: { $lt: fiveMinutesAgo }
            });

            if (result.deletedCount > 0) {
                console.log(`[Payment Cleanup] Deleted ${result.deletedCount} unpaid online bookings.`);
            }
        } catch (error) {
            console.error('[Payment Cleanup] Error during cleanup:', error);
        }
    });
};

module.exports = initPaymentCleanup;
