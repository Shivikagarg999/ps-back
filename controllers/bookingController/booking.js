const Service = require("../../models/service/service");
const Cart = require("../../models/cart/cart");
const Booking = require("../../models/booking/booking");

// Create Booking from Cart
exports.createBooking = async (req, res) => {
  try {
    const { services, address, amount, paymentMethod, bookingDate, scheduledAt } = req.body;

    // Check required fields
    if (!services || !amount || !paymentMethod || !address || !scheduledAt) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const booking = new Booking({
      user: req.user._id, 
      services,  
      address,
      amount,
      paymentMethod,
      bookingDate: bookingDate || Date.now(), 
      scheduledAt,    
      status: "pending",
      paymentStatus: "pending",
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// User: Get all bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("services.service", "name price duration")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// User: Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Only allow cancel if booking is pending
    if (booking.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending bookings can be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled", data: booking });
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

// Pending Bookings
exports.getMyPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: "pending" })
      .populate("services.service", "name price duration")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Completed Bookings
exports.getMyCompletedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: "completed" })
      .populate("services.service", "name price duration")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancelled Bookings
exports.getMyCancelledBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: "cancelled" })
      .populate("services.service", "name price duration")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
