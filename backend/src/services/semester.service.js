import Semester from '../models/Semester.model.js';
import { v4 as uuidv4 } from 'uuid';

const semesterService = {
  // Create a new semester
  createSemester: async (semesterData) => {
    try {
      const newSemester = await Semester.create({
        ...semesterData,
        sem_id: semesterData.sem_id || uuidv4()
      });
      return newSemester;
    } catch (error) {
      throw new Error('Error creating semester: ' + error.message);
    }
  },

  // Get all semesters
  getAllSemesters: async () => {
    try {
      const semesters = await Semester.findAll({
        order: [['start_date', 'DESC']]
      });
      return semesters;
    } catch (error) {
      throw new Error('Error retrieving semesters: ' + error.message);
    }
  },

  // Find a semester by ID
  findSemesterById: async (sem_id) => {
    try {
      const semester = await Semester.findOne({ where: { sem_id } });
      if (!semester) {
        throw new Error('Semester not found');
      }
      return semester;
    } catch (error) {
      throw new Error('Error finding semester: ' + error.message);
    }
  },

  // Update a semester
  updateSemester: async (sem_id, updatedData) => {
    try {
      const [updated] = await Semester.update(updatedData, {
        where: { sem_id }
      });
      
      if (updated === 0) {
        throw new Error('Semester not found or no changes made');
      }
      
      const updatedSemester = await Semester.findOne({ where: { sem_id } });
      return updatedSemester;
    } catch (error) {
      throw new Error('Error updating semester: ' + error.message);
    }
  },

  // Delete a semester
  deleteSemester: async (sem_id) => {
    try {
      const deleted = await Semester.destroy({
        where: { sem_id }
      });
      
      if (deleted === 0) {
        throw new Error('Semester not found');
      }
      
      return { message: 'Semester deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting semester: ' + error.message);
    }
  },

  // Get current active semester based on date
  getCurrentSemester: async () => {
    try {
      const currentDate = new Date();
      
      const currentSemester = await Semester.findOne({
        where: {
          start_date: { $lte: currentDate },
          end_date: { $gte: currentDate }
        }
      });
      
      return currentSemester;
    } catch (error) {
      throw new Error('Error finding current semester: ' + error.message);
    }
  }
};

export default semesterService;
