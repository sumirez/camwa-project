import express from 'express';
import attendanceRouter from './attendance.router.js';
import classRouter from './class.router.js';
import courseRouter from './course.router.js';
import notificationRouter from './notification.router.js';
import authRoutes from './authRoutes.js';
import studentRouter from './student.router.js';
import lecturerRouter from './lecturer.route.js';
import programRouter from './program.router.js';
import intakeModuleRouter from './intakeModule.router.js';
import facilityFacultyRouter from './faculty.router.js';
import testTokenController from '../controllers/testTokenController.js';
import accountRouter from './account.router.js';
import dashboardRouter from './dashboard.router.js';


const rootRoutes = express.Router();

// Default route for the root
rootRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Auth routes
rootRoutes.use('/auth', authRoutes);

// Attendance routes
rootRoutes.use('/attendance', attendanceRouter);

// Class routes
rootRoutes.use('/class', classRouter);

// Course routes
rootRoutes.use('/course', courseRouter);

// Notification routes
rootRoutes.use('/notification', notificationRouter);

//Student routes
rootRoutes.use('/student', studentRouter);

//Lecturer routes
rootRoutes.use('/lecturer', lecturerRouter);

//Program routes
rootRoutes.use('/program', programRouter);

//IntakeModule routes
rootRoutes.use('/intakemodule', intakeModuleRouter);

//Faculty routes
rootRoutes.use('/faculty', facilityFacultyRouter);

//Dashboard routes
rootRoutes.use('/dashboard', dashboardRouter);

//fetchiing jwt token for testing
rootRoutes.post('/test-token', testTokenController.getTestToken);

//Account routes
rootRoutes.use('/account', accountRouter);


export default rootRoutes;
