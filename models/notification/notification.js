const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["booking", "offer", "reminder", "feedback", "announcement"],
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        metadata: {
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
            },
            offerId: {
                type: String, // Or ObjectId if you have an Offer model
            },
        },
    },
    { timestamps: true }
);

notificationSchema.post("save", async function (doc) {
    try {
        const { sendPushNotification } = require("../../utils/notificationSender");

        // Prepare data for push notification
        const pushData = {
            title: doc.title,
            body: doc.message,
            data: {
                type: doc.type,
                notificationId: doc._id.toString(),
                ...(doc.metadata?.bookingId && { bookingId: doc.metadata.bookingId.toString() }),
                ...(doc.metadata?.serviceId && { serviceId: doc.metadata.serviceId.toString() }),
            },
        };

        await sendPushNotification(doc.user, pushData);
    } catch (error) {
        console.error("Error in notification post-save middleware:", error);
    }
});

module.exports = mongoose.model("Notification", notificationSchema);
