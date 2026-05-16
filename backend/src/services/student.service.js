import Student from '../models/Student.model.js'; // Adjust the import path as needed
import ModuleRegistration from '../models/ModuleRegistration.model.js';
import IntakeModule from '../models/IntakeModule.model.js';
import Exam from '../models/Exam.model.js';
import Attendance from '../models/Attendance.model.js';
import ImageAsset from '../models/ImageAsset.model.js';
import Iam from '../models/Iam.model.js';
import attendanceService from './attendance.service.js';

const studentService = {
  // Create a new student
  createStudent: async (studentData) => {
    try {
      const newStudent = await Student.create(studentData);
      return newStudent;
    } catch (error) {
      throw new Error('Error creating student: ' + error.message);
    }
  },

  // View all students
  getAllStudents: async () => {
    try {
      const students = await Student.findAll();
      return students;
    } catch (error) {
      throw new Error('Error retrieving students: ' + error.message);
    }
  },

  getAllStudentsByProgramId: async (programId) => {
    try {
      const students = await Student.findAll({ where: { program_id: programId } });
      return students;
    } catch (error) {
      throw new Error('Error retrieving students by program id: ' + error.message);
    }
  },

  // Find a student by student_id
  findStudentById: async (student_id) => {
    try {
      const student = await Student.findOne({ where: { student_id } });
      if (!student) {
        throw new Error('Student not found');
      }
      return student;
    } catch (error) {
      throw new Error('Error finding student: ' + error.message);
    }
  },

  // Delete a student by student_id
  deleteStudent: async (student_id) => {
    try {
      const result = await Student.destroy({ where: { student_id } });
      if (result === 0) {
        throw new Error('Student not found');
      }
      return { message: 'Student deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting student: ' + error.message);
    }
  },

  // Update a student by student_id
  updateStudent: async (student_id, updatedData) => {
    try {
      const [updated] = await Student.update(updatedData, {
        where: { student_id },
      });
      if (updated === 0) {
        throw new Error('Student not found or no changes made');
      }
      const updatedStudent = await Student.findOne({ where: { student_id } });
      return updatedStudent;
    } catch (error) {
      throw new Error('Error updating student: ' + error.message);
    }
  },

  // Create multiple students from Excel file
  createMultipleStudentsFromExcel: async (filePath) => {
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
        const studentId = row.getCell(1).value?.toString();
        const email = row.getCell(2).value?.toString();
        const intake = row.getCell(3).value?.toString();
        const programId = row.getCell(4).value?.toString();
        const name = row.getCell(5).value?.toString();
        const mapLocation = row.getCell(6).value?.toString();
        
        // Skip empty rows
        if (!studentId || !name) continue;
        
        try {
          // Create student record
          const studentData = {
            student_id: studentId,
            name: name,
            map_location: mapLocation || '',
            program_id: programId,
            intake: parseInt(intake)
          };
          
          // Use the existing createStudent method to create each student record
          const newStudent = await studentService.createStudent(studentData);
          results.successful.push({
            studentId: newStudent.student_id,
            name: newStudent.name,
            programId: newStudent.program_id,
            intake: newStudent.intake
          });
        } catch (error) {
          results.failed.push({
            studentId,
            name,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      throw new Error('Error creating students from CSV: ' + error.message);
    }
  },

  // Get all registered modules for a student with attendance rates
  getStudentModulesWithAttendanceRate: async (studentId) => {
    try {
      const registrations = await ModuleRegistration.findAll({
        where: { student_id: studentId },
        include: [
          {
            model: IntakeModule,
            attributes: ['intake_module_id', 'program_id', 'intake', 'semester_id', 'course_id', 'lecturer_id']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      if (!registrations || registrations.length === 0) {
        return [];
      }      // Calculate attendance rate for each module
      const modulesWithAttendanceRate = await Promise.all(
        registrations.map(async (registration) => {          try {
            // Get attendance records to calculate detailed stats
            const attendanceRecords = await Attendance.findAll({
              where: {
                student_id: studentId,
                intake_module_id: registration.intake_module_id
              }
            });

            let attendanceRate = 0;
            let totalClasses = 0;
            let attendedClasses = 0;

            if (attendanceRecords.length > 0) {
              totalClasses = attendanceRecords.length;
              attendedClasses = attendanceRecords.filter(record => 
                record.attendance_status === 'present' || 
                record.attendance_status === 'late' || 
                record.attendance_status === 'excused'
              ).length;
              attendanceRate = parseFloat(((attendedClasses / totalClasses) * 100).toFixed(2));
            }
            
            return {
              module_reg_id: registration.module_reg_id,
              intake_module_id: registration.intake_module_id,
              lecturer_id: registration.IntakeModule?.lecturer_id || null,
              program_id: registration.IntakeModule?.program_id || null,
              intake: registration.IntakeModule?.intake || null,
              semester_id: registration.IntakeModule?.semester_id || null,
              attendance_rate: attendanceRate,
              total_classes: totalClasses,
              attended_classes: attendedClasses,
              registration_date: registration.created_at
            };
          } catch (error) {
            // If attendance calculation fails, still return module info with 0% attendance
            return {
              module_reg_id: registration.module_reg_id,
              intake_module_id: registration.intake_module_id,
              lecturer_id: registration.IntakeModule?.lecturer_id || null,
              program_id: registration.IntakeModule?.program_id || null,
              intake: registration.IntakeModule?.intake || null,
              semester_id: registration.IntakeModule?.semester_id || null,
              attendance_rate: 0,
              total_classes: 0,
              attended_classes: 0,
              registration_date: registration.created_at,
              error: 'Could not calculate attendance rate: ' + error.message
            };
          }
        })
      );

      return modulesWithAttendanceRate;
    } catch (error) {
      throw new Error('Error retrieving student modules with attendance rates: ' + error.message);
    }
  },

  // Get exam eligibility status for all modules a student is in the exam table
  getStudentExamEligibilityStatus: async (studentId) => {
    try {
      // First, get all exam records for this student
      const examRecords = await Exam.findAll({
        where: { student_id: studentId },
        include: [
          {
            model: IntakeModule,
            attributes: ['intake_module_id', 'program_id', 'intake', 'semester_id', 'course_id', 'lecturer_id'],
            required: false
          }
        ],
        order: [['created_at', 'DESC']]
      });

      if (!examRecords || examRecords.length === 0) {
        return {
          message: "Currently there is no update about any exams for this student",
          exam_records: []
        };
      }

      // Process each exam record
      const examStatus = examRecords.map((examRecord) => {
        const isEligible = examRecord.is_eligible;
        const attendanceRate = examRecord.attendance_rate;
        
        let statusMessage;
        if (isEligible) {
          statusMessage = `This student is eligible for the exam in intake module ${examRecord.IntakeModule?.intake_module_id || examRecord.intake_module_id}`;
        } else {
          statusMessage = `This student is not eligible for the exam in intake module ${examRecord.IntakeModule?.intake_module_id || examRecord.intake_module_id}`;
        }

        return {
          exam_id: examRecord.exam_id,
          intake_module_id: examRecord.intake_module_id,
          lecturer_id: examRecord.IntakeModule?.lecturer_id || null,
          program_id: examRecord.IntakeModule?.program_id || null,
          intake: examRecord.IntakeModule?.intake || null,
          semester_id: examRecord.IntakeModule?.semester_id || null,
          attendance_rate: attendanceRate,
          is_eligible: isEligible,
          eligibility_status: statusMessage,
          exam_record_date: examRecord.created_at
        };
      });

      return {
        message: `Found ${examStatus.length} exam record(s) for this student`,
        exam_records: examStatus
      };
    } catch (error) {
      throw new Error('Error retrieving student exam eligibility status: ' + error.message);
    }
  },

  // Get student images
  getStudentImages: async (studentId) => {
    try {
      // First, find the student to get their username (which is the student_id)
      const student = await Student.findOne({
        where: { student_id: studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Find all images for this student using their username
      const images = await ImageAsset.findAll({
        where: { username: studentId }, // student_id is the username in iam table
        order: [['created_at', 'DESC']]
      });

      if (!images || images.length === 0) {
        return {
          message: "No images found for this student",
          images: []
        };
      }

      // Get the IAM info separately to avoid association issues
      const iamUser = await Iam.findOne({
        where: { username: studentId },
        attributes: ['username', 'email', 'role']
      });

      // Format the response
      const imageList = images.map(image => ({
        image_id: image.image_id,
        username: image.username,
        image_path: image.image_path,
        created_at: image.created_at,
        updated_at: image.updated_at,
        user_info: {
          email: iamUser?.email || null,
          role: iamUser?.role || null
        }
      }));

      return {
        message: `Found ${imageList.length} image(s) for this student`,
        student_id: studentId,
        images: imageList
      };
    } catch (error) {
      throw new Error('Error retrieving student images: ' + error.message);
    }
  },

  // Create a new image asset for a student
  createStudentImage: async (studentId, imagePath) => {
    try {
      // First, verify the student exists
      const student = await Student.findOne({
        where: { student_id: studentId }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Create the image asset record
      const newImageAsset = await ImageAsset.create({
        username: studentId, // student_id is the username in iam table
        image_path: imagePath || `image_assets/${studentId}.jpg`
      });

      return {
        message: 'Image asset created successfully',
        image: {
          image_id: newImageAsset.image_id,
          username: newImageAsset.username,
          image_path: newImageAsset.image_path,
          created_at: newImageAsset.created_at
        }
      };
    } catch (error) {
      throw new Error('Error creating student image: ' + error.message);
    }
  },

  // Get the actual image file for a student
  getStudentImageFile: async (studentId, imageId) => {
    try {
      // Find the specific image record
      const imageAsset = await ImageAsset.findOne({
        where: { 
          username: studentId,
          image_id: imageId 
        }
      });

      if (!imageAsset) {
        throw new Error('Image not found for this student');
      }

      return {
        image_path: imageAsset.image_path,
        username: imageAsset.username,
        image_id: imageAsset.image_id
      };
    } catch (error) {
      throw new Error('Error retrieving student image file: ' + error.message);
    }
  }
};

export default studentService;
