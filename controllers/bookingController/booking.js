const Service = require("../../models/service/service");
const Cart = require("../../models/cart/cart");
const Booking = require("../../models/booking/booking");

// Create Booking from Cart
exports.createBooking = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.service");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Prepare services array for booking
    const services = cart.items.map((item) => ({
      service: item.service._id,
      quantity: item.quantity,
      price: item.service.price,
      addons: item.addons || [],
    }));

    // Calculate total amount
    let totalAmount = 0;
    services.forEach((s) => {
      let addonsTotal = s.addons.reduce((sum, addon) => sum + addon.price, 0);
      totalAmount += s.price * s.quantity + addonsTotal;
    });

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      services,
      address,
      amount: totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      bookingDate: new Date(),
      status: "confirmed",
    });

    // Clear cart after booking
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get My Bookings (User)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service", "name price duration")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name phone email")
      .populate("service", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update Booking Status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.json({ success: true, message: "Booking updated", data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
