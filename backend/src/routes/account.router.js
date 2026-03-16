import express from 'express';
import iamController from '../controllers/accountManagement.controller.js';
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

const accountRouter = express.Router();

accountRouter.get('/', iamController.getAllUsers);
accountRouter.get('/:iamId', iamController.getUserById);
accountRouter.post('/create', verifyTokenAndRole(['ADMIN', 'faculty_assistant']), iamController.createUser);
// Endpoint with specific field name
accountRouter.post(
  '/create-students-from-excel',
  verifyTokenAndRole(['ADMIN']),
  upload.single('file'), // Changed field name to 'file' as it's a common default
  iamController.createStudentsFromExcel
);

// Alternative endpoint that can accept any field name - will use the first file it finds
accountRouter.post(
  '/upload-students-excel',
  verifyTokenAndRole(['ADMIN']),
  (req, res, next) => {
    // Using multer directly with any field
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'students-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

    const uploadAny = multer({
      storage,
      fileFilter: (req, file, cb) => {
        if (file.originalname.toLowerCase().endsWith('.xlsx')) {
          cb(null, true);
        } else {
          cb(new Error('Only XLSX files are allowed!'), false);
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
  iamController.createStudentsFromExcel
);
accountRouter.post(
  '/create-students-from-default-excel',
  verifyTokenAndRole(['ADMIN']),
  (req, res, next) => {
    // Set the default Excel file path
    const defaultExcelPath = path.resolve(__dirname, '../../../..', 'list.xlsx');
    req.file = { path: defaultExcelPath };
    next();
  },
  iamController.createStudentsFromExcel
);
accountRouter.post(
  '/create-lecturers-from-excel',
  verifyTokenAndRole(['ADMIN']),
  upload.single('file'),
  iamController.createLecturersFromExcel
);

// Alternative endpoint for lecturers that can accept any field name
accountRouter.post(
  '/upload-lecturers-excel',
  verifyTokenAndRole(['ADMIN']),
  (req, res, next) => {
    // Using multer directly with any field
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'lecturers-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

    const uploadAny = multer({
      storage,
      fileFilter: (req, file, cb) => {
        if (file.originalname.toLowerCase().endsWith('.xlsx')) {
          cb(null, true);
        } else {
          cb(new Error('Only XLSX files are allowed!'), false);
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
  iamController.createLecturersFromExcel
);

// Endpoint for using a default lecturer Excel file
accountRouter.post(
  '/create-lecturers-from-default-excel',
  verifyTokenAndRole(['ADMIN']),
  (req, res, next) => {
    // Set the default Excel file path
    const defaultExcelPath = path.resolve(__dirname, '../../../..', 'Admin - Create Lecturer List.xlsx');
    req.file = { path: defaultExcelPath };
    next();
  },
  iamController.createLecturersFromExcel
);
accountRouter.put('/:iamId', iamController.updateUser);
accountRouter.delete('/:iamId', iamController.deleteUser);

// Change password endpoint - accessible by ADMIN, LECTURER, faculty_assistant, and STUDENT
accountRouter.put(
  '/:iamId/change-password',
  verifyTokenAndRole(['ADMIN', 'LECTURER', 'faculty_assistant', 'STUDENT']),
  iamController.changePassword
);

export default accountRouter;
