const Notification = require("../../models/notification/notification");

// @desc    Get user notifications
// @route   GET /api/user/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            data: notifications.map(notif => ({
                id: notif._id,
                title: notif.title,
                message: notif.message,
                type: notif.type,
                isRead: notif.isRead,
                createdAt: notif.createdAt,
                metadata: notif.metadata
            })),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/user/notifications/:notificationId/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.notificationId,
            user: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Mark all user notifications as read
// @route   PATCH /api/user/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Get unread notification count
// @route   GET /api/user/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            isRead: false,
        });

        res.status(200).json({
            success: true,
            count: unreadCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
