import express from 'express';
import { verifyTokenAndRole } from '../middleware/authMiddleware.js';
import moduleRegistrationController from '../controllers/moduleRegistration.controller.js';
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
    cb(null, 'registration-' + uniqueSuffix + path.extname(file.originalname));
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

const router = express.Router();

// Admin and faculty routes
router.post('/', verifyTokenAndRole(['ADMIN', 'FACULTY']), moduleRegistrationController.createRegistration);
router.put('/:id', verifyTokenAndRole(['ADMIN', 'FACULTY']), moduleRegistrationController.updateRegistration);
router.delete('/:id', verifyTokenAndRole(['ADMIN', 'FACULTY']), moduleRegistrationController.deleteRegistration);

// Routes accessible by admin, faculty, and lecturers
router.get('/', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER']), moduleRegistrationController.getAllRegistrations);
router.get('/my-modules', verifyTokenAndRole(['LECTURER']), moduleRegistrationController.getMyRegistrationModules);
router.get('/my-registrations', verifyTokenAndRole(['STUDENT']), moduleRegistrationController.getMyRegistrations);
router.get('/all-modules-with-attendance', verifyTokenAndRole(['ADMIN', 'FACULTY']), moduleRegistrationController.getAllModulesWithAttendanceRate);
router.get('/student/:student_id', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER','STUDENT']), moduleRegistrationController.getRegistrationsByStudentId);
router.get('/module/:module_id', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER']), moduleRegistrationController.getRegistrationsByModuleId);
router.get('/lecturer/:lecturer_id', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER','AC']), moduleRegistrationController.getRegistrationsByLecturerId);
// Export student list for a specific module (Admin/Faculty can export any module, Lecturers can only export their own modules)
router.post('/export-student-list/:module_id', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER']), moduleRegistrationController.exportStudentList);
// This route must be last to avoid conflicts with the above specific routes
router.get('/:id', verifyTokenAndRole(['ADMIN', 'FACULTY', 'LECTURER']), moduleRegistrationController.getRegistrationById);

// Excel upload routes (Faculty Assistant only)
// Standard endpoint with specific field name
router.post(
  '/create-from-excel', 
  verifyTokenAndRole(['ADMIN', 'FACULTY']), 
  upload.single('file'),
  moduleRegistrationController.createRegistrationsFromExcel
);

// Alternative endpoint that can accept any field name
router.post(
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
          success: false, 
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
  moduleRegistrationController.createRegistrationsFromExcel
);

// Endpoint for using a default Excel file
router.post(
  '/create-from-default-excel',
  verifyTokenAndRole(['ADMIN', 'FACULTY']),
  (req, res, next) => {
    // Set the default Excel file path
    const defaultExcelPath = path.resolve(__dirname, '../../../..', 'FA - Create Modle Registration List.xlsx');
    req.file = { path: defaultExcelPath };
    next();
  },
  moduleRegistrationController.createRegistrationsFromExcel
);

export default router;
