const express = require("express");
const router = express.Router();
const {
  createAdminBooking,
  getAllAdminBookings,
  getAdminBookingById,
  updateAdminBooking,
  deleteAdminBooking,
  importAdminBookings,
  getAdminBookingStats,
} = require("../../controllers/adminBookingController/adminBooking");
const upload = require("../../middlewares/upload");

/**
 * @swagger
 * tags:
 *   name: AdminBookings
 *   description: Admin-managed booking records (manual entries)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminBooking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 69dfd9229d294a16c1b575e9
 *         bookingId:
 *           type: string
 *           example: PS-2026-0032
 *         name:
 *           type: string
 *           example: Kanika
 *         phoneNumber:
 *           type: string
 *           example: "9289214121"
 *         address:
 *           type: string
 *           example: Ace divino T10, 002 noida
 *         type:
 *           type: string
 *           enum: [commission, fixed]
 *           example: commission
 *         bookingDate:
 *           type: string
 *           example: "04-01-26"
 *         serviceDate:
 *           type: string
 *           example: "04-01-26"
 *         serviceTimeSlot:
 *           type: string
 *           example: "2 pm - 4 pm"
 *         services:
 *           type: string
 *           example: "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…"
 *         beautician:
 *           type: string
 *           example: Deepika
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled, Rescheduled, In progress]
 *           example: Completed
 *         amount:
 *           type: number
 *           example: 649
 *         beauticianPayout:
 *           type: [number, string]
 *           nullable: true
 *           description: Number for commission type, "N/A" or null for fixed type
 *           example: 340
 *         companyAmount:
 *           type: number
 *           example: 309
 *         paymentMode:
 *           type: string
 *           enum: [UPI, COD, Cash, Card, Online]
 *           example: UPI
 *         paymentStatus:
 *           type: string
 *           enum: [Paid, Pending, Failed]
 *           example: Paid
 *         remarks:
 *           type: string
 *           example: ""
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AdminBookingInput:
 *       type: object
 *       required:
 *         - bookingId
 *         - type
 *         - bookingDate
 *         - serviceDate
 *         - amount
 *         - paymentMode
 *       properties:
 *         bookingId:
 *           type: string
 *           example: PS-2026-0032
 *         name:
 *           type: string
 *           example: Kanika
 *         phoneNumber:
 *           type: string
 *           example: "9289214121"
 *         address:
 *           type: string
 *           example: Ace divino T10, 002 noida
 *         type:
 *           type: string
 *           enum: [commission, fixed]
 *           example: commission
 *         bookingDate:
 *           type: string
 *           example: "04-01-26"
 *         serviceDate:
 *           type: string
 *           example: "04-01-26"
 *         serviceTimeSlot:
 *           type: string
 *           example: "2 pm - 4 pm"
 *         services:
 *           type: string
 *           example: "Full body wax"
 *         beautician:
 *           type: string
 *           example: Sakshi
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled, Rescheduled, In progress]
 *           default: Pending
 *           example: Completed
 *         amount:
 *           type: number
 *           example: 999
 *         beauticianPayout:
 *           type: [number, string]
 *           description: Number for commission type, null/"N/A" for fixed type
 *           example: 340
 *         companyAmount:
 *           type: number
 *           example: 309
 *         paymentMode:
 *           type: string
 *           enum: [UPI, COD, Cash, Card, Online]
 *           example: UPI
 *         paymentStatus:
 *           type: string
 *           enum: [Paid, Pending, Failed]
 *           default: Pending
 *           example: Paid
 *         remarks:
 *           type: string
 *           example: ""
 */

/**
 * @swagger
 * /api/admin-bookings:
 *   post:
 *     summary: Create a new admin booking record
 *     description: Create a manual booking record. Booking ID is auto-generated if not provided.
 *     tags: [AdminBookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminBookingInput'
 *           example:
 *             bookingId: PS-2026-0032
 *             name: Kanika
 *             phoneNumber: "9289214121"
 *             address: Ace divino T10, 002 noida
 *             type: commission
 *             bookingDate: "04-01-26"
 *             serviceDate: "04-01-26"
 *             serviceTimeSlot: "2 pm - 4 pm"
 *             services: "Honey wax (underarms, full arms, full legs), threading (eyebrow, upper…"
 *             beautician: Deepika
 *             status: Completed
 *             amount: 649
 *             beauticianPayout: 340
 *             companyAmount: 309
 *             paymentMode: UPI
 *             paymentStatus: Paid
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AdminBooking'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all admin booking records
 *     description: Supports optional filtering by status, type, and service date range.
 *     tags: [AdminBookings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled, Rescheduled, In progress]
 *         description: Filter by booking status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [Paid, Pending, Failed]
 *         description: Filter by payment status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [commission, fixed]
 *         description: Filter by booking type
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *         description: Filter bookings with serviceDate on or after this date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-31"
 *         description: Filter bookings with serviceDate on or before this date
 *     responses:
 *       200:
 *         description: List of admin booking records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 9
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminBooking'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/admin-bookings/import:
 *   post:
 *     summary: Import bookings from a CSV or TSV (Google Sheets export)
 *     description: |
 *       Upload a `.csv` or `.tsv` file exported from Google Sheets.
 *       The file must contain a header row with these column names (order doesn't matter):
 *       `Booking ID`, `Customer Name`, `Phone Number`, `Full Address`, `Booking Type`,
 *       `Booking Date`, `Service Date`, `Service Time Slot`, `Services Booked`,
 *       `Assigned Beautician Name`, `Booking Status`, `Beautician payout`,
 *       `Service Amount`, `GST Amount`, `Total Amount`, `Payment Mode`, `Payment Status`, `Remarks`.
 *
 *       - Dates should be in `MM-DD-YY` format (e.g. `04-01-26`).
 *       - `Beautician payout` of `N/A` or `-` is stored as null.
 *       - If a Booking ID already exists in the database it will be **updated**; otherwise a new record is **created**.
 *       - Rows with missing `Booking ID`, `bookingType`, dates, or amounts are skipped.
 *     tags: [AdminBookings]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or TSV file exported from Google Sheets
 *     responses:
 *       200:
 *         description: Import complete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Import complete — 18 created, 2 updated, 1 skipped
 *                 created:
 *                   type: integer
 *                   example: 18
 *                 updated:
 *                   type: integer
 *                   example: 2
 *                 skipped:
 *                   type: integer
 *                   example: 1
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Row PS-2026-0046: missing required numeric/date fields"]
 *       400:
 *         description: No file uploaded or CSV parse error
 *       500:
 *         description: Server error
 */
