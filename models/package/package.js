const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a package name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    }
  ],
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  gstAmount: {
    type: Number,
    default: 0,
    min: [0, 'GST amount cannot be negative']
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  imageUrl: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
