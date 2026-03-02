import express from 'express';
import intakeModuleController from '../controllers/intakeModuleManagement.controller.js';

const intakeModuleRouter = express.Router();

intakeModuleRouter.get('/', intakeModuleController.getAllIntakeModules);
intakeModuleRouter.get('/:moduleId', intakeModuleController.getModuleDetails);
intakeModuleRouter.post('/', intakeModuleController.createIntakeModule);
intakeModuleRouter.delete('/:moduleId', intakeModuleController.deleteIntakeModule);
intakeModuleRouter.put('/:moduleId', intakeModuleController.updateIntakeModule);
intakeModuleRouter.get('/:moduleId/students', intakeModuleController.getModuleStudents);

export default intakeModuleRouter;
