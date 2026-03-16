import studentService from '../services/student.service.js';
import { responseSuccess, responseError } from '../common/helpers/response.helper.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studentController = {
  // Create a new student
  createStudent: async (req, res) => {
    try {
      const newStudent = await studentService.createStudent(req.body);
      res.status(201).json(responseSuccess(newStudent, 'Student created successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // Get all students
  getAllStudents: async (req, res) => {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json(responseSuccess(students, 'Students retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  getAllStudentsByProgramId: async (req, res) => {
    const { programId } = req.params;
    try {
      const students = await studentService.getAllStudentsByProgramId(programId);
      res.status(200).json(responseSuccess(students, 'Students retrieved successfully'));
    } catch (error) {
      res.status(500).json(responseError(error.message, 500));
    }
  },

  // Find a student by student_id
  findStudentById: async (req, res) => {
    const { student_id } = req.params;
    try {
      const student = await studentService.findStudentById(student_id);
      res.status(200).json(responseSuccess(student, 'Student found successfully'));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  // Delete a student by student_id
  deleteStudent: async (req, res) => {
    const { student_id } = req.params;
    try {
      const result = await studentService.deleteStudent(student_id);
      res.status(200).json(responseSuccess(null, result.message));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  // Update a student by student_id
  updateStudent: async (req, res) => {
    const { student_id } = req.params;
    try {
      const updatedStudent = await studentService.updateStudent(student_id, req.body);
      res.status(200).json(responseSuccess(updatedStudent, 'Student updated successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // Create students from Excel file
  createStudentsFromExcel: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json(responseError('No Excel file provided', 400));
      }

      const results = await studentService.createMultipleStudentsFromExcel(req.file.path);
      
      return res.status(200).json(responseSuccess({
        successful: results.successful.length,
        failed: results.failed.length,
        details: results
      }, 'Students creation process completed'));
    } catch (error) {
      return res.status(500).json(responseError(error.message, 500));
    }
  },

  // Get all registered modules for a student with attendance rates
  getStudentModulesWithAttendanceRate: async (req, res) => {
    try {
      const { student_id } = req.params;
      const userId = req.user?.uid;
      const userRole = req.user?.role;

      // If user is a student, they can only view their own modules
      if (userRole === 'STUDENT' && student_id !== userId) {
        return res.status(403).json(responseError('Students can only view their own modules', 403));
      }

      const modulesWithAttendanceRate = await studentService.getStudentModulesWithAttendanceRate(student_id);
      
      return res.status(200).json(responseSuccess(
        modulesWithAttendanceRate, 
        'Student modules with attendance rates retrieved successfully'
      ));
    } catch (error) {
      return res.status(500).json(responseError(error.message, 500));
    }
  },

  // Get my registered modules with attendance rates (for authenticated student)
  getMyModulesWithAttendanceRate: async (req, res) => {
    try {
      const studentId = req.user.uid; // Get student ID from authenticated user
      
      const modulesWithAttendanceRate = await studentService.getStudentModulesWithAttendanceRate(studentId);
      
      return res.status(200).json(responseSuccess(
        modulesWithAttendanceRate, 
        'My modules with attendance rates retrieved successfully'
      ));
    } catch (error) {
      return res.status(500).json(responseError(error.message, 500));
    }
  },

  // Get exam eligibility status for a student
  getStudentExamEligibilityStatus: async (req, res) => {
    try {
      const { student_id } = req.params;
      const userId = req.user?.uid;
      const userRole = req.user?.role;

      // If user is a student, they can only view their own exam eligibility
      if (userRole === 'STUDENT' && student_id !== userId) {
        return res.status(403).json(responseError('Students can only view their own exam eligibility status', 403));
      }

      const examEligibilityStatus = await studentService.getStudentExamEligibilityStatus(student_id);
      
      return res.status(200).json(responseSuccess(
        examEligibilityStatus, 
        'Student exam eligibility status retrieved successfully'
      ));
    } catch (error) {
      return res.status(500).json(responseError(error.message, 500));
    }
  },

  // Get my exam eligibility status (for authenticated student)
  getMyExamEligibilityStatus: async (req, res) => {
    try {
      const studentId = req.user.uid; // Get student ID from authenticated user
      
      const examEligibilityStatus = await studentService.getStudentExamEligibilityStatus(studentId);
      
      return res.status(200).json(responseSuccess(
        examEligibilityStatus, 
        'My exam eligibility status retrieved successfully'
      ));
    } catch (error) {
      return res.status(500).json(responseError(error.message, 500));
    }
  },

  // Get student images
  getStudentImages: async (req, res) => {
    try {
      const { student_id } = req.params;
      const userId = req.user?.uid;
      const userRole = req.user?.role;

      // If user is a student, they can only view their own images
      if (userRole === 'STUDENT' && student_id !== userId) {
        return res.status(403).json(responseError('Students can only view their own images', 403));
      }

      const images = await studentService.getStudentImages(student_id);
      res.status(200).json(responseSuccess(images, 'Student images retrieved successfully'));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  // Get my images (for authenticated student)
  getMyImages: async (req, res) => {
    try {
      const studentId = req.user.uid; // Get student ID from authenticated user
      
      const images = await studentService.getStudentImages(studentId);
      
      return res.status(200).json(responseSuccess(
        images, 
        'My images retrieved successfully'
      ));
    } catch (error) {
      return res.status(500).json(responseError(error.message, 500));
    }
  },

  // Create a new image asset for a student
  createStudentImage: async (req, res) => {
    const { student_id } = req.params;
    const { image_path } = req.body;
    
    try {
      const result = await studentService.createStudentImage(student_id, image_path);
      res.status(201).json(responseSuccess(result, 'Student image created successfully'));
    } catch (error) {
      res.status(400).json(responseError(error.message, 400));
    }
  },

  // Get specific image file for a student
  getStudentImageFile: async (req, res) => {
    try {
      const { student_id, image_id } = req.params;
      const userId = req.user?.uid;
      const userRole = req.user?.role;

      // If user is a student, they can only view their own image files
      if (userRole === 'STUDENT' && student_id !== userId) {
        return res.status(403).json(responseError('Students can only view their own image files', 403));
      }

      const imageInfo = await studentService.getStudentImageFile(student_id, image_id);
      
      // Construct the full path to the image file
      const imagePath = path.resolve(__dirname, '../../../..', imageInfo.image_path);
      
      // Check if the file exists
      if (!fs.existsSync(imagePath)) {
        return res.status(404).json(responseError('Image file not found on server', 404));
      }
      
      // Get file extension to set proper content type
      const ext = path.extname(imagePath).toLowerCase();
      let contentType = 'image/jpeg'; // default
      
      switch (ext) {
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        default:
          contentType = 'application/octet-stream';
      }
      
      // Set proper headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(imagePath)}"`);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      
      // Send the file
      res.sendFile(imagePath);
      
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  // Get specific image file metadata for a student
  getStudentImageFileInfo: async (req, res) => {
    try {
      const { student_id, image_id } = req.params;
      const userId = req.user?.uid;
      const userRole = req.user?.role;

      // If user is a student, they can only view their own image file metadata
      if (userRole === 'STUDENT' && student_id !== userId) {
        return res.status(403).json(responseError('Students can only view their own image file metadata', 403));
      }

      const imageInfo = await studentService.getStudentImageFile(student_id, image_id);
      
      // Return just the metadata
      res.status(200).json(responseSuccess(imageInfo, 'Student image file info retrieved successfully'));
    } catch (error) {
      res.status(404).json(responseError(error.message, 404));
    }
  },

  // Get student image file directly by student_id (returns actual image)
  getStudentImageByStudentId: async (req, res) => {
    try {
      const { student_id } = req.params;
      const userId = req.user?.uid;
      const userRole = req.user?.role;

      // If user is a student, they can only view their own image file
      if (userRole === 'STUDENT' && student_id !== userId) {
        return res.status(403).json(responseError('Students can only view their own image file', 403));
      }

      // Construct the image path directly from student_id
      // From backend/src/controllers, go to project root, then to image_assets
      let imagePath = path.resolve(__dirname, '../../../image_assets', `${student_id}.jpg`);
      
      console.log(`Looking for image at: ${imagePath}`); // Debug log
      
      // Check if the file exists
      if (!fs.existsSync(imagePath)) {
        // Try alternative extensions
        const alternatives = ['.png', '.jpeg', '.gif', '.webp'];
        let foundPath = null;
        
        for (const ext of alternatives) {
          const altPath = path.resolve(__dirname, '../../../image_assets', `${student_id}${ext}`);
          console.log(`Checking alternative path: ${altPath}`); // Debug log
          if (fs.existsSync(altPath)) {
            foundPath = altPath;
            break;
          }
        }
        
        if (!foundPath) {
          console.log(`No image found for student ${student_id}`); // Debug log
          return res.status(404).json(responseError('Image file not found for this student', 404));
        }
        
        imagePath = foundPath;
      }
      
      console.log(`Serving image from: ${imagePath}`); // Debug log
      
      // Get file extension to set proper content type
      const ext = path.extname(imagePath).toLowerCase();
      let contentType = 'image/jpeg'; // default
      
      switch (ext) {
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        default:
          contentType = 'application/octet-stream';
      }
      
      // Set proper headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${student_id}${ext}"`);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      
      // Send the file
      res.sendFile(imagePath);
      
    } catch (error) {
      console.error(`Error serving image for student ${student_id}:`, error); // Debug log
      res.status(404).json(responseError(error.message, 404));
    }
  }
};

export default studentController;