router.post("/import", upload.single("file"), importAdminBookings);

/**
 * @swagger
 * /api/admin-bookings/stats:
 *   get:
 *     summary: Get earnings and booking statistics
 *     description: |
 *       Returns aggregated financial stats across all admin booking records.
 *
 *       **Field definitions:**
 *       - `totalEarnings` — sum of `serviceAmount` (what customers paid)
 *       - `totalBeauticianPayout` — sum of `beauticianPayout` (commission paid to beauticians)
 *       - `totalProfit` — sum of `totalAmount` (our net profit)
 *       - `totalGst` — sum of `gstAmount`
 *
 *       All three date/type filters can be combined.
 *     tags: [AdminBookings]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-04-01"
 *         description: Filter by serviceDate on or after this date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-04-30"
 *         description: Filter by serviceDate on or before this date
 *       - in: query
 *         name: bookingType
 *         schema:
 *           type: string
 *           enum: [commission, fixed]
 *         description: Restrict stats to one booking type only
 *     responses:
 *       200:
 *         description: Stats returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 filters:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       nullable: true
 *                       example: "2026-04-01"
 *                     to:
 *                       type: string
 *                       nullable: true
 *                       example: "2026-04-30"
 *                     bookingType:
 *                       type: string
 *                       example: all
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalEarnings:
 *                       type: number
 *                       description: Sum of serviceAmount (customer payments)
 *                       example: 24000
 *                     totalBeauticianPayout:
 *                       type: number
 *                       description: Sum of beauticianPayout (commission paid out)
 *                       example: 8500
 *                     totalProfit:
 *                       type: number
 *                       description: Sum of totalAmount (our net profit)
 *                       example: 15500
 *                     totalGst:
 *                       type: number
 *                       example: 3200
 *                     totalBookings:
 *                       type: integer
 *                       example: 22
 *                     paidBookings:
 *                       type: integer
 *                       example: 19
 *                 byStatus:
 *                   type: array
 *                   description: Booking count grouped by bookingStatus
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: Completed
 *                       count:
 *                         type: integer
 *                         example: 18
 *                 byType:
 *                   type: array
 *                   description: Earnings split by booking type
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: commission
 *                       count:
 *                         type: integer
 *                       totalEarnings:
 *                         type: number
 *                       totalBeauticianPayout:
 *                         type: number
 *                       totalProfit:
 *                         type: number
 *                 byBeautician:
 *                   type: array
 *                   description: Per-beautician payout breakdown (commission bookings only)
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Beautician name
 *                         example: Arti Mehta
 *                       bookings:
 *                         type: integer
 *                         example: 3
 *                       totalPayout:
 *                         type: number
 *                         example: 2763
 *                       totalEarnings:
 *                         type: number
 *                         example: 3947
 *                 byMonth:
 *                   type: array
 *                   description: Month-wise revenue breakdown (by service date)
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: integer
 *                         example: 2026
 *                       month:
 *                         type: integer
 *                         example: 4
 *                       bookings:
 *                         type: integer
 *                         example: 15
 *                       totalEarnings:
 *                         type: number
 *                         example: 18000
 *                       totalBeauticianPayout:
 *                         type: number
 *                         example: 6000
 *                       totalProfit:
 *                         type: number
 *                         example: 12000
 *       500:
 *         description: Server error
 */
router.get("/stats", getAdminBookingStats);

router.post("/", createAdminBooking);
router.get("/", getAllAdminBookings);

/**
 * @swagger
 * /api/admin-bookings/{id}:
 *   get:
 *     summary: Get a single admin booking
 *     description: Accepts either the MongoDB `_id` or the human-readable Booking ID (e.g. PS-2026-0030).
 *     tags: [AdminBookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId or Booking ID (PS-YYYY-XXXX)
 *         example: PS-2026-0030
 *     responses:
 *       200:
 *         description: Booking found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AdminBooking'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Booking not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an admin booking record
 *     description: Accepts either the MongoDB `_id` or Booking ID. Send only the fields you want to update. If bookingType is changed to fixed, beauticianPayout is cleared automatically.
 *     tags: [AdminBookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId or Booking ID (PS-YYYY-XXXX)
 *         example: PS-2026-0030
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminBookingInput'
 *           example:
 *             bookingStatus: Completed
 *             assignedBeauticianName: Sakshi
 *             beauticianPayout: 500
 *             paymentStatus: Paid
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AdminBooking'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Booking not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete an admin booking record
 *     description: Accepts either the MongoDB `_id` or Booking ID (e.g. PS-2026-0030).
 *     tags: [AdminBookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId or Booking ID (PS-YYYY-XXXX)
 *         example: PS-2026-0030
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Booking not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getAdminBookingById);
router.put("/:id", updateAdminBooking);
router.delete("/:id", deleteAdminBooking);

module.exports = router;
