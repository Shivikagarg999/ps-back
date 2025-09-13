const Service = require("../../models/service/service");
const Booking = require("../../models/booking/booking");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, address, paymentMethod, bookingDate } = req.body;

    if (!bookingDate) {
      return res.status(400).json({ success: false, message: "Booking date is required" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      service: service._id,
      address,
      amount: service.price,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      status: "confirmed",
      bookingDate,
    });

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
