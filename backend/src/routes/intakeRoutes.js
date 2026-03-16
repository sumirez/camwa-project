import express from 'express';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';
import intakeManagementController from '../controllers/intakeManagement.controller.js';

const router = express.Router();

// Admin only routes
router.post('/', verifyTokenAndRole(['ADMIN']), intakeManagementController.createIntake);
router.put('/:year', verifyTokenAndRole(['ADMIN']), intakeManagementController.updateIntake);
router.delete('/:year', verifyTokenAndRole(['ADMIN']), intakeManagementController.deleteIntake);

// Public routes (or could also be protected if needed)
router.get('/', intakeManagementController.getAllIntakes);
router.get('/:year', intakeManagementController.getIntakeByYear);

export default router;
