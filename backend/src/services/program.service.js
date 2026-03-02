import Program from '../models/Program.model.js'; 
import Student from '../models/Student.model.js';
import Lecturer from '../models/Lecturer.model.js';
import Course from '../models/Course.model.js';
import ProgramRegistering from '../models/ProgramRegistering.model.js';

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

      // Create new program registration entry
      await ProgramRegistering.create({
        student_id: student_id,
        program_id: program_id,
        intake: new Date().getFullYear() // Current year as intake
      });

      return { message: 'Student registered to program successfully' };
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

      // Update lecturer's program_id
      await Lecturer.update(
        { program_id: program_id },
        { where: { staff_id: lecturer_id } }
      );

      return { message: 'Lecturer assigned to program successfully' };
    } catch (error) {
      throw new Error('Error assigning lecturer to program: ' + error.message);
    }
  },

  // Assign a course to a program
  assignCourseToProgram: async (program_id, course_id) => {
    try {
      const program = await Program.findByPk(program_id);
      const course = await Course.findByPk(course_id);
      if (!program || !course) {
        throw new Error('Program or Course not found');
      }
  
      // Check if course already exists in this program
      const existingCourse = await Course.findOne({
        where: {
          name: course.name,
          program_id: program_id
        }
      });
  
      if (existingCourse) {
        throw new Error('This course is already assigned to the program');
      }
      
      // Create new course entry excluding course_id
      const { course_id: id, ...courseData } = course.dataValues;
      const newCourse = await Course.create({
        ...courseData,
        program_id: program_id
      });
      
      return { message: 'Course assigned to program successfully' };
    } catch (error) {
      throw new Error('Error assigning course to program: ' + error.message);
    }
  },
  
// View courses in a program
viewCoursesInProgram: async (program_id) => {
  try {
    const courses = await Course.findAll({
      where: { program_id: program_id }
    });
    if (!courses) {
      throw new Error('No courses found in this program');
    }
    return courses;
  } catch (error) {
    throw new Error('Error retrieving courses in program: ' + error.message);
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
