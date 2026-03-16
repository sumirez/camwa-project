import programService from '../services/program.service.js';
import { responseSuccess, responseError } from '../common/helpers/response.helper.js';

const programController = {
  createProgram: async (req, res) => {
    try {
      const newProgram = await programService.createProgram(req.body);
      res.status(201).json(responseSuccess(newProgram, 'Program created successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  getAllPrograms: async (req, res) => {
    try {
      const programs = await programService.getAllPrograms();
      res.status(200).json(responseSuccess(programs, 'Programs retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  findProgramById: async (req, res) => {
    const { program_id } = req.params;
    try {
      const program = await programService.findProgramById(program_id);
      res.status(200).json(responseSuccess(program, 'Program found successfully'));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  deleteProgram: async (req, res) => {
    const { program_id } = req.params;
    try {
      const result = await programService.deleteProgram(program_id);
      res.status(200).json(responseSuccess(null, result.message));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  updateProgram: async (req, res) => {
    const { program_id } = req.params;
    try {
      const updatedProgram = await programService.updateProgram(program_id, req.body);
      res.status(200).json(responseSuccess(updatedProgram, 'Program updated successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // Assign a student to a program
  assignStudentToProgram: async (req, res) => {
    const { program_id, student_id } = req.params;
    try {
      const result = await programService.assignStudentToProgram(program_id, student_id);
      res.status(200).json(responseSuccess(null, result.message));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // Assign a lecturer to a program
  assignLecturerToProgram: async (req, res) => {
    const { program_id, lecturer_id } = req.params;
    try {
      const result = await programService.assignLecturerToProgram(program_id, lecturer_id);
      res.status(200).json(responseSuccess(null, result.message));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },
  // Assign a module to a program
  assignModuleToProgram: async (req, res) => {
    const { program_id, module_id } = req.params;
    try {
      const result = await programService.assignModuleToProgram(program_id, module_id);
      res.status(200).json(responseSuccess(null, result.message));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // View modules in a program
  viewModulesInProgram: async (req, res) => {
    const { program_id } = req.params;
    try {
      const modules = await programService.viewModulesInProgram(program_id);
      res.status(200).json(responseSuccess(modules, 'Modules retrieved successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // View lecturers in a program
  viewLecturersInProgram: async (req, res) => {
    const { program_id } = req.params;
    try {
      const lecturers = await programService.viewLecturersInProgram(program_id);
      res.status(200).json(responseSuccess(lecturers, 'Lecturers retrieved successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // View students in a program
  viewStudentsInProgram: async (req, res) => {
    const { program_id } = req.params;
    try {
      const students = await programService.viewStudentsInProgram(program_id);
      res.status(200).json(responseSuccess(students, 'Students retrieved successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },
};

export default programController;
