import express from 'express';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';
import semesterManagementController from '../controllers/semesterManagement.controller.js';

const router = express.Router();

// Admin only routes
router.post('/', verifyTokenAndRole(['ADMIN']), semesterManagementController.createSemester);
router.put('/:sem_id', verifyTokenAndRole(['ADMIN']), semesterManagementController.updateSemester);
router.delete('/:sem_id', verifyTokenAndRole(['ADMIN']), semesterManagementController.deleteSemester);

// Public routes (or could also be protected if needed)
router.get('/', semesterManagementController.getAllSemesters);
router.get('/current', semesterManagementController.getCurrentSemester);
router.get('/:sem_id', semesterManagementController.getSemesterById);

export default router;
