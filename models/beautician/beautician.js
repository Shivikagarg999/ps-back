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

    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{12}$/,
    },
    aadhaarImage: {
      type: String,
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
        date: String,
        slots: [String],
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

    age: { type: Number },
    joiningDate: { type: Date },
    alternatePhone: { type: String },
    bookingReferral: { type: String },
    skills: [{ type: String }],
    salary: { type: Number },

    panNumber: { type: String },
    panCardImage: { type: String }, 

    joiningLetter: { type: String }, 
    signedJoiningLetter: { type: String }, 

    signedOfferLetter: { type: String }, 

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
