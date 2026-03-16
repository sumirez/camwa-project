import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const notificationRouter = express.Router();

// Get notifications for current user (with optional status filter)
notificationRouter.get('/', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), notificationController.getNotifications);

// Get unread notification count for current user
notificationRouter.get('/unread-count', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), notificationController.getUnreadCount);

// Mark a specific notification as read
notificationRouter.put('/:notificationId/read', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), notificationController.markAsRead);

// Mark all notifications as read for current user
notificationRouter.put('/mark-all-read', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), notificationController.markAllAsRead);

// Delete a notification
notificationRouter.delete('/:notificationId', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), notificationController.deleteNotification);

export default notificationRouter;
