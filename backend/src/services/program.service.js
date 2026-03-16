import Program from '../models/Program.model.js';
import Student from '../models/Student.model.js';
import Lecturer from '../models/Lecturer.model.js';

const programService = {
  createProgram: async (programData) => {
    try {
      const newProgram = await Program.create(programData);
      return newProgram;
    } catch (error) {
      throw new Error('Error creating program: ' + error.message);
    }
  },

  getAllPrograms: async () => {
    try {
      const programs = await Program.findAll();
      return programs;
    } catch (error) {
      throw new Error('Error retrieving programs: ' + error.message);
    }
  },

  findProgramById: async (program_id) => {
    try {
      const program = await Program.findOne({ where: { program_id } });
      if (!program) {
        throw new Error('Program not found');
      }
      return program;
    } catch (error) {
      throw new Error('Error finding program: ' + error.message);
    }
  },

  deleteProgram: async (program_id) => {
    try {
      const result = await Program.destroy({ where: { program_id } });
      if (result === 0) {
        throw new Error('Program not found');
      }
      return { message: 'Program deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting program: ' + error.message);
    }
  },

  updateProgram: async (program_id, updatedData) => {
    try {
      const [updated] = await Program.update(updatedData, {
        where: { program_id },
      });
      if (updated === 0) {
        throw new Error('Program not found or no changes made');
      }
      const updatedProgram = await Program.findOne({ where: { program_id } });
      return updatedProgram;
    } catch (error) {
      throw new Error('Error updating program: ' + error.message);
    }
  },

  // Assign a student to a program by creating a program registration
  assignStudentToProgram: async (program_id, student_id) => {
    try {
      const program = await Program.findByPk(program_id);
      const student = await Student.findByPk(student_id);

      if (!program || !student) {
        throw new Error('Program or Student not found');
      }
      await program.addStudent(student);
      return { message: 'Student assigned to program successfully' };
    } catch (error) {
      throw new Error('Error registering student to program: ' + error.message);
    }
  },

  // Assign a lecturer to a program by updating their program_id
  assignLecturerToProgram: async (program_id, lecturer_id) => {
    try {
      const program = await Program.findByPk(program_id);
      const lecturer = await Lecturer.findByPk(lecturer_id);

      if (!program || !lecturer) {
        throw new Error('Program or Lecturer not found');
      }
      await program.addLecturer(lecturer);
      return { message: 'Lecturer assigned to program successfully' };
    } catch (error) {
      throw new Error('Error assigning lecturer to program: ' + error.message);
    }
  },

  // Assign a module to a program
  assignModuleToProgram: async (program_id, module_id) => {
    try {
      const program = await Program.findByPk(program_id);
      const module = await Module.findByPk(module_id);
      if (!program || !module) {
        throw new Error('Program or Module not found');
      }

      // Check if module already exists in this program
      const existingModule = await Module.findOne({
        where: {
          name: module.name,
          program_id: program_id
        }
      });

      if (existingModule) {
        throw new Error('This module is already assigned to the program');
      }

      // Create new module entry excluding module_id
      const { module_id: id, ...moduleData } = module.dataValues;
      const newModule = await Module.create({
        ...moduleData,
        program_id: program_id
      });

      return { message: 'Module assigned to program successfully' };
    } catch (error) {
      throw new Error('Error assigning module to program: ' + error.message);
    }
  },

  // View modules in a program
  viewModulesInProgram: async (program_id) => {
    try {
      const modules = await Module.findAll({
        where: { program_id: program_id }
      });
      if (!modules) {
        throw new Error('No modules found in this program');
      }
      return modules;
    } catch (error) {
      throw new Error('Error retrieving modules in program: ' + error.message);
    }
  },

  // View lecturers in a program
  viewLecturersInProgram: async (program_id) => {
    try {
      const lecturers = await Lecturer.findAll({
        where: { program_id: program_id }
      });
      if (!lecturers) {
        throw new Error('No lecturers found in this program');
      }
      return lecturers;
    } catch (error) {
      throw new Error('Error retrieving lecturers in program: ' + error.message);
    }
  },


  // View students in a program
  viewStudentsInProgram: async (program_id) => {
    try {
      const students = await Student.findAll({
        where: { program_id: program_id }
      });
      if (!students) {
        throw new Error('No students found in this program');
      }
      return students;
    } catch (error) {
      throw new Error('Error retrieving students in program: ' + error.message);
    }
  },
};

export default programService;
