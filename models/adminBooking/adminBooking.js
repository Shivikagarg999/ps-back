const mongoose = require("mongoose");

const adminBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },

    customerName: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    fullAddress: {
      type: String,
      default: "",
    },

    bookingType: {
      type: String,
      enum: ["commission", "fixed"],
      default: null,
    },

    bookingDate: {
      type: Date,
      default: null,
    },

    serviceDate: {
      type: Date,
      default: null,
    },

    serviceTimeSlot: {
      type: String,
      default: "",
    },

    servicesBooked: {
      type: String,
      default: "",
    },

    assignedBeauticianName: {
      type: String,
      default: "",
    },

    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled", "In progress"],
      default: "Pending",
    },

    beauticianPayout: {
      type: Number,
      default: null,
    },

    serviceAmount: {
      type: Number,
      default: null,
      min: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: null,
      min: 0,
    },

    paymentMode: {
      type: String,
      enum: ["UPI", "COD", "Cash", "Card", "Online"],
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending",
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

adminBookingSchema.pre("save", async function (next) {
  if (this.isNew && !this.bookingId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("AdminBooking").countDocuments();
    const serial = String(count + 1).padStart(4, "0");
    this.bookingId = `PS-${year}-${serial}`;
  }
  next();
});

module.exports = mongoose.model("AdminBooking", adminBookingSchema);
