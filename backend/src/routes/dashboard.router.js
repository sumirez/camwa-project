import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const dashboardRouter = express.Router();

dashboardRouter.get(
  '/attendance-analytics',
  verifyTokenAndRole(['ADMIN']),
  dashboardController.getAttendanceAnalytics
);

export default dashboardRouter;

