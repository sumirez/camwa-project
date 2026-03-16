import semesterService from '../services/semester.service.js';

const semesterManagementController = {
  // Create a new semester
  createSemester: async (req, res) => {
    try {
      // Only admin can access this endpoint (verified by middleware)
      const semesterData = req.body;
      const newSemester = await semesterService.createSemester(semesterData);
      res.status(201).json({
        success: true,
        message: 'Semester created successfully',
        data: newSemester
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get all semesters
  getAllSemesters: async (req, res) => {
    try {
      const semesters = await semesterService.getAllSemesters();
      res.status(200).json({
        success: true,
        data: semesters
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get a specific semester by ID
  getSemesterById: async (req, res) => {
    try {
      const { sem_id } = req.params;
      const semester = await semesterService.findSemesterById(sem_id);
      res.status(200).json({
        success: true,
        data: semester
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get current active semester
  getCurrentSemester: async (req, res) => {
    try {
      const currentSemester = await semesterService.getCurrentSemester();
      
      if (!currentSemester) {
        return res.status(404).json({
          success: false,
          message: 'No active semester found for the current date'
        });
      }
      
      res.status(200).json({
        success: true,
        data: currentSemester
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update a semester
  updateSemester: async (req, res) => {
    try {
      // Only admin can access this endpoint (verified by middleware)
      const { sem_id } = req.params;
      const updatedData = req.body;
      const updatedSemester = await semesterService.updateSemester(sem_id, updatedData);
      res.status(200).json({
        success: true,
        message: 'Semester updated successfully',
        data: updatedSemester
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete a semester
  deleteSemester: async (req, res) => {
    try {
      // Only admin can access this endpoint (verified by middleware)
      const { sem_id } = req.params;
      const result = await semesterService.deleteSemester(sem_id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default semesterManagementController;
