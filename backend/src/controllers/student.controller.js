import studentService from '../services/student.service.js';
import { responseSuccess, responseError } from '../common/helpers/response.helper.js';

const studentController = {
  // Create a new student
  createStudent: async (req, res) => {
    try {
      const newStudent = await studentService.createStudent(req.body);
      res.status(201).json(responseSuccess(newStudent, 'Student created successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // Get all students
  getAllStudents: async (req, res) => {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json(responseSuccess(students, 'Students retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  getAllStudentsByProgramId: async (req, res) => {
    const { programId } = req.params;
    try {
      const students = await studentService.getAllStudentsByProgramId(programId);
      res.status(200).json(responseSuccess(students, 'Students retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  // Find a student by student_id
  findStudentById: async (req, res) => {
    const { student_id } = req.params;
    try {
      const student = await studentService.findStudentById(student_id);
      res.status(200).json(responseSuccess(student, 'Student found successfully'));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  // Delete a student by student_id
  deleteStudent: async (req, res) => {
    const { student_id } = req.params;
    try {
      const result = await studentService.deleteStudent(student_id);
      res.status(200).json(responseSuccess(null, result.message));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  // Update a student by student_id
  updateStudent: async (req, res) => {
    const { student_id } = req.params;
    try {
      const updatedStudent = await studentService.updateStudent(student_id, req.body);
      res.status(200).json(responseSuccess(updatedStudent, 'Student updated successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },
};

export default studentController;