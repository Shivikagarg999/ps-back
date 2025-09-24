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
      match: /^[6-9]\d{9}$/, // Indian phone number validation
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Aadhaar details
    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{12}$/, // 12-digit Aadhaar
    },
    aadhaarImage: {
      type: String, // URL of uploaded Aadhaar card
    },

    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    id: {
      type: String,
    },

    availability: [
      {
        date: String, // YYYY-MM-DD
        slots: [String], // e.g. ["10:00-11:00", "11:00-12:00"]
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

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beautician", beauticianSchema);
