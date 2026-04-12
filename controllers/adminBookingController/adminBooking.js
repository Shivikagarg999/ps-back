const AdminBooking = require("../../models/adminBooking/adminBooking");
const { parse } = require("csv-parse/sync");

// --------------- helpers ---------------

// Parses "04-01-26" (MM-DD-YY) or "2026-04-01" into a Date. Returns null if empty.
function parseDate(str) {
  if (!str || !str.trim()) return null;
  const s = str.trim();
  // MM-DD-YY
  const mmddyy = s.match(/^(\d{2})-(\d{2})-(\d{2})$/);
  if (mmddyy) {
    const [, mm, dd, yy] = mmddyy;
    return new Date(`20${yy}-${mm}-${dd}T00:00:00.000Z`);
  }
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

// "N/A", "-", "" → null; otherwise parse as number
function parsePayout(str) {
  if (!str || !str.trim() || str.trim().toLowerCase() === "n/a" || str.trim() === "-") return null;
  const n = parseFloat(str.trim());
  return isNaN(n) ? null : n;
}

// Parse a numeric cell; return null if empty
function parseNum(str) {
  if (!str || !str.trim()) return null;
  const n = parseFloat(str.trim());
  return isNaN(n) ? null : n;
}

// Map spreadsheet header names → model field names
const HEADER_MAP = {
  "booking id":                 "bookingId",
  "customer name":              "customerName",
  "phone number":               "phoneNumber",
  "full address":               "fullAddress",
  "booking type":               "bookingType",
  "booking date":               "bookingDate",
  "service date":               "serviceDate",
  "service time slot":          "serviceTimeSlot",
  "services booked":            "servicesBooked",
  "assigned beautician name":   "assignedBeauticianName",
  "booking status":             "bookingStatus",
  "beautician payout":          "beauticianPayout",
  "service amount":             "serviceAmount",
  "gst amount":                 "gstAmount",
  "total amount":               "totalAmount",
  "payment mode":               "paymentMode",
  "payment status":             "paymentStatus",
  "remarks":                    "remarks",
};

const VALID_BOOKING_STATUS  = ["Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled", "In progress"];
const VALID_PAYMENT_STATUS  = ["Paid", "Pending", "Failed"];
const VALID_BOOKING_TYPE    = ["commission", "fixed"];
const VALID_PAYMENT_MODE    = ["UPI", "COD", "Cash", "Card", "Online"];

// --------------- IMPORT ---------------

exports.importAdminBookings = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const content = req.file.buffer.toString("utf-8");

    // Auto-detect delimiter: more tabs than commas → TSV, else CSV
    const firstLine = content.split("\n")[0] || "";
    const delimiter = (firstLine.split("\t").length > firstLine.split(",").length) ? "\t" : ",";

    let records;
    try {
      records = parse(content, {
        delimiter,
        columns: (headers) =>
          headers.map((h) => HEADER_MAP[h.trim().toLowerCase()] || h.trim().toLowerCase()),
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
    } catch (parseErr) {
      return res.status(400).json({ success: false, message: `CSV parse error: ${parseErr.message}` });
    }

    const results = { created: 0, updated: 0, skipped: 0, errors: [] };

    for (const row of records) {
      // Skip header-repeat rows or empty rows
      const bid = (row.bookingId || "").trim();
      if (!bid || bid.toLowerCase() === "booking id") continue;

      const rawType = (row.bookingType || "").trim().toLowerCase();
      const bookingType = VALID_BOOKING_TYPE.includes(rawType) ? rawType : null;

      const bookingDate   = parseDate(row.bookingDate);
      const serviceDate   = parseDate(row.serviceDate);
      const serviceAmount = parseNum(row.serviceAmount);
      const totalAmount   = parseNum(row.totalAmount);

      // Normalise enums — fall back to defaults if unrecognised
      const rawPaymentMode = (row.paymentMode || "").trim();
      const paymentMode = VALID_PAYMENT_MODE.includes(rawPaymentMode) ? rawPaymentMode : "UPI";

      const rawBookingStatus = (row.bookingStatus || "").trim();
      const bookingStatus = VALID_BOOKING_STATUS.includes(rawBookingStatus) ? rawBookingStatus : "Pending";

      const rawPaymentStatus = (row.paymentStatus || "").trim();
      const paymentStatus = VALID_PAYMENT_STATUS.includes(rawPaymentStatus) ? rawPaymentStatus : "Pending";

      const payload = {
        bookingId:              bid,
        customerName:           (row.customerName || "").trim(),
        phoneNumber:            (row.phoneNumber || "").trim(),
        fullAddress:            (row.fullAddress || "").trim(),
        bookingType,
        bookingDate,
        serviceDate,
        serviceTimeSlot:        (row.serviceTimeSlot || "").trim(),
        servicesBooked:         (row.servicesBooked || "").trim(),
        assignedBeauticianName: (row.assignedBeauticianName || "").trim(),
        bookingStatus,
        beauticianPayout:       bookingType === "fixed" ? null : parsePayout(row.beauticianPayout),
        serviceAmount,
        gstAmount:              parseNum(row.gstAmount) ?? 0,
        totalAmount,
        paymentMode,
        paymentStatus,
        remarks:                (row.remarks || "").trim(),
      };

      try {
        const existing = await AdminBooking.findOne({ bookingId: bid });
        if (existing) {
          await AdminBooking.findOneAndUpdate({ bookingId: bid }, payload, { new: true });
          results.updated++;
        } else {
          await AdminBooking.create(payload);
          results.created++;
        }
      } catch (rowErr) {
        results.skipped++;
        results.errors.push(`Row ${bid}: ${rowErr.message}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Import complete — ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`,
      ...results,
    });
  } catch (err) {
    console.error("Error importing admin bookings:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE
exports.createAdminBooking = async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      fullAddress,
      bookingType,
      bookingDate,
      serviceDate,
      serviceTimeSlot,
      servicesBooked,
      assignedBeauticianName,
      bookingStatus,
      beauticianPayout,
      serviceAmount,
      gstAmount,
      totalAmount,
      paymentMode,
      paymentStatus,
    } = req.body;

    const booking = new AdminBooking({
      customerName,
      phoneNumber,
      fullAddress,
      bookingType,
      bookingDate,
      serviceDate,
      serviceTimeSlot,
      servicesBooked,
      assignedBeauticianName,
      bookingStatus,
      beauticianPayout: bookingType === "fixed" ? null : beauticianPayout,
      serviceAmount,
      gstAmount,
      totalAmount,
      paymentMode,
      paymentStatus,
    });

    await booking.save();

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error("Error creating admin booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL (with optional filters)
exports.getAllAdminBookings = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus, bookingType, from, to } = req.query;

    const filter = {};

    if (bookingStatus) filter.bookingStatus = bookingStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (bookingType) filter.bookingType = bookingType;
    if (from || to) {
      filter.serviceDate = {};
      if (from) filter.serviceDate.$gte = new Date(from);
      if (to) filter.serviceDate.$lte = new Date(to);
    }

    const bookings = await AdminBooking.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.error("Error fetching admin bookings:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ONE by ID or bookingId
exports.getAdminBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await AdminBooking.findOne({
      $or: [{ _id: id.match(/^[a-f\d]{24}$/i) ? id : null }, { bookingId: id }],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error("Error fetching admin booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateAdminBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await AdminBooking.findOne({
      $or: [{ _id: id.match(/^[a-f\d]{24}$/i) ? id : null }, { bookingId: id }],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const updatableFields = [
      "customerName",
      "phoneNumber",
      "fullAddress",
      "bookingType",
      "bookingDate",
      "serviceDate",
      "serviceTimeSlot",
      "servicesBooked",
      "assignedBeauticianName",
      "bookingStatus",
      "beauticianPayout",
      "serviceAmount",
      "gstAmount",
      "totalAmount",
      "paymentMode",
      "paymentStatus",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        booking[field] = req.body[field];
      }
    });

    // If bookingType changed to fixed, clear payout
    if (req.body.bookingType === "fixed") {
      booking.beauticianPayout = null;
    }

    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error("Error updating admin booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// STATS
exports.getAdminBookingStats = async (req, res) => {
  try {
    const { from, to, bookingType } = req.query;

    const match = {};
    if (bookingType) match.bookingType = bookingType;
    if (from || to) {
      match.serviceDate = {};
      if (from) match.serviceDate.$gte = new Date(from);
      if (to)   match.serviceDate.$lte = new Date(to);
    }

    const [totals, byStatus, byType, byBeautician, byMonth] = await Promise.all([

      // 1. Overall money totals
      AdminBooking.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalEarnings:        { $sum: "$serviceAmount" },
            totalBeauticianPayout:{ $sum: { $ifNull: ["$beauticianPayout", 0] } },
            totalProfit:          { $sum: "$totalAmount" },
            totalGst:             { $sum: "$gstAmount" },
            totalBookings:        { $sum: 1 },
            paidBookings:         { $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, 1, 0] } },
          },
        },
      ]),

      // 2. Count by booking status
      AdminBooking.aggregate([
        { $match: match },
        { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 3. Earnings split by booking type (commission vs fixed)
      AdminBooking.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$bookingType",
            count:                 { $sum: 1 },
            totalEarnings:         { $sum: "$serviceAmount" },
            totalBeauticianPayout: { $sum: { $ifNull: ["$beauticianPayout", 0] } },
            totalProfit:           { $sum: "$totalAmount" },
          },
        },
      ]),

      // 4. Per-beautician payout breakdown (commission bookings only)
      AdminBooking.aggregate([
        {
          $match: {
            ...match,
            bookingType: "commission",
            assignedBeauticianName: { $ne: "" },
            beauticianPayout: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: "$assignedBeauticianName",
            bookings:      { $sum: 1 },
            totalPayout:   { $sum: "$beauticianPayout" },
            totalEarnings: { $sum: "$serviceAmount" },
          },
        },
        { $sort: { totalPayout: -1 } },
      ]),

      // 5. Month-wise revenue (by service date)
      AdminBooking.aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              year:  { $year: "$serviceDate" },
              month: { $month: "$serviceDate" },
            },
            totalEarnings:         { $sum: "$serviceAmount" },
            totalBeauticianPayout: { $sum: { $ifNull: ["$beauticianPayout", 0] } },
            totalProfit:           { $sum: "$totalAmount" },
            bookings:              { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const summary = totals[0] || {
      totalEarnings: 0,
      totalBeauticianPayout: 0,
      totalProfit: 0,
      totalGst: 0,
      totalBookings: 0,
      paidBookings: 0,
    };
    delete summary._id;

    res.json({
      success: true,
      filters: { from: from || null, to: to || null, bookingType: bookingType || "all" },
      summary,
      byStatus:     byStatus.map((s) => ({ status: s._id, count: s.count })),
      byType:       byType.map((t) => ({ type: t._id, count: t.count, totalEarnings: t.totalEarnings, totalBeauticianPayout: t.totalBeauticianPayout, totalProfit: t.totalProfit })),
      byBeautician,
      byMonth:      byMonth.map((m) => ({
        year:                  m._id.year,
        month:                 m._id.month,
        bookings:              m.bookings,
        totalEarnings:         m.totalEarnings,
        totalBeauticianPayout: m.totalBeauticianPayout,
        totalProfit:           m.totalProfit,
      })),
    });
  } catch (err) {
    console.error("Error fetching admin booking stats:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteAdminBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await AdminBooking.findOne({
      $or: [{ _id: id.match(/^[a-f\d]{24}$/i) ? id : null }, { bookingId: id }],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    await AdminBooking.findByIdAndDelete(booking._id);

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting admin booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
