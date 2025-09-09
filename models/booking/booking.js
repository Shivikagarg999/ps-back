const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  address: {
    name: String,
    houseNo: String,
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String
  },
  beautician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beautician',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'wallet', 'cash'],
    default: 'cash'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Calculate total amount before saving
bookingSchema.pre('save', function(next) {
  if (this.isModified('services')) {
    this.totalAmount = this.services.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);