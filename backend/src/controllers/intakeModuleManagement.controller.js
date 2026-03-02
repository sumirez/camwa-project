import intakeModuleService from '../services/intakeModule.service.js';
import { responseSuccess, responseError } from '../common/helpers/response.helper.js';

const intakeModuleController = {
  getAllIntakeModules: async (req, res) => {
    try {
      const { filteredActive } = req.query;
      const modules = await intakeModuleService.getAllIntakeModules(filteredActive === 'true');
      res.status(200).json(responseSuccess(modules, 'Intake modules retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  getModuleDetails: async (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleDetails = await intakeModuleService.getModuleDetails(moduleId);
      res.status(200).json(responseSuccess(moduleDetails, 'Module details retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  createIntakeModule: async (req, res) => {
    try {
      const moduleData = req.body;
      const newModule = await intakeModuleService.createIntakeModule(moduleData);
      res.status(201).json(responseSuccess(newModule, 'Intake module created successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },
  
  deleteIntakeModule: async (req, res) => {
    try {
      const { moduleId } = req.params;
      await intakeModuleService.deleteIntakeModule(moduleId);
      res.status(200).json(responseSuccess(null, 'Intake module deleted successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  updateIntakeModule: async (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleData = req.body;
      const updatedModule = await intakeModuleService.updateIntakeModule(moduleId, moduleData);
      res.status(200).json(responseSuccess(updatedModule, 'Intake module updated successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  getModuleStudents: async (req, res) => {
    try {
      const { moduleId } = req.params;
      const students = await intakeModuleService.getModuleStudents(moduleId);
      res.status(200).json(responseSuccess(students, 'Module students retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  }
  
};

export default intakeModuleController;
