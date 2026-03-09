import express from 'express';
import studentController from '../controllers/student.controller.js';

const studentRouter = express.Router();

studentRouter.post('/', studentController.createStudent);
studentRouter.get('/all', studentController.getAllStudents);
studentRouter.get('/:programId', studentController.getAllStudentsByProgramId);
studentRouter.get('/:student_id', studentController.findStudentById);
studentRouter.delete('/:student_id', studentController.deleteStudent);
studentRouter.put('/:student_id', studentController.updateStudent);
export default studentRouter;