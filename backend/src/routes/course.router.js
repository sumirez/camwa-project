import express from 'express';
import courseController from '../controllers/courseManagement.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const courseRouter = express.Router();

// Create a course (Admin only)
courseRouter.post('/create', verifyTokenAndRole(['ADMIN']), courseController.createCourse); 
courseRouter.post('/create', verifyTokenAndRole(['ADMIN']), courseController.createCourse); 

// Update and delete courses (Admin/Faculty Assistant)
courseRouter.put('/:courseId', verifyTokenAndRole(['ADMIN', 'faculty_assistant']),  courseController.updateCourse); 
courseRouter.delete('/:courseId', verifyTokenAndRole(['ADMIN']),  courseController.deleteCourse); 

// Assign lecturers and students to intake modules (Faculty Assistant only)
courseRouter.put('/:intakeModuleId/assign-lecturer', verifyTokenAndRole(['ADMIN', 'faculty_assistant']), courseController.assignLecturerToIntakeModule); 
courseRouter.put('/:intakeModuleId/assign-students', verifyTokenAndRole(['ADMIN', 'faculty_assistant']), courseController.assignStudentsToIntakeModule); 

// Create classes for intake modules (Faculty Assistant only)
courseRouter.post('/:intakeModuleId/classes', verifyTokenAndRole(['ADMIN', 'faculty_assistant']), courseController.createClassesForIntakeModule); 

// Export Intake Module Report (Faculty Assistant only)
courseRouter.get('/:intakeModuleId/export-report', verifyTokenAndRole(['ADMIN', 'faculty_assistant']), courseController.exportIntakeModuleReport);

export default courseRouter;
