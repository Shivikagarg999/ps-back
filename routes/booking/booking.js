const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require("../../controllers/bookingController/booking");

const protect = require("../../middlewares/auth");

// User routes
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

// Admin routes
router.get("/", protect, getAllBookings);
router.put("/:bookingId", protect, updateBookingStatus);

module.exports = router;
