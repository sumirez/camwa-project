import express from 'express';
import programController from '../controllers/programManagement.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const programRouter = express.Router();

programRouter.post('/',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.createProgram);
programRouter.get('/',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.getAllPrograms);
programRouter.get('/:program_id',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.findProgramById);
programRouter.delete('/:program_id',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.deleteProgram);
programRouter.put('/:program_id',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.updateProgram);
programRouter.post('/:program_id/students/:student_id',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.assignStudentToProgram);
programRouter.post('/:program_id/lecturers/:lecturer_id',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.assignLecturerToProgram);
programRouter.post('/:program_id/courses/:course_id',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.assignCourseToProgram);
programRouter.get('/:program_id/courses',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.viewCoursesInProgram);
programRouter.get('/:program_id/lecturers',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.viewLecturersInProgram);
programRouter.get('/:program_id/students',verifyTokenAndRole(['ADMIN', 'FACULTY']), programController.viewStudentsInProgram);

export default programRouter;
