import express from 'express';
import programController from '../controllers/programManagement.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const programRouter = express.Router();

// Admin-only operations for create, update, delete
programRouter.post('/', verifyTokenAndRole(['ADMIN']), programController.createProgram);
programRouter.delete('/:program_id', verifyTokenAndRole(['ADMIN']), programController.deleteProgram);
programRouter.put('/:program_id', verifyTokenAndRole(['ADMIN']), programController.updateProgram);

// Read operations accessible by both ADMIN and FACULTY
programRouter.get('/', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.getAllPrograms);
programRouter.get('/:program_id', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.findProgramById);
programRouter.post('/:program_id/students/:student_id', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.assignStudentToProgram);
programRouter.post('/:program_id/lecturers/:lecturer_id', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.assignLecturerToProgram);
programRouter.post('/:program_id/modules/:module_id', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.assignModuleToProgram);
programRouter.get('/:program_id/modules', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.viewModulesInProgram);
programRouter.get('/:program_id/lecturers', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.viewLecturersInProgram);
programRouter.get('/:program_id/students', verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.viewStudentsInProgram);

export default programRouter;
