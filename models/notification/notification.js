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

module.exports = mongoose.model("Notification", notificationSchema);
