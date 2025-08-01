const mongoose = require("mongoose");

const beauticianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    availability: [
      {
        date: String, // e.g., "2025-08-01"
        slots: [String], // e.g., ["10:00", "11:30", "14:00"]
      },
    ],
    address: {
      city: String,
      pincode: String,
      localArea: String,
    },
    profilePic: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beautician", beauticianSchema);
