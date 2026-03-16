import express from 'express';
import studentController from '../controllers/student.controller.js';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
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

const studentRouter = express.Router();

studentRouter.post('/create', verifyTokenAndRole(['ADMIN', 'FACULTY']), studentController.createStudent);
studentRouter.get('/all', studentController.getAllStudents);
studentRouter.get('/:programId', studentController.getAllStudentsByProgramId);
studentRouter.get('/:student_id', studentController.findStudentById);
studentRouter.delete('/:student_id', studentController.deleteStudent);
studentRouter.put('/:student_id', studentController.updateStudent);

// Student-specific API endpoints
// Get student's registered modules with attendance rates
studentRouter.get('/:student_id/modules-with-attendance',
  verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']),
  studentController.getStudentModulesWithAttendanceRate
);

// Get my modules with attendance rates (for authenticated student)
studentRouter.get('/my/modules-with-attendance',
  verifyTokenAndRole(['STUDENT']),
  studentController.getMyModulesWithAttendanceRate
);

// Get student's exam eligibility status
studentRouter.get('/:student_id/exam-eligibility-status',
  verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']),
  studentController.getStudentExamEligibilityStatus
);

// Get my exam eligibility status (for authenticated student)
studentRouter.get('/my/exam-eligibility-status',
  verifyTokenAndRole(['STUDENT']),
  studentController.getMyExamEligibilityStatus
);

// Get student images
studentRouter.get('/:student_id/images',
  verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']),
  studentController.getStudentImages
);

// Get my images (for authenticated student)
studentRouter.get('/my/images',
  verifyTokenAndRole(['STUDENT']),
  studentController.getMyImages
);

// Create a new image asset for a student
studentRouter.post('/:student_id/images',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  studentController.createStudentImage
);

// Get specific image file info for a student
studentRouter.get('/:student_id/images/:image_id',
  verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']),
  studentController.getStudentImageFile
);

// Get specific image file metadata only for a student
studentRouter.get('/:student_id/images/:image_id/info',
  verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']),
  studentController.getStudentImageFileInfo
);

// Get student image file directly by student_id (returns actual image)
studentRouter.get('/:student_id/image',
  verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER', 'STUDENT']),
  studentController.getStudentImageByStudentId
);

// New endpoints for Excel upload

// Endpoint with specific field name
studentRouter.post(
  '/create-from-excel',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  upload.single('file'),
  studentController.createStudentsFromExcel
);

// Alternative endpoint that can accept any field name
studentRouter.post(
  '/upload-excel',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  (req, res, next) => {
    // Using multer directly with any field
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'student-records-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

    const uploadAny = multer({
      storage,
      fileFilter: (req, file, cb) => {
        if (file.originalname.toLowerCase().endsWith('.csv')) {
          cb(null, true);
        } else {
          cb(new Error('Only CSV files are allowed!'), false);
        }
      }
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
  studentController.createStudentsFromExcel
);

// Endpoint for using a default Excel file
studentRouter.post(
  '/create-from-default-excel',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  (req, res, next) => {
    // Set the default Excel file path
    const defaultExcelPath = path.resolve(__dirname, '../../../..', 'FA - Create Student List.xlsx');
    req.file = { path: defaultExcelPath };
    next();
  },
  studentController.createStudentsFromExcel
);

export default studentRouter;