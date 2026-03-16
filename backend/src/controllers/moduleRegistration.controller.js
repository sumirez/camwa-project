import moduleRegistrationService from '../services/moduleRegistration.service.js';

const moduleRegistrationController = {
  // Create a new module registration
  createRegistration: async (req, res) => {
    try {
      const registrationData = req.body;
      const newRegistration = await moduleRegistrationService.createRegistration(registrationData);
      res.status(201).json({
        success: true,
        message: 'Module registration created successfully',
        data: newRegistration
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get all registrations
  getAllRegistrations: async (req, res) => {
    try {
      const registrations = await moduleRegistrationService.getAllRegistrations();
      res.status(200).json({
        success: true,
        data: registrations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get registration by ID
  getRegistrationById: async (req, res) => {
    try {
      const { id } = req.params;
      const registration = await moduleRegistrationService.findRegistrationById(parseInt(id, 10));
      res.status(200).json({
        success: true,
        data: registration
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get registrations by student ID
  getRegistrationsByStudentId: async (req, res) => {
    try {
      const { student_id } = req.params;
      const userId = req.user?.uid;
      const userRole = req.user?.role;

      // If user is a student, they can only view their own registrations
      if (userRole === 'STUDENT' && student_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Students can only view their own registrations'
        });
      }

      const registrations = await moduleRegistrationService.findRegistrationsByStudentId(student_id);
      res.status(200).json({
        success: true,
        data: registrations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get registrations by module ID
  getRegistrationsByModuleId: async (req, res) => {
    try {
      const { module_id } = req.params;
      const registrations = await moduleRegistrationService.findRegistrationsByModuleId(module_id);
      res.status(200).json({
        success: true,
        data: registrations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },
  // Get registrations by lecturer ID with student counts
  getRegistrationsByLecturerId: async (req, res) => {
    try {
      const { lecturer_id } = req.params;
      const userRole = req.user.role;
      const authenticatedLecturerId = req.user.uid;
      
      // For LECTURER role, only allow viewing their own classes
      // For ADMIN/FACULTY roles, allow viewing any lecturer's classes
      let targetLecturerId = lecturer_id;
      if (userRole === 'LECTURER') {
        // Lecturers can only view their own classes
        if (lecturer_id !== authenticatedLecturerId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: You can only view your own classes'
          });
        }
        targetLecturerId = authenticatedLecturerId;
      }
        const lecturerModules = await moduleRegistrationService.getLecturerModulesWithStudentCount(targetLecturerId);
      res.status(200).json({
        success: true,
        message: 'Lecturer modules with student counts and attendance rates retrieved successfully',
        data: lecturerModules
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get my registration modules (for authenticated lecturer)
  getMyRegistrationModules: async (req, res) => {
    try {
      const lecturer_id = req.user.uid; // Get lecturer ID from authenticated user      const lecturerModules = await moduleRegistrationService.getLecturerModulesWithStudentCount(lecturer_id);
      res.status(200).json({
        success: true,
        message: 'My modules with student counts and attendance rates retrieved successfully',
        data: lecturerModules
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get my registrations (for authenticated student)
  getMyRegistrations: async (req, res) => {
    try {
      const student_id = req.user.uid; // Get student ID from authenticated user
      
      const registrations = await moduleRegistrationService.findRegistrationsByStudentId(student_id);
      res.status(200).json({
        success: true,
        message: 'My registrations retrieved successfully',
        data: registrations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get all registration modules with attendance rates (Admin/Faculty only)
  getAllModulesWithAttendanceRate: async (req, res) => {
    try {
      const allModules = await moduleRegistrationService.getAllModulesWithStudentCountAndAttendanceRate();
      res.status(200).json({
        success: true,
        message: 'All registered modules with student counts and attendance rates retrieved successfully',
        data: allModules
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update a registration
  updateRegistration: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedRegistration = await moduleRegistrationService.updateRegistration(parseInt(id, 10), updatedData);
      res.status(200).json({
        success: true,
        message: 'Module registration updated successfully',
        data: updatedRegistration
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete a registration
  deleteRegistration: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await moduleRegistrationService.deleteRegistration(parseInt(id, 10));
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create registrations from Excel file (Faculty Assistant only)
  createRegistrationsFromExcel: async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No Excel file uploaded. Make sure to include a file field with your Excel file.'        });
      }

      console.log('File uploaded:', req.file);
      console.log('File path:', req.file.path);
      
      // Process the Excel file and create registrations
      const results = await moduleRegistrationService.createRegistrationsFromExcel(req.file.path);
      
      res.status(201).json({
        success: true,
        message: `Created ${results.successful.length} registrations successfully. ${results.failed.length} failed.`,
        data: results
      });
    } catch (error) {
      console.error('Error processing Excel file:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Export student list of a module to Excel file
  exportStudentList: async (req, res) => {
    try {
      const { module_id } = req.params;
      const userRole = req.user?.role;
      const userId = req.user?.uid;

      if (!module_id) {
        return res.status(400).json({
          success: false,
          message: 'Module ID is required'
        });
      }

      let lecturerId = null;

      // If user is a lecturer, they can only export their own modules
      if (userRole === 'LECTURER') {
        lecturerId = userId;
        
        // Verify the lecturer teaches this module
        const lecturerModules = await moduleRegistrationService.findRegistrationsByModuleId(module_id);
        const hasAccess = lecturerModules.some(reg => reg.lecturer_id === lecturerId);
        
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: 'You can only export student lists for modules you teach'
          });
        }
      }

      // Export the student list
      const exportResult = await moduleRegistrationService.exportStudentListToExcel(module_id, lecturerId);
      
      res.status(200).json({
        success: true,
        message: `Student list exported successfully for module ${module_id}. File contains ${exportResult.studentsCount} students.`,
        data: {
          module_id: exportResult.module_id,
          module_name: exportResult.module_name,
          lecturer_id: exportResult.lecturer_id,
          lecturer_name: exportResult.lecturer_name,
          fileName: exportResult.fileName,
          filePath: exportResult.filePath,
          studentsCount: exportResult.studentsCount,
          exportDirectory: exportResult.exportDirectory
        }
      });
    } catch (error) {
      console.error('Error exporting student list:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default moduleRegistrationController;
