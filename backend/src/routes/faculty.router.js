import express from 'express';
import facilityFacultyController from '../controllers/facultyManagement.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';

const facilityFacultyRouter = express.Router();

facilityFacultyRouter.post('/', verifyTokenAndRole(['ADMIN']), facilityFacultyController.createFacilityFaculty);
facilityFacultyRouter.get('/', verifyTokenAndRole(['ADMIN', 'FACULTY']), facilityFacultyController.getAllFacilityFaculties);
facilityFacultyRouter.get('/:staff_id', verifyTokenAndRole(['ADMIN', 'FACULTY']), facilityFacultyController.findFacilityFacultyById);
facilityFacultyRouter.delete('/:staff_id', verifyTokenAndRole(['ADMIN']), facilityFacultyController.deleteFacilityFaculty);
facilityFacultyRouter.put('/:staff_id', verifyTokenAndRole(['ADMIN', 'FACULTY']), facilityFacultyController.updateFacilityFaculty);

export default facilityFacultyRouter;
