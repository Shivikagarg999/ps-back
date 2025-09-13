const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration'],
    min: [15, 'Minimum duration is 15 minutes']
  }, 
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  imageUrl: {
    type: String,
    required: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isIncluded: {
    type: [String], 
    validate: {
      validator: function(arr) {
        return arr.length <= 5;
      },
      message: "You can add maximum 5 points in isIncluded"
    },
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
