const mongoose = require("mongoose");

const adminBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: [true, "Booking ID is required"]
    },

    name: {
      type: String,
      default: ""
    },

    phoneNumber: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    type: {
      type: String,
      enum: ["commission", "fixed"],
      default: null
    },

    bookingDate: {
      type: String,  // Format: "04-01-26"
      default: ""
    },

    serviceDate: {
      type: String,  // Format: "04-01-26"
      default: ""
    },

    serviceTimeSlot: {
      type: String,  // Format: "2 pm - 4 pm"
      default: ""
    },

    services: {
      type: String,  // Description of services like "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…"
      default: ""
    },

    beautician: {
      type: String,  // Beautician name
      default: ""
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled", "In progress"],
      default: "Pending"
    },

    amount: {
      type: Number,  // Total booking amount
      default: 0,
      min: 0
    },

    beauticianPayout: {
      type: mongoose.Schema.Types.Mixed,  // Can be number or "N/A"
      default: null
    },

    companyAmount: {
      type: Number,  // Amount company earns
      default: 0,
      min: 0
    },

    paymentMode: {
      type: String,
      enum: ["UPI", "COD", "Cash", "Card", "Online"],
      default: null
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending"
    },

    remarks: {
      type: String,
      default: ""
    }
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
