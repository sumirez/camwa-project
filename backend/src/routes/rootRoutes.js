import express from 'express';
import attendanceRouter from './attendance.router.js';
import moduleRouter from './module.router.js';
import authRoutes from './authRoutes.js';
import studentRouter from './student.router.js';
import lecturerRouter from './lecturer.route.js';
import programRouter from './program.router.js';
import facilityFacultyRouter from './faculty.router.js';
import testTokenController from '../controllers/testTokenController.js';
import accountRouter from './account.router.js';
import dashboardRouter from './dashboard.router.js';
import semesterRouter from './semesterRoutes.js';
import intakeRouter from './intakeRoutes.js';
import moduleRegistrationRoutes from './moduleRegistration.routes.js';
import notificationRouter from './notification.router.js';
import courseRouter from './course.router.js';
import classRouter from './class.router.js';


const rootRoutes = express.Router();

// Default route for the root
rootRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Auth routes
rootRoutes.use('/auth', authRoutes);

// Attendance routes
rootRoutes.use('/attendance', attendanceRouter);


// Module routes
rootRoutes.use('/module', moduleRouter);

//Student routes
rootRoutes.use('/student', studentRouter);

//Lecturer routes
rootRoutes.use('/lecturer', lecturerRouter);

//Program routes
rootRoutes.use('/program', programRouter);

//Faculty routes
rootRoutes.use('/faculty', facilityFacultyRouter);

//Dashboard routes - admin only
rootRoutes.use('/dashboard', dashboardRouter);

//fetchiing jwt token for testing
rootRoutes.post('/test-token', testTokenController.getTestToken);

//Account routes
rootRoutes.use('/account', accountRouter);

rootRoutes.use('/semester', semesterRouter);

rootRoutes.use('/intake', intakeRouter);

rootRoutes.use('/module-registrations', moduleRegistrationRoutes);

// Notification routes
rootRoutes.use('/notifications', notificationRouter);

// Course routes
rootRoutes.use('/course', courseRouter);

// Class routes
rootRoutes.use('/class', classRouter);

export default rootRoutes;
