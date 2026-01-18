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
  cancelBooking,
  deleteBooking
} = require("../../controllers/bookingController/booking");

const protect = require("../../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management APIs
 */

/**
 * @swagger
 * /api/user/booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [services, address, amount, paymentMethod, scheduledAt, phoneNumber]
 *             properties:
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     service:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     gstAmount:
 *                       type: number
 *               address:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   houseNo:
 *                     type: string
 *                   street:
 *                     type: string
 *                   landmark:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *               amount:
 *                 type: number
 *                 description: Total amount to pay (Base Price + GST)
 *               totalGst:
 *                 type: number
 *                 description: Sum of GST for all services
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, Online]
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post("/", protect, createBooking);

/**
 * @swagger
 * /api/user/booking/my-bookings:
 *   get:
 *     summary: Get all bookings for logged-in user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookings
 */
router.get("/my-bookings", protect, getMyBookings);

/**
 * @swagger
 * /api/user/booking/cancel/{bookingId}:
 *   put:
 *     summary: Cancel booking by user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.put("/cancel/:bookingId", protect, cancelBooking);

/**
 * @swagger
 * /api/user/booking/pending:
 *   get:
 *     summary: Get user pending bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending bookings
 */
router.get("/pending", protect, getMyPendingBookings);

/**
 * @swagger
 * /api/user/booking/completed:
 *   get:
 *     summary: Get user completed bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed bookings
 */
router.get("/completed", protect, getMyCompletedBookings);

/**
 * @swagger
 * /api/user/booking/cancelled:
 *   get:
 *     summary: Get user cancelled bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cancelled bookings
 */
router.get("/cancelled", protect, getMyCancelledBookings);

/**
 * @swagger
 * /api/user/booking/getbookings:
 *   get:
 *     summary: Get all bookings (Admin)
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 */
router.get("/getbookings", getAllBookings);

/**
 * @swagger
 * /api/user/booking/{bookingId}:
 *   put:
 *     summary: Update booking status (Admin)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *     responses:
 *       200:
 *         description: Status updated
 *   delete:
 *     summary: Delete booking (Admin)
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 */
router.put("/:bookingId", updateBookingStatus);
router.delete("/:bookingId", deleteBooking);

module.exports = router;
