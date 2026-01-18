const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: [true, "Image is required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
