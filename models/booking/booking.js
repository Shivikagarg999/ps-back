const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  beautician: {type: mongoose.Schema.Types.ObjectId, ref: "Beautician", required: true},
  services: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    price: Number,
  }],
  totalAmount: Number,
  bookingTime: Date,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending"
  },
  address: {
    street: String,
    city: String,
    pincode: String,
    landmark: String,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);