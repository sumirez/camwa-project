import notificationService from '../services/notification.service.js';
import { responseSuccess, responseError } from '../common/helpers/response.helper.js';

const notificationController = {
    // Get notifications for the current user
    getNotifications: async (req, res, next) => {
        try {
            const userId = req.user?.uid;
            const { status } = req.query;

            if (!userId) {
                return res.status(401).json(responseError('User not authenticated', 401));
            }

            const notifications = await notificationService.getNotificationsByUser(userId, status);
            const resData = responseSuccess(notifications, 'Notifications retrieved successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Get unread notification count for current user
    getUnreadCount: async (req, res, next) => {
        try {
            const userId = req.user?.uid;

            if (!userId) {
                return res.status(401).json(responseError('User not authenticated', 401));
            }

            const count = await notificationService.getUnreadNotificationCount(userId);
            const resData = responseSuccess({ count }, 'Unread notification count retrieved successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Mark a specific notification as read
    markAsRead: async (req, res, next) => {
        try {
            const { notificationId } = req.params;
            const userId = req.user?.uid;

            if (!userId) {
                return res.status(401).json(responseError('User not authenticated', 401));
            }

            if (!notificationId) {
                return res.status(400).json(responseError('Notification ID is required', 400));
            }

            const notification = await notificationService.markNotificationAsRead(notificationId, userId);
            const resData = responseSuccess(notification, 'Notification marked as read successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Mark all notifications as read for current user
    markAllAsRead: async (req, res, next) => {
        try {
            const userId = req.user?.uid;

            if (!userId) {
                return res.status(401).json(responseError('User not authenticated', 401));
            }

            const result = await notificationService.markAllNotificationsAsRead(userId);
            const resData = responseSuccess(result, 'All notifications marked as read successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Delete a notification
    deleteNotification: async (req, res, next) => {
        try {
            const { notificationId } = req.params;
            const userId = req.user?.uid;

            if (!userId) {
                return res.status(401).json(responseError('User not authenticated', 401));
            }

            if (!notificationId) {
                return res.status(400).json(responseError('Notification ID is required', 400));
            }

            await notificationService.deleteNotification(notificationId, userId);
            const resData = responseSuccess(null, 'Notification deleted successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    }
};

export default notificationController;
