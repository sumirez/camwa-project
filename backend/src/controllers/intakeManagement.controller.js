import intakeService from '../services/intake.service.js';

const intakeManagementController = {
  // Create a new intake year
  createIntake: async (req, res) => {
    try {
      // Only admin can access this endpoint (verified by middleware)
      const intakeData = req.body;
      const newIntake = await intakeService.createIntake(intakeData);
      res.status(201).json({
        success: true,
        message: 'Intake created successfully',
        data: newIntake
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get all intake years
  getAllIntakes: async (req, res) => {
    try {
      const intakes = await intakeService.getAllIntakes();
      res.status(200).json({
        success: true,
        data: intakes
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get a specific intake by year
  getIntakeByYear: async (req, res) => {
    try {
      const { year } = req.params;
      const intake = await intakeService.findIntakeByYear(parseInt(year, 10));
      res.status(200).json({
        success: true,
        data: intake
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update an intake
  updateIntake: async (req, res) => {
    try {
      // Only admin can access this endpoint (verified by middleware)
      const { year } = req.params;
      const updatedData = req.body;
      const updatedIntake = await intakeService.updateIntake(parseInt(year, 10), updatedData);
      res.status(200).json({
        success: true,
        message: 'Intake updated successfully',
        data: updatedIntake
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete an intake
  deleteIntake: async (req, res) => {
    try {
      // Only admin can access this endpoint (verified by middleware)
      const { year } = req.params;
      const result = await intakeService.deleteIntake(parseInt(year, 10));
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

export default intakeManagementController;
