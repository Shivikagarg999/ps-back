const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  getMyPendingBookings,
  getMyCompletedBookings,
  getMyCancelledBookings,
  cancelBooking
} = require("../../controllers/bookingController/booking");

const protect = require("../../middlewares/auth");

// ------------------- User Routes -------------------
router.post("/", protect, createBooking);

// Get all bookings for logged-in user
router.get("/my-bookings", protect, getMyBookings);

// Cancel booking by user
router.put("/cancel/:bookingId", protect, cancelBooking);


// New user-specific booking status routes
router.get("/pending", protect, getMyPendingBookings);
router.get("/completed", protect, getMyCompletedBookings);
router.get("/cancelled", protect, getMyCancelledBookings);

// ------------------- Admin Routes -------------------
router.get("/", protect, getAllBookings);
router.put("/:bookingId", protect, updateBookingStatus);

module.exports = router;
