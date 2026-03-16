import Notification from '../models/Notification.model.js';
import AttendanceRequest from '../models/AttendanceRequest.model.js';

const notificationService = {
    // Create a new notification
    createNotification: async (notificationData) => {
        try {
            const notification = await Notification.create(notificationData);
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Error creating notification: ' + error.message);
        }
    },

    // Create notification when student requests attendance correction
    createNewRequestNotification: async (requestId, studentId) => {
        try {
            // Create notification for Faculty/Admin
            const notificationData = {
                sender_id: studentId,
                receiver_id: 'FACULTY', // Generic receiver for faculty
                notification_type: 'new_request',
                request_id: requestId,
                status: 'unread'
            };

            const notification = await notificationService.createNotification(notificationData);
            console.log(`New request notification created for request ${requestId}`);
            return notification;
        } catch (error) {
            console.error('Error creating new request notification:', error);
            throw error;
        }
    },

    // Create notification when admin/faculty processes attendance correction request
    createRequestProcessedNotification: async (requestId, processedBy, isApproved) => {
        try {
            // Get the attendance request to find the student
            const request = await AttendanceRequest.findByPk(requestId);
            if (!request) {
                throw new Error('Attendance request not found');
            }

            const notificationData = {
                sender_id: processedBy,
                receiver_id: request.student_id,
                notification_type: isApproved ? 'request_approved' : 'request_rejected',
                request_id: requestId,
                status: 'unread'
            };

            const notification = await notificationService.createNotification(notificationData);
            console.log(`Request processed notification created for request ${requestId}`);
            return notification;
        } catch (error) {
            console.error('Error creating request processed notification:', error);
            throw error;
        }
    },

    // Get notifications for a specific user
    getNotificationsByUser: async (userId, status = null) => {
        try {
            const whereCondition = { receiver_id: userId };
            if (status) {
                whereCondition.status = status;
            }

            const notifications = await Notification.findAll({
                where: whereCondition,
                order: [['created_at', 'DESC']]
            });

            return notifications;
        } catch (error) {
            console.error('Error getting notifications:', error);
            throw new Error('Error getting notifications: ' + error.message);
        }
    },

    // Mark a notification as read
    markNotificationAsRead: async (notificationId, userId) => {
        try {
            const notification = await Notification.findOne({
                where: {
                    notification_id: notificationId,
                    receiver_id: userId
                }
            });

            if (!notification) {
                throw new Error('Notification not found or access denied');
            }

            if (notification.status === 'read') {
                return notification; // Already read
            }

            await notification.update({
                status: 'read',
                read_at: new Date()
            });

            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Error marking notification as read: ' + error.message);
        }
    },

    // Mark all notifications as read for a user
    markAllNotificationsAsRead: async (userId) => {
        try {
            const result = await Notification.update(
                {
                    status: 'read',
                    read_at: new Date()
                },
                {
                    where: {
                        receiver_id: userId,
                        status: 'unread'
                    }
                }
            );

            return result;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw new Error('Error marking all notifications as read: ' + error.message);
        }
    },

    // Get unread notification count for a user
    getUnreadNotificationCount: async (userId) => {
        try {
            const count = await Notification.count({
                where: {
                    receiver_id: userId,
                    status: 'unread'
                }
            });

            return count;
        } catch (error) {
            console.error('Error getting unread notification count:', error);
            throw new Error('Error getting unread notification count: ' + error.message);
        }
    },

    // Delete a notification
    deleteNotification: async (notificationId, userId) => {
        try {
            const result = await Notification.destroy({
                where: {
                    notification_id: notificationId,
                    receiver_id: userId
                }
            });

            if (result === 0) {
                throw new Error('Notification not found or access denied');
            }

            return result;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw new Error('Error deleting notification: ' + error.message);
        }
    }
};

export default notificationService;
