const admin = require('../config/firebase');
const User = require('../models/user/user');

/**
 * Send a push notification to a specific user
 * @param {string} userId - The ID of the user
 * @param {object} payload - Notification content { title, body, data }
 */
const sendPushNotification = async (userId, { title, body, data = {} }) => {
    try {
        const user = await User.findById(userId).select('fcmToken');

        if (!user || !user.fcmToken) {
            console.log(`Push notification skipped: No FCM token for user ${userId}`);
            return;
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            data: {
                ...data,
                click_action: 'FLUTTER_NOTIFICATION_CLICK', // Common for cross-platform apps
            },
            token: user.fcmToken,
            // Android specific configuration
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'high_importance_channel', // Match your mobile app channel ID
                },
            },
            // iOS specific configuration
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent push notification:', response);
        return response;
    } catch (error) {
        if (error.code === 'messaging/registration-token-not-registered') {
            console.log('FCM Token is no longer valid. Removing from user.');
            await User.findByIdAndUpdate(userId, { fcmToken: null });
        } else {
            console.error('Error sending push notification:', error);
        }
    }
};

module.exports = { sendPushNotification };
