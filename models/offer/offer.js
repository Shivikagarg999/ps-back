const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
    {
        tagline: {
            type: String,
            required: [true, "Please add a tagline"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
        },
        imageUrl: {
            type: String,
            default: null,
        },
        startDate: {
            type: Date,
            required: [true, "Please add a start date"],
        },
        endDate: {
            type: Date,
            required: [true, "Please add an end date"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        discountPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
