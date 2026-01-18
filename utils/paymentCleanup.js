const cron = require('node-cron');
const Booking = require('../models/booking/booking');
const Notification = require('../models/notification/notification');

const initPaymentCleanup = () => {
    // Run every 1 minute
    cron.schedule('* * * * *', async () => {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

            // 1. Find bookings that are about to be deleted
            const expiredBookings = await Booking.find({
                paymentMethod: 'Online',
                paymentStatus: 'pending',
                createdAt: { $lt: fiveMinutesAgo }
            });

            if (expiredBookings.length > 0) {
                // 2. Create notifications for each user
                // The Notification model's post('save') hook will handle sending FCM push notifications automatically
                const notificationPromises = expiredBookings.map(booking =>
                    Notification.create({
                        user: booking.user,
                        title: "Payment Session Expired ⏱️",
                        message: "Your booking was cancelled because the payment was not completed within the 5-minute window. Please try booking again.",
                        type: "booking",
                        metadata: {
                            bookingId: booking._id
                        }
                    })
                );

                await Promise.all(notificationPromises);

                // 3. Delete the bookings
                const result = await Booking.deleteMany({
                    _id: { $in: expiredBookings.map(b => b._id) }
                });

                console.log(`[Payment Cleanup] Deleted ${result.deletedCount} unpaid online bookings and notified users.`);
            }
        } catch (error) {
            console.error('[Payment Cleanup] Error during cleanup:', error);
        }
    });
};

module.exports = initPaymentCleanup;
