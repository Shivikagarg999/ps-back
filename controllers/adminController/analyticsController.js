const Booking = require("../../models/booking/booking");
const User = require("../../models/user/user");
const Service = require("../../models/service/service");
const Beautician = require("../../models/beautician/beautician");

/**
 * @desc    Get dashboard overview analytics
 * @route   GET /api/admin/analytics/overview
 * @access  Private/Admin
 */
exports.getOverview = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalBeauticians = await Beautician.countDocuments();
        const totalServices = await Service.countDocuments();

        // Calculate total revenue from completed and paid bookings
        const revenueData = await Booking.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate("user", "name phone")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalBookings,
                    totalUsers,
                    totalBeauticians,
                    totalServices,
                    totalRevenue,
                },
                recentBookings,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get booking stats (status breakdown)
 * @route   GET /api/admin/analytics/bookings
 * @access  Private/Admin
 */
exports.getBookingStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get revenue stats (last 7 days)
 * @route   GET /api/admin/analytics/revenue
 * @access  Private/Admin
 */
exports.getRevenueStats = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stats = await Booking.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
