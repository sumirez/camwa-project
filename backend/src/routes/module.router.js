import express from 'express';
import moduleController from '../controllers/moduleManagement.controller.js';
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
    cb(null, 'module-' + uniqueSuffix + path.extname(file.originalname));
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

const moduleRouter = express.Router();

// Create a module (Admin only)
moduleRouter.post('/create', verifyTokenAndRole(['ADMIN','FACULTY']), moduleController.createModule); 

// View all modules (Admin/Faculty Assistant)
moduleRouter.get('/view', verifyTokenAndRole(['ADMIN','FACULTY']), moduleController.viewModules);

// Update and delete modules (Admin/Faculty Assistant)
moduleRouter.put('/update/:moduleId', verifyTokenAndRole(['ADMIN']),  moduleController.updateModule); 
moduleRouter.delete('/delete/:moduleId', verifyTokenAndRole(['ADMIN']),  moduleController.deleteModule); 

// Get camera path with temporary signed URL (Admin only)
moduleRouter.get('/camera-path/:moduleId', verifyTokenAndRole(['ADMIN']), moduleController.getCameraPath);

// Set camera path for a module (Admin only)
moduleRouter.put('/set-camera-path/:moduleId', verifyTokenAndRole(['ADMIN']), moduleController.setCameraPath);

// New routes for Excel upload
// Endpoint with specific field name
moduleRouter.post(
  '/create-from-excel', 
  verifyTokenAndRole(['ADMIN','FACULTY']), 
  upload.single('file'),
  moduleController.createModulesFromExcel
);

// Alternative endpoint that can accept any field name
moduleRouter.post(
  '/upload-excel',
  verifyTokenAndRole(['ADMIN','FACULTY']),
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
  moduleController.createModulesFromExcel
);

// Endpoint for using a default Excel file
moduleRouter.post(
  '/create-from-default-excel',
  verifyTokenAndRole(['ADMIN','FACULTY']),
  (req, res, next) => {
    // Set the default Excel file path
    const defaultExcelPath = path.resolve(__dirname, '../../../..', 'Admin - Create Module List.xlsx');
    req.file = { path: defaultExcelPath };
    next();
  },
  moduleController.createModulesFromExcel
);

// Delete modules from Excel file - Endpoint with specific field name
moduleRouter.post(
  '/delete-from-excel', 
  verifyTokenAndRole(['ADMIN']), 
  upload.single('file'),
  moduleController.deleteModulesFromExcel
);

// Delete modules from Excel file - Alternative endpoint that can accept any field name
moduleRouter.post(
  '/delete/upload-excel',
  verifyTokenAndRole(['ADMIN']),
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
  moduleController.deleteModulesFromExcel
);

// Delete modules from a default Excel file
moduleRouter.post(
  '/delete-from-default-excel',
  verifyTokenAndRole(['ADMIN']),
  (req, res, next) => {
    // Set the default Excel file path for deletion
    const defaultExcelPath = path.resolve(__dirname, '../../../..', 'Admin - Delete Module List.xlsx');
    req.file = { path: defaultExcelPath };
    next();
  },
  moduleController.deleteModulesFromExcel
);

export default moduleRouter;
