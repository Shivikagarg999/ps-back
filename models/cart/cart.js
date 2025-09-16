const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        addons: [
          {
            name: { type: String },
            price: { type: Number, min: 0 },
          },
        ],
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    grandTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);