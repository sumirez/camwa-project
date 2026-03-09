import express from 'express';
import attendanceController from '../controllers/attendanceManagement.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const attendanceRouter = express.Router();

// Create and manage attendance records (for Admin or Faculty)
attendanceRouter.post('/create', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.createAttendance);
attendanceRouter.get('/view', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), attendanceController.viewAttendance);
attendanceRouter.put('/:attendanceId', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.updateAttendance);
attendanceRouter.delete('/:attendanceId', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.deleteAttendance);

// Calculate and view eligibility for exams
attendanceRouter.get('/eligibility/calculate', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.calculateEligibility);
attendanceRouter.get('/eligibility/status', verifyTokenAndRole(['STUDENT', 'LECTURER', 'ADMIN']), attendanceController.viewExamEligibilityStatus);

// Attendance correction requests
attendanceRouter.post('/student/correction', verifyTokenAndRole(['ADMIN', 'STUDENT']), attendanceController.requestAttendanceCorrection);
attendanceRouter.put('/correction/:requestId', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.handleCorrectionRequest);

// View attendance requests by lecturer
attendanceRouter.get('/lecturer/:lecturerId', verifyTokenAndRole(['LECTURER', 'FACULTY', 'ADMIN']), attendanceController.viewAttendanceRequestsByLecturerId);

export default attendanceRouter;
