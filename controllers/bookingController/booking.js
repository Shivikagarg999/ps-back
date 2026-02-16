const Service = require("../../models/service/service");
const Cart = require("../../models/cart/cart");
const Booking = require("../../models/booking/booking");
const Notification = require("../../models/notification/notification");

exports.createBooking = async (req, res) => {
  try {
    const { services, address, amount, totalGst, paymentMethod, bookingDate, scheduledAt, phoneNumber } = req.body;

    if (!services || !amount || !paymentMethod || !address || !scheduledAt || !phoneNumber) {
      return res.status(400).json({ msg: "All fields are required including phone number" });
    }

    const booking = new Booking({
      user: req.user._id,
      services,
      address,
      phoneNumber,
      amount, // This should be total (Base + GST)
      totalGst: totalGst || 0,
      paymentMethod,
      bookingDate: bookingDate || Date.now(),
      scheduledAt,
      status: "pending",
      paymentStatus: "pending",
    });

    await booking.save();

    // Clear the user's cart after successful booking
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], grandTotal: 0 } }
    );

    // Trigger Notification
    const readableDate = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }).format(new Date(scheduledAt));

    await Notification.create({
      user: req.user._id,
      title: "Booking Confirmed! 🎉",
      message: `Your booking for ${readableDate} has been placed successfully.`,
      type: "booking",
      metadata: { bookingId: booking._id }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ msg: "Server error" });
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

    // Trigger Notification
    await Notification.create({
      user: req.user._id,
      title: "Booking Cancelled",
      message: `You have successfully cancelled your booking.`,
      type: "booking",
      metadata: { bookingId: booking._id }
    });

    res.json({ success: true, message: "Booking cancelled", data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//GET ALL
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("services.service", "name price duration gstAmount")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error("🔥 Error in getAllBookings:", err);
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

    // Trigger Notification for User
    await Notification.create({
      user: booking.user,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking status has been updated to: ${status}.`,
      type: "booking",
      metadata: { bookingId: booking._id }
    });

    res.json({ success: true, message: "Booking updated", data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Service
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if service exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "booking not found" });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ success: true, message: "booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Pending Bookings
exports.getMyPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: "pending" })
      .populate("services.service", "name price duration gstAmount")
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
      .populate("services.service", "name price duration gstAmount")
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
      .populate("services.service", "name price duration gstAmount")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// User: Get all bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("services.service", "name price duration gstAmount")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};