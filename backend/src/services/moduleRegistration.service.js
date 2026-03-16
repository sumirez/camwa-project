import ModuleRegistration from '../models/ModuleRegistration.model.js';
import Student from '../models/Student.model.js';
import Module from '../models/Module.model.js';
import Semester from '../models/Semester.model.js';
import Program from '../models/Program.model.js';
import Lecturer from '../models/Lecturer.model.js';
import Attendance from '../models/Attendance.model.js';
import sequelize from '../common/sequelize/connect.sequelize.js';
import { Op } from 'sequelize';

const moduleRegistrationService = {
  // Create a new module registration
  createRegistration: async (registrationData) => {
    try {
      const newRegistration = await ModuleRegistration.create(registrationData);
      return newRegistration;
    } catch (error) {
      throw new Error('Error creating module registration: ' + error.message);
    }
  },
  // Get all registrations
  getAllRegistrations: async () => {
    try {
      const registrations = await ModuleRegistration.findAll({
        include: [
          { model: Student, attributes: ['student_id', 'name'] },
          { 
            model: Module, 
            attributes: ['module_id', 'name', 'semester_id', 'program_id'],
            include: [
              { model: Semester, attributes: ['sem_id', 'start_date', 'end_date'] },
              { model: Program, attributes: ['program_id', 'name'] }
            ]
          },
          { model: Lecturer, attributes: ['lecturer_id', 'name'] }
        ],
        order: [['created_at', 'DESC']]
      });
      return registrations;
    } catch (error) {
      throw new Error('Error retrieving module registrations: ' + error.message);
    }
  },
  // Find registration by ID
  findRegistrationById: async (module_reg_id) => {
    try {
      const registration = await ModuleRegistration.findOne({
        where: { module_reg_id },
        include: [
          { model: Student, attributes: ['student_id', 'name'] },
          { 
            model: Module, 
            attributes: ['module_id', 'name', 'semester_id', 'program_id'],
            include: [
              { model: Semester, attributes: ['sem_id', 'start_date', 'end_date'] },
              { model: Program, attributes: ['program_id', 'name'] }
            ]
          },
          { model: Lecturer, attributes: ['lecturer_id', 'name'] }
        ]
      });
      
      if (!registration) {
        throw new Error('Module registration not found');
      }
      
      return registration;
    } catch (error) {
      throw new Error('Error finding module registration: ' + error.message);
    }
  },  // Find registrations by student ID
  findRegistrationsByStudentId: async (student_id) => {
    try {
      const registrations = await ModuleRegistration.findAll({
        where: { student_id },
        include: [
          { 
            model: Module, 
            attributes: ['module_id', 'name', 'semester_id', 'program_id'], 
          }
        ],
        order: [['created_at', 'DESC']]      
      });
      
      return registrations;
    } catch (error) {
      throw new Error('Error finding student registrations: ' + error.message);
    }
  },
  // Find registrations by module ID
  findRegistrationsByModuleId: async (module_id) => {
    try {
      const registrations = await ModuleRegistration.findAll({
        where: { module_id },
        include: [
          { model: Student, attributes: ['student_id', 'name'] },
          { 
            model: Module, 
            attributes: ['module_id', 'name', 'semester_id', 'program_id'],
            include: [
              { model: Semester, attributes: ['sem_id', 'start_date', 'end_date'] },
              { model: Program, attributes: ['program_id', 'name'] }
            ]
          },
          { model: Lecturer, attributes: ['lecturer_id', 'name'] }
        ],
        order: [['created_at', 'DESC']]
      });
      
      return registrations;
    } catch (error) {
      throw new Error('Error finding module registrations: ' + error.message);
    }
  },  // Get lecturer's modules with student counts and attendance rates
  getLecturerModulesWithStudentCount: async (lecturer_id) => {
    try {
      const registrations = await ModuleRegistration.findAll({
        where: { lecturer_id },
        attributes: [
          'module_id',
          [sequelize.fn('COUNT', sequelize.col('ModuleRegistration.student_id')), 'student_count']
        ],
        include: [
          { 
            model: Module, 
            attributes: ['module_id', 'name', 'semester_id', 'program_id'],
          }
        ],
        group: [
          'ModuleRegistration.module_id', 
          'Module.module_id',
          'Module.name',
          'Module.semester_id', 
          'Module.program_id'
        ],
        order: [[{ model: Module }, 'name', 'ASC']]
      });
      
      // Calculate attendance rate for each module
      const modulesWithAttendanceRate = await Promise.all(
        registrations.map(async (registration) => {
          const moduleId = registration.module_id;
          
          // Get total attendance records for this module
          const totalAttendanceCount = await Attendance.count({
            where: { module_id: moduleId }
          });
            // Get non-absent attendance records for this module (present, late, excused)
          const nonAbsentAttendanceCount = await Attendance.count({
            where: { 
              module_id: moduleId,
              attendance_status: {
                [Op.in]: ['present', 'late', 'excused']
              }
            }
          });

          const absentCount = totalAttendanceCount - nonAbsentAttendanceCount;

          // Calculate attendance rate
          const attendanceRate = totalAttendanceCount > 0 
            ? ((nonAbsentAttendanceCount / totalAttendanceCount) * 100).toFixed(2)
            : '0.00';
          
          return {
            ...registration.toJSON(),
            attendance_rate: `${attendanceRate}%`,
            total_attendance_records: totalAttendanceCount,
            absent_count: absentCount
          };
        })
      );
      
      return modulesWithAttendanceRate;
    } catch (error) {
      throw new Error('Error finding lecturer modules with student count and attendance rate: ' + error.message);
    }
  },

  // Get all modules with student counts and attendance rates (Admin/Faculty only)
  getAllModulesWithStudentCountAndAttendanceRate: async () => {
    try {
      const registrations = await ModuleRegistration.findAll({
        attributes: [
          'module_id',
          'lecturer_id',
          [sequelize.fn('COUNT', sequelize.col('ModuleRegistration.student_id')), 'student_count']
        ],
        include: [
          { 
            model: Module, 
            attributes: ['module_id', 'name', 'semester_id', 'program_id'],
          },
          { 
            model: Lecturer, 
            attributes: ['lecturer_id', 'name']
          }
        ],
        group: [
          'ModuleRegistration.module_id',
          'ModuleRegistration.lecturer_id',
          'Module.module_id',
          'Module.name',
          'Module.semester_id', 
          'Module.program_id',
          'Lecturer.lecturer_id',
          'Lecturer.name'
        ],
        order: [[{ model: Module }, 'name', 'ASC']]
      });
      
      // Calculate attendance rate for each module
      const modulesWithAttendanceRate = await Promise.all(
        registrations.map(async (registration) => {
          const moduleId = registration.module_id;
          
          // Get total attendance records for this module
          const totalAttendanceCount = await Attendance.count({
            where: { module_id: moduleId }
          });
          
          // Get non-absent attendance records for this module (present, late, excused)
          const nonAbsentAttendanceCount = await Attendance.count({
            where: { 
              module_id: moduleId,
              attendance_status: {
                [Op.in]: ['present', 'late', 'excused']
              }
            }
          });

          const absentCount = totalAttendanceCount - nonAbsentAttendanceCount;

          // Calculate attendance rate
          const attendanceRate = totalAttendanceCount > 0 
            ? ((nonAbsentAttendanceCount / totalAttendanceCount) * 100).toFixed(2)
            : '0.00';
          
          return {
            ...registration.toJSON(),
            attendance_rate: `${attendanceRate}%`,
            total_attendance_records: totalAttendanceCount,
            absent_count: absentCount
          };
        })
      );
      
      return modulesWithAttendanceRate;
    } catch (error) {
      throw new Error('Error finding all modules with student count and attendance rate: ' + error.message);
    }
  },

  // Update a registration
  updateRegistration: async (module_reg_id, updatedData) => {
    try {
      const [updated] = await ModuleRegistration.update(updatedData, {
        where: { module_reg_id }
      });
      
      if (updated === 0) {
        throw new Error('Module registration not found or no changes made');
      }
        const updatedRegistration = await ModuleRegistration.findOne({
        where: { module_reg_id },
        include: [
          { model: Student, attributes: ['student_id', 'name'] },
          { 
            model: Module, 
            attributes: ['module_id', 'name', 'semester_id', 'program_id'],
            include: [
              { model: Semester, attributes: ['sem_id', 'start_date', 'end_date'] },
              { model: Program, attributes: ['program_id', 'name'] }
            ]
          },
          { model: Lecturer, attributes: ['lecturer_id', 'name'] }
        ]
      });
      
      return updatedRegistration;
    } catch (error) {
      throw new Error('Error updating module registration: ' + error.message);
    }
  },

  // Delete a registration
  deleteRegistration: async (module_reg_id) => {
    try {
      const deleted = await ModuleRegistration.destroy({
        where: { module_reg_id }
      });
      
      if (deleted === 0) {
        throw new Error('Module registration not found');
      }
      
      return { message: 'Module registration deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting module registration: ' + error.message);
    }
  },
  // Create multiple module registrations from Excel file
  createRegistrationsFromExcel: async (filePath) => {
    try {
      const fs = await import('fs/promises');
      
      // Check if file exists before attempting to read
      try {
        await fs.access(filePath);
        console.log(`Excel file exists at: ${filePath}`);
      } catch (fileError) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      const Excel = (await import('exceljs')).default;
      const workbook = new Excel.Workbook();
      
      console.log(`Attempting to read Excel file from: ${filePath}`);
      
      // Parse the Excel file
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];
      
      console.log(`Excel file loaded successfully with ${worksheet.rowCount} rows`);
      
      const results = {
        successful: [],
        failed: []
      };
        // Skip the header row and process each row
      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        // Map CSV columns based on the format: StudentID,Email,Intake,Program,Name,moduleId,ModuleName,lecturer,semester
        const student_id = row.getCell(1).value?.toString(); // StudentID
        const module_id = row.getCell(6).value?.toString(); // moduleId
        const lecturer_id = row.getCell(8).value?.toString(); // lecturer
        
        // Skip empty rows or rows with missing required fields
        if (!student_id || !module_id || !lecturer_id) {
          console.log(`Skipping row ${i} due to missing required fields`);
          results.failed.push({
            row: i,
            error: 'Missing required fields (student_id, module_id, lecturer_id)'
          });
          continue;
        }
        
        try {
          // Verify that the module exists and get its details
          const moduleExists = await Module.findOne({
            where: { module_id },
            include: [
              { model: Semester, attributes: ['sem_id', 'start_date', 'end_date'] },
              { model: Program, attributes: ['program_id', 'name'] }
            ]
          });
          
          if (!moduleExists) {
            results.failed.push({
              student_id,
              module_id,
              error: 'Module not found'
            });
            continue;
          }
          
          // Create registration record with only the required fields
          const registrationData = {
            student_id,
            module_id,
            lecturer_id
          };
          
          // Check if registration already exists
          const existingRegistration = await ModuleRegistration.findOne({
            where: {
              student_id,
              module_id
            }
          });
          
          if (existingRegistration) {
            results.failed.push({
              student_id,
              module_id,
              error: 'Registration already exists'
            });
            continue;
          }
          
          // Use the existing createRegistration method
          const newRegistration = await moduleRegistrationService.createRegistration(registrationData);
          
          results.successful.push({
            module_reg_id: newRegistration.module_reg_id,
            student_id: newRegistration.student_id,
            module_id: newRegistration.module_id,
            lecturer_id: newRegistration.lecturer_id
          });
        } catch (error) {
          console.error(`Error creating registration at row ${i}:`, error);
          results.failed.push({
            student_id,
            module_id,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error creating registrations from Excel file:', error);
      throw new Error('Error creating registrations from Excel file: ' + error.message);
    }
  },

  // Export student list of a module to Excel file
  exportStudentListToExcel: async (moduleId, lecturerId = null) => {
    try {
      const path = await import('path');
      const fs = await import('fs/promises');
      const Excel = (await import('exceljs')).default;

      // Build query conditions
      const whereCondition = { module_id: moduleId };
      if (lecturerId) {
        whereCondition.lecturer_id = lecturerId;
      }

      // Get all registrations for the module
      const registrations = await ModuleRegistration.findAll({
        where: whereCondition,
        include: [
          { 
            model: Student, 
            attributes: ['student_id', 'name'] 
          },
          { 
            model: Module, 
            attributes: ['module_id', 'name'] 
          },
          { 
            model: Lecturer, 
            attributes: ['lecturer_id', 'name'] 
          }
        ],
        order: [['student_id', 'ASC']]
      });

      if (registrations.length === 0) {
        throw new Error(`No students found for module ${moduleId}${lecturerId ? ` with lecturer ${lecturerId}` : ''}`);
      }

      // Create the export directory if it doesn't exist
      const exportDir = path.resolve(process.cwd(), 'student lists');
      try {
        await fs.access(exportDir);
      } catch {
        await fs.mkdir(exportDir, { recursive: true });
      }

      // Get module info from the first registration
      const moduleInfo = registrations[0].Module;
      const lecturerInfo = registrations[0].Lecturer;

      // Create Excel workbook and worksheet
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(`${moduleId}_Student_List`);

      // Set up headers
      worksheet.columns = [
        { header: 'Module ID', key: 'module_id', width: 15 },
        { header: 'Module Name', key: 'module_name', width: 30 },
        { header: 'Lecturer ID', key: 'lecturer_id', width: 15 },
        { header: 'Student ID', key: 'student_id', width: 15 },
        { header: 'Student Name', key: 'student_name', width: 25 },
        { header: 'Created At', key: 'created_at', width: 20 },
        { header: 'Updated At', key: 'updated_at', width: 20 }
      ];

      // Style the headers
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Add data to worksheet
      registrations.forEach(registration => {
        const row = worksheet.addRow({
          module_id: moduleId,
          module_name: moduleInfo.name,
          lecturer_id: registration.lecturer_id,
          student_id: registration.student_id,
          student_name: registration.Student.name,
          created_at: registration.created_at?.toISOString().split('T')[0] || 'N/A',
          updated_at: registration.updated_at?.toISOString().split('T')[0] || 'N/A'
        });
        
        // Add alternating row colors for better readability
        if (row.number % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F8F8' }
          };
        }
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = Math.max(column.width || 10, 12);
      });

      // Save the file with naming pattern: Student_List_of_{module_id}.xlsx
      const fileName = `Student_List_of_${moduleId}.xlsx`;
      const filePath = path.join(exportDir, fileName);
      await workbook.xlsx.writeFile(filePath);      return {
        module_id: moduleId,
        module_name: moduleInfo.name,
        lecturer_id: registrations[0].lecturer_id,
        lecturer_name: lecturerInfo.name,
        fileName: fileName,
        filePath: filePath,
        studentsCount: registrations.length,
        exportDirectory: exportDir
      };

    } catch (error) {
      console.error('Error exporting student list to Excel:', error);
      throw new Error('Error exporting student list to Excel: ' + error.message);
    }
  },
};

export default moduleRegistrationService;
