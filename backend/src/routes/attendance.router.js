import express from 'express';
import attendanceController from '../controllers/attendanceManagement.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'attendance-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Set file filter to only allow Excel files
const fileFilter = (req, file, cb) => {
  if (file.originalname.toLowerCase().endsWith('.xlsx')) {
    cb(null, true);
  } else {
    cb(new Error('Only XLSX files are allowed!'), false);
  }
};

// Create the multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB max file size
});

const attendanceRouter = express.Router();

// Create and manage attendance records (for Admin or Faculty Assistant)
attendanceRouter.post('/create', verifyTokenAndRole(['ADMIN', 'FACULTY', 'STUDENT']), attendanceController.createAttendance);
attendanceRouter.get('/view', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), attendanceController.viewAttendance);
attendanceRouter.put('/:attendanceId', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.updateAttendance);
attendanceRouter.delete('/:attendanceId', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.deleteAttendance);

// Attendance request management
attendanceRouter.get('/requests', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER']), attendanceController.getAttendanceRequestsByStatus);
attendanceRouter.get('/lecturer/:lecturerId', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER']), attendanceController.viewAttendanceRequestsByLecturerId);

// Attendance correction requests
attendanceRouter.post('/request-correction', verifyTokenAndRole(['STUDENT']), attendanceController.requestAttendanceCorrection);
attendanceRouter.put('/correction/:requestId', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.handleCorrectionRequest);

// Excel upload routes (Faculty Assistant only)
// Standard endpoint with specific field name
attendanceRouter.post(
  '/create-from-excel',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  upload.single('file'),
  attendanceController.createAttendanceFromExcel
);

// Alternative endpoint that can accept any field name
attendanceRouter.post(
  '/upload-excel',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  (req, res, next) => {
    // Using multer directly with any field
    const uploadAny = multer({
      storage,
      fileFilter,
      limits: { fileSize: 1024 * 1024 * 5 }
    }).any();

    uploadAny(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'File upload error',
          error: err.message
        });
      }

      // Take the first file if any exists
      if (req.files && req.files.length > 0) {
        req.file = req.files[0];
      }

      next();
    });
  },
  attendanceController.createAttendanceFromExcel
);

// Endpoint for using a default Excel file
attendanceRouter.post(
  '/create-from-default-excel',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  (req, res, next) => {
    // Set the default Excel file path
    const defaultExcelPath = path.resolve(__dirname, '../../../..', 'FA - Create Attendance List.xlsx');
    req.file = { path: defaultExcelPath };
    next();
  },
  attendanceController.createAttendanceFromExcel
);

// Exam eligibility endpoints
// Get endpoint is accessible to all users with appropriate permissions
attendanceRouter.get('/exam-eligibility', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']), attendanceController.getExamEligibility);
// Update endpoint is restricted to ADMIN and FACULTY only
attendanceRouter.post('/exam-eligibility/module/:moduleId', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.updateExamEligibility);
// Update exam eligibility for all modules at once (Admin/Faculty only)
attendanceRouter.post('/exam-eligibility/update-all-modules', verifyTokenAndRole(['ADMIN', 'FACULTY']), attendanceController.updateExamEligibilityForAllModules);
// Update exam eligibility for lecturer's own modules only (Lecturer only)
attendanceRouter.post('/exam-eligibility/update-my-modules', verifyTokenAndRole(['LECTURER']), attendanceController.updateExamEligibilityForMyModules);
// Export exam eligibility data to Excel files (Admin/Faculty only)
attendanceRouter.post('/exam-eligibility/export', verifyTokenAndRole(['ADMIN', 'FACULTY', 'AC']), attendanceController.exportExamEligibilityToExcel);
// Export exam eligibility data to Excel files for lecturer's modules only (Lecturer only)
attendanceRouter.post('/exam-eligibility/export-my-modules', verifyTokenAndRole(['LECTURER']), attendanceController.exportExamEligibilityForMyModulesToExcel);

export default attendanceRouter;
