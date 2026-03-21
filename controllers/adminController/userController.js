const User = require("../../models/user/user");

/**
 * @desc    Get all users (customers)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find({ role: 'user' })
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            User.countDocuments({ role: 'user' })
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pages: Math.ceil(total / limit),
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
