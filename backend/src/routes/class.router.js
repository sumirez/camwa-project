import express from 'express';
import classController from '../controllers/classManagement.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const classRouter = express.Router();

// Create and update classes (Faculty or Admin)
classRouter.post('/create', verifyTokenAndRole(['FACULTY', 'ADMIN']), classController.createClass); 
classRouter.put('/:classId', verifyTokenAndRole(['FACULTY', 'ADMIN']), classController.updateClass); 
classRouter.delete('/:classId', verifyTokenAndRole(['FACULTY']), classController.deleteClass); 

// View classes by role and module
classRouter.get('/lecturer/:lecturerId', verifyTokenAndRole(['LECTURER', 'FACULTY', 'ADMIN']), classController.viewClassesByLecturer); 
classRouter.get('/student/:studentId', verifyTokenAndRole(['STUDENT', 'FACULTY', 'ADMIN']), classController.viewClassesByStudent); 
classRouter.get('/intake-module/:intakeModuleId', verifyTokenAndRole(['FACULTY', 'ADMIN']), classController.viewClassesByIntakeModule); 

// Attendance views and rates
classRouter.get('/attendance/:classId', verifyTokenAndRole(['LECTURER', 'FACULTY', 'ADMIN']), classController.viewStudentAttendance); 
classRouter.get('/attendance-rate/:moduleId', verifyTokenAndRole(['LECTURER', 'FACULTY', 'ADMIN']), classController.viewStudentAttendanceRate); 

export default classRouter;
