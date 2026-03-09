import Student from '../models/Student.model.js'; // Adjust the import path as needed

const studentService = {
  // Create a new student
  createStudent: async (studentData) => {
    try {
      const newStudent = await Student.create(studentData);
      return newStudent;
    } catch (error) {
      throw new Error('Error creating student: ' + error.message);
    }
  },

  // View all students
  getAllStudents: async () => {
    try {
      const students = await Student.findAll();
      return students;
    } catch (error) {
      throw new Error('Error retrieving students: ' + error.message);
    }
  },

  getAllStudentsByProgramId: async (programId) => {
    try {
      const students = await Student.findAll({ where: { program_id: programId } });
      return students;
    } catch (error) {
      throw new Error('Error retrieving students by program id: ' + error.message);
    }
  },

  // Find a student by student_id
  findStudentById: async (student_id) => {
    try {
      const student = await Student.findOne({ where: { student_id } });
      if (!student) {
        throw new Error('Student not found');
      }
      return student;
    } catch (error) {
      throw new Error('Error finding student: ' + error.message);
    }
  },

  // Delete a student by student_id
  deleteStudent: async (student_id) => {
    try {
      const result = await Student.destroy({ where: { student_id } });
      if (result === 0) {
        throw new Error('Student not found');
      }
      return { message: 'Student deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting student: ' + error.message);
    }
  },

  // Update a student by student_id
  updateStudent: async (student_id, updatedData) => {
    try {
      const [updated] = await Student.update(updatedData, {
        where: { student_id },
      });
      if (updated === 0) {
        throw new Error('Student not found or no changes made');
      }
      const updatedStudent = await Student.findOne({ where: { student_id } });
      return updatedStudent;
    } catch (error) {
      throw new Error('Error updating student: ' + error.message);
    }
  },
};

export default studentService;