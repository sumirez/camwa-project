import Intake from '../models/Intake.model.js';

const intakeService = {
  // Create a new intake year
  createIntake: async (intakeData) => {
    try {
      const newIntake = await Intake.create(intakeData);
      return newIntake;
    } catch (error) {
      throw new Error('Error creating intake: ' + error.message);
    }
  },

  // Get all intake years
  getAllIntakes: async () => {
    try {
      const intakes = await Intake.findAll({
        order: [['year', 'DESC']]
      });
      return intakes;
    } catch (error) {
      throw new Error('Error retrieving intakes: ' + error.message);
    }
  },

  // Find an intake by year
  findIntakeByYear: async (year) => {
    try {
      const intake = await Intake.findOne({ where: { year } });
      if (!intake) {
        throw new Error('Intake not found');
      }
      return intake;
    } catch (error) {
      throw new Error('Error finding intake: ' + error.message);
    }
  },

  // Update an intake
  updateIntake: async (year, updatedData) => {
    try {
      const [updated] = await Intake.update(updatedData, {
        where: { year }
      });
      
      if (updated === 0) {
        throw new Error('Intake not found or no changes made');
      }
      
      const updatedIntake = await Intake.findOne({ where: { year: updatedData.year || year } });
      return updatedIntake;
    } catch (error) {
      throw new Error('Error updating intake: ' + error.message);
    }
  },

  // Delete an intake
  deleteIntake: async (year) => {
    try {
      const deleted = await Intake.destroy({
        where: { year }
      });
      
      if (deleted === 0) {
        throw new Error('Intake not found');
      }
      
      return { message: 'Intake deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting intake: ' + error.message);
    }
  }
};

export default intakeService;
