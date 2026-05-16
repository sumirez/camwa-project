import Attendance from '../models/Attendance.model.js';
import AttendanceRequest from '../models/AttendanceRequest.model.js';
import ModuleRegistration from '../models/ModuleRegistration.model.js';
import Student from '../models/Student.model.js';
import Module from '../models/Module.model.js';
import Lecturer from '../models/Lecturer.model.js';
import Exam from '../models/Exam.model.js';
import Iam from '../models/Iam.model.js';
import { sendMail } from '../common/nodemailer/send-mail.nodemailer.js';
import { Op, Sequelize } from 'sequelize';
import notificationService from './notification.service.js';
import emailService from './email.service.js';

const attendanceService = {
    // Get attendance by id
    getAttendanceById: async (attendanceId) => {
        return await Attendance.findByPk(attendanceId);
    },
    
    // Create a new attendance request
    createAttendanceRequest: async (attendanceData) => {
        return await AttendanceRequest.create(attendanceData);
    },

    // View attendance requests by module
    viewAttendanceRequestsByModule: async (moduleId) => {
        return await AttendanceRequest.findAll({ where: { intake_module_id: moduleId } });
    },

    // View attendance requests by student
    viewAttendanceRequestsByStudent: async (studentId) => {
        return await AttendanceRequest.findAll({ where: { student_id: studentId } });
    },

    // View attendance requests by lecturer id, optionally filtered by class_id
    viewAttendanceRequestsByLecturerId: async (lecturerId, class_id) => {
        const where = { lecturer_id: lecturerId };
        if (class_id) where.class_id = class_id;
        return await AttendanceRequest.findAll({ where });
    },

    // Update an attendance request by request_id
    updateAttendanceRequest: async (requestId, updatedData) => {
        return await AttendanceRequest.update(updatedData, { where: { request_id: requestId } });
    },

    // Delete an attendance request by request_id
    deleteAttendanceRequest: async (requestId) => {
        return await AttendanceRequest.destroy({ where: { request_id: requestId } });
    },    // Submit attendance for a class or module
    submitAttendance: async (attendanceData) => {
        // Ensure attendance status is valid
        if (!['present', 'absent', 'late', 'excused'].includes(attendanceData.attendance_status)) {
            throw new Error('Invalid attendance status');
        }

        // Check if the student is registered for the module
        const registration = await ModuleRegistration.findOne({
            where: {
                student_id: attendanceData.student_id,
                intake_module_id: attendanceData.intake_module_id
            }
        });        if (!registration) {
            throw new Error(`Student ${attendanceData.student_id} is not registered for module ${attendanceData.intake_module_id}`);
        }

        return await Attendance.create(attendanceData);
    },    // View attendance by module
    viewAttendanceByModule: async (moduleId) => {
        return await Attendance.findAll({ where: { intake_module_id: moduleId } });
    },

    // View attendance by student
    viewAttendanceByStudent: async (studentId) => {
        return await Attendance.findAll({ where: { student_id: studentId } });
    },

    // View attendance by multiple class IDs
    viewAttendanceByClassIds: async (classIds) => {
        return await Attendance.findAll({ where: { class_id: classIds } });
    },

    // Update attendance by attendance_id
    updateAttendance: async (attendanceId, updatedData) => {
        return await Attendance.update(updatedData, { where: { attendance_id: attendanceId } });
    },

    // Delete attendance by attendance_id
    deleteAttendance: async (attendanceId) => {
        return await Attendance.destroy({ where: { attendance_id: attendanceId } });
    },    // Handle attendance discrepancy - request correction
    requestAttendanceCorrection: async (attendanceId, studentId, moduleId, requestDetails) => {
        if (!requestDetails.proposed_status || 
            !['present', 'absent', 'late', 'excused'].includes(requestDetails.proposed_status)) {
            throw new Error('Invalid proposed attendance status');
        }

        // Optimize database queries by running them in parallel
        const [attendance, existingPendingRequest] = await Promise.all([
            Attendance.findByPk(attendanceId),
            AttendanceRequest.findOne({
                where: {
                    attendance_id: attendanceId,
                    student_id: studentId,
                    request_status: 'pending'
                }
            })
        ]);

        if (!attendance) {
            throw new Error('Attendance record not found');
        }

        if (existingPendingRequest) {
            throw new Error('There is already a pending correction request for this attendance record');
        }

        const request = await AttendanceRequest.create({
            attendance_id: attendanceId,
            student_id: studentId,
            intake_module_id: moduleId,
            request_status: 'pending',
            proposed_status: requestDetails.proposed_status,
            reason: requestDetails.reason || null
        });

        // Send confirmation email to student asynchronously (fire-and-forget)
        // This won't block the response to the client
        setImmediate(async () => {
            try {
                // Get student's email from IAM table
                const studentIam = await Iam.findOne({
                    where: { iam_id: studentId },
                    attributes: ['email']
                });

                if (studentIam && studentIam.email) {
                    const requestData = {
                        intake_module_id: moduleId,
                        attendance_date: attendance.attendance_date,
                        current_status: attendance.attendance_status,
                        proposed_status: requestDetails.proposed_status,
                        reason: requestDetails.reason
                    };

                    await emailService.sendAttendanceRequestConfirmation(
                        studentIam.email,
                        requestData,
                        request.request_id
                    );
                    
                    console.log(`Confirmation email sent to ${studentIam.email} for request ${request.request_id}`);
                } else {
                    console.warn(`Could not find email for student ${studentId} - confirmation email not sent`);
                }
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
            }
        });

        // Create notification for Faculty/Admin asynchronously (fire-and-forget)
        // This won't block the response to the client
        setImmediate(async () => {
            try {
                await notificationService.createNewRequestNotification(request.request_id, studentId);
            } catch (notificationError) {
                console.error('Failed to create notification:', notificationError);
            }
        });

        return request;
    },
    
    // Approve or deny attendance correction
    handleCorrectionRequest: async (requestId, approved_status, processedBy) => {
        const request = await AttendanceRequest.findByPk(requestId);
        if (!request) {
            throw new Error('Attendance request not found');
        }
        
        if (request.request_status !== 'pending') {
            throw new Error('This request has already been processed');
        }

        // Get student's email from IAM table for email notification
        const studentIam = await Iam.findOne({
            where: { iam_id: request.student_id },
            attributes: ['email']
        });

        // Get original attendance record to include current status in email
        const originalAttendance = await Attendance.findByPk(request.attendance_id);

        // Compare approved_status with proposed_status to determine if it's an approval
        const isApproved = approved_status === request.proposed_status;
        const newStatus = isApproved ? 'approved' : 'rejected';

        // Update the correction request with processed information
        const updateData = {
            request_status: newStatus,
            processed_by: processedBy,
            processed_at: new Date(),
            approved_status: approved_status
        };
        
        // Prepare database updates to run in parallel
        const updatePromises = [
            // Always update the request record
            AttendanceRequest.update(updateData, { where: { request_id: requestId } })
        ];
        
        // If approved, also update the attendance record
        if (isApproved) {
            updatePromises.push(
                Attendance.update(
                    { 
                        attendance_status: approved_status,
                        updated_at: new Date()
                    },
                    { where: { attendance_id: request.attendance_id } }
                )
            );
            console.log(`Correction request ${requestId} approved and attendance updated to ${approved_status}.`);
        } else {
            console.log(`Correction request ${requestId} rejected. Proposed status was ${request.proposed_status}, admin approved status is ${approved_status}.`);
        }
        
        // Execute all database updates in parallel
        await Promise.all(updatePromises);

        // Send email notification asynchronously (fire-and-forget)
        // This won't block the response to the client
        setImmediate(async () => {
            try {
                if (studentIam && studentIam.email) {
                    const requestData = {
                        intake_module_id: request.intake_module_id,
                        original_status: originalAttendance ? originalAttendance.attendance_status : null,
                        proposed_status: request.proposed_status,
                        approved_status: approved_status,
                        reason: request.reason
                    };

                    await emailService.sendAttendanceCorrectionNotification(
                        studentIam.email,
                        requestData,
                        isApproved,
                        processedBy
                    );
                    
                    console.log(`Email notification sent to ${studentIam.email} for request ${requestId}`);
                } else {
                    console.warn(`Could not find email for student ${request.student_id} - email notification not sent`);
                }
            } catch (emailError) {
                console.error('Failed to send email notification:', emailError);
            }
        });

        // Create notification for the student asynchronously (fire-and-forget)
        // This won't block the response to the client
        setImmediate(async () => {
            try {
                await notificationService.createRequestProcessedNotification(requestId, processedBy, isApproved);
            } catch (notificationError) {
                console.error('Failed to create notification:', notificationError);
            }
        });

        return {
            status: newStatus,
            message: isApproved ? 'Correction Approved' : 'Correction Rejected',
            proposed_status: request.proposed_status,
            approved_status: approved_status,
            isApproved: isApproved
        };
    },    // Get all attendance requests by status
    getAttendanceRequestsByStatus: async (status, moduleId = null) => {
        const query = { where: { request_status: status } };
        if (moduleId) {
            query.where.intake_module_id = moduleId;
        }
        return await AttendanceRequest.findAll(query);
    },

    // Create multiple attendance records from Excel file (Faculty Assistant only)
    createAttendanceFromExcel: async (filePath) => {
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
                const student_id = row.getCell(1).value?.toString(); // StudentID
                const intake_module_id = row.getCell(2).value?.toString(); // intakeModuleId
                const module_name = row.getCell(3).value?.toString(); // ModuleName
                const status = row.getCell(4).value?.toString(); // status
                
                // Skip empty rows or rows with missing required fields
                if (!student_id || !intake_module_id || !status) {
                    console.log(`Skipping row ${i} due to missing required fields`);
                    results.failed.push({
                        row: i,
                        error: 'Missing required fields'
                    });
                    continue;
                }
                
                // Validate attendance status
                const validStatuses = ['present', 'absent', 'late', 'excused'];
                const normalizedStatus = status.toLowerCase();
                
                if (!validStatuses.includes(normalizedStatus)) {
                    console.log(`Skipping row ${i} due to invalid status: ${status}`);
                    results.failed.push({
                        student_id,
                        intake_module_id,
                        error: `Invalid attendance status: ${status}. Must be one of: present, absent, late, excused`
                    });
                    continue;
                }
                
                try {
                    // Create attendance record
                    const attendanceData = {
                        student_id,
                        intake_module_id,
                        attendance_status: normalizedStatus,
                    };
                    
                    // Use the existing submitAttendance method
                    const newAttendance = await attendanceService.submitAttendance(attendanceData);
                    
                    results.successful.push({
                        attendance_id: newAttendance.attendance_id,
                        student_id: newAttendance.student_id,
                        intake_module_id: newAttendance.intake_module_id,
                        attendance_status: newAttendance.attendance_status
                    });
                } catch (error) {
                    console.error(`Error creating attendance at row ${i}:`, error);
                    results.failed.push({
                        student_id,
                        intake_module_id,
                        error: error.message
                    });
                }
            }
            
            return results;
        } catch (error) {
            console.error('Error creating attendance from Excel file:', error);
            throw new Error('Error creating attendance from Excel file: ' + error.message);
        }
    },
    
    // Calculate attendance rate for a student in a specific module
    calculateAttendanceRate: async (studentId, moduleId) => {
        try {
            const attendanceRecords = await Attendance.findAll({
                where: {
                    student_id: studentId,
                    intake_module_id: moduleId
                }
            });
            
            if (attendanceRecords.length === 0) {
                return 0; // No attendance records found
            }
            
            const totalClasses = attendanceRecords.length;
            const presentClasses = attendanceRecords.filter(record => 
                record.attendance_status === 'present' || record.attendance_status === 'late' || record.attendance_status === 'excused'
            ).length;
            
            const attendanceRate = (presentClasses / totalClasses) * 100;
            return parseFloat(attendanceRate.toFixed(2)); // Return with 2 decimal places
        } catch (error) {
            console.error('Error calculating attendance rate:', error);
            throw new Error('Error calculating attendance rate: ' + error.message);
        }
    },    // Check if a student is eligible for an exam in a specific module
    // This function will only retrieve eligibility data, not update it
    checkExamEligibility: async (studentId, moduleId) => {
        try {
            // Check if the student is registered for the module
            const registration = await ModuleRegistration.findOne({
                where: {
                    student_id: studentId,
                    intake_module_id: moduleId
                }
            });
            
            if (!registration) {
                throw new Error(`Student ${studentId} is not registered for module ${moduleId}`);
            }
            
            // Calculate the current attendance rate (this doesn't update the database)
            const attendanceRate = await attendanceService.calculateAttendanceRate(studentId, moduleId);
            const isEligible = attendanceRate >= 80;
            
            // Find the existing exam record but don't create or update it
            const examRecord = await Exam.findOne({
                where: {
                    student_id: studentId,
                    intake_module_id: moduleId
                }
            });
            
            return {
                attendanceRate,
                isEligible,
                // Return the existing record if found, otherwise return calculated values
                examRecord: examRecord || {
                    student_id: studentId,
                    intake_module_id: moduleId,
                    attendance_rate: attendanceRate,
                    is_eligible: isEligible,
                    // Mark that this record hasn't been saved yet
                    _calculated: true
                }
            };
        } catch (error) {
            console.error('Error checking exam eligibility:', error);
            throw new Error('Error checking exam eligibility: ' + error.message);
        }
    },
      // Get all exam eligibility records for a module
    getExamEligibilityByModule: async (moduleId) => {
        try {
            return await Exam.findAll({
                where: {
                    intake_module_id: moduleId
                },
                order: [
                    ['student_id', 'ASC']
                ]
            });
        } catch (error) {
            console.error('Error getting exam eligibility by module:', error);
            // Return an empty array instead of throwing to prevent crashes
            console.error(error);
            return [];
        }
    },
    
    // Get all exam eligibility records for a student
    getExamEligibilityByStudent: async (studentId) => {
        try {
            return await Exam.findAll({
                where: {
                    student_id: studentId
                },
                order: [
                    ['intake_module_id', 'ASC']
                ]
            });
        } catch (error) {
            console.error('Error getting exam eligibility by student:', error);
            // Return an empty array instead of throwing to prevent crashes
            console.error(error);
            return [];
        }
    },    // Update exam eligibility for all students in a module
    // This is the function that should be called via admin API to explicitly update exam eligibility
    updateExamEligibilityForModule: async (moduleId) => {
        try {
            // Get all students registered for the module
            const registrations = await ModuleRegistration.findAll({
                where: {
                    intake_module_id: moduleId
                }
            });
            
            if (registrations.length === 0) {
                throw new Error(`No students registered for module ${moduleId}`);
            }
            
            const results = [];
            
            // Calculate and update eligibility for each student
            for (const registration of registrations) {
                try {
                    // Calculate attendance rate for this student
                    const attendanceRate = await attendanceService.calculateAttendanceRate(
                        registration.student_id, 
                        moduleId
                    );
                    
                    // Determine eligibility based on 80% threshold
                    const isEligible = attendanceRate >= 80;
                    
                    // Find existing record or create a new one
                    let examRecord = await Exam.findOne({
                        where: {
                            student_id: registration.student_id,
                            intake_module_id: moduleId
                        }
                    });
                    
                    if (examRecord) {
                        // Update existing record
                        examRecord.attendance_rate = attendanceRate;
                        examRecord.is_eligible = isEligible;
                        await examRecord.save();
                    } else {
                        // Create new record
                        examRecord = await Exam.create({
                            student_id: registration.student_id,
                            intake_module_id: moduleId,
                            attendance_rate: attendanceRate,
                            is_eligible: isEligible
                        });
                    }
                    
                    results.push({
                        attendanceRate,
                        isEligible,
                        examRecord
                    });
                } catch (studentError) {
                    console.error(`Error processing student ${registration.student_id}:`, studentError);
                    // Add error info but continue with other students
                    results.push({
                        student_id: registration.student_id,
                        intake_module_id: moduleId,
                        error: studentError.message
                    });
                }
            }
            
            return results;
        } catch (error) {
            console.error('Error updating exam eligibility for module:', error);
            return []; // Return empty array instead of throwing to prevent app crash
        }
    },

    // Update exam eligibility for all modules at once
    // This function will update exam eligibility for all students in all modules
    updateExamEligibilityForAllModules: async () => {
        try {
            // Get all unique module IDs from module registrations
            const modules = await ModuleRegistration.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('intake_module_id')), 'intake_module_id']],
                raw: true
            });

            if (modules.length === 0) {
                throw new Error('No modules found with registrations');
            }

            const allResults = [];
            let successCount = 0;
            let failureCount = 0;            // Process each module
            for (const module of modules) {
                try {
                    console.log(`Processing intake module: ${module.intake_module_id}`);
                    
                    // Use the existing updateExamEligibilityForModule method
                    const moduleResults = await attendanceService.updateExamEligibilityForModule(module.intake_module_id);
                      // Count eligible and ineligible students for this module
                    const moduleEligible = moduleResults.filter(result => !result.error && result.isEligible === true).length;
                    const moduleIneligible = moduleResults.filter(result => !result.error && result.isEligible === false).length;
                    const moduleErrors = moduleResults.filter(result => result.error).length;
                    
                    // Calculate success attendance rate for this module
                    const totalStudentsProcessed = moduleEligible + moduleIneligible;
                    const moduleSuccessRate = totalStudentsProcessed > 0 
                        ? ((moduleEligible / totalStudentsProcessed) * 100).toFixed(2) + '%'
                        : '0%';
                    
                    successCount += moduleEligible;
                    failureCount += moduleIneligible;allResults.push({
                        intake_module_id: module.intake_module_id,
                        students_processed: moduleResults.length,
                        students_success: moduleEligible,
                        students_failed: moduleIneligible,
                        students_with_errors: moduleErrors,
                        success_attendance_rate: moduleSuccessRate,
                        results: moduleResults
                    });                } catch (moduleError) {
                    console.error(`Error processing intake module ${module.intake_module_id}:`, moduleError);
                    allResults.push({
                        intake_module_id: module.intake_module_id,
                        error: moduleError.message,
                        students_processed: 0,
                        students_success: 0,
                        students_failed: 0,
                        students_with_errors: 1,
                        success_attendance_rate: '0%'
                    });
                }
            }

            return {
                summary: {
                    total_modules_processed: modules.length,
                    total_students_success: successCount, // Students with >= 80% attendance (eligible)
                    total_students_failed: failureCount, // Students with < 80% attendance (ineligible)
                    success_rate: (successCount + failureCount) > 0 ? ((successCount / (successCount + failureCount)) * 100).toFixed(2) + '%' : '0%'
                },
                modules: allResults
            };

        } catch (error) {
            console.error('Error updating exam eligibility for all modules:', error);
            throw new Error('Error updating exam eligibility for all modules: ' + error.message);
        }
    },

    // Update exam eligibility for all modules taught by a specific lecturer
    // This function will update exam eligibility for all students in all modules taught by the lecturer
    updateExamEligibilityForLecturerModules: async (lecturerId) => {
        try {
            // Get all unique module IDs for the specific lecturer from module registrations
            const modules = await ModuleRegistration.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('intake_module_id')), 'intake_module_id']],
                where: { lecturer_id: lecturerId },
                raw: true
            });

            if (modules.length === 0) {
                throw new Error(`No modules found for lecturer ${lecturerId}`);
            }

            const allResults = [];
            let successCount = 0;
            let failureCount = 0;

            // Process each module
            for (const module of modules) {
                try {
                    console.log(`Processing intake module: ${module.intake_module_id} for lecturer: ${lecturerId}`);
                    
                    // Use the existing updateExamEligibilityForModule method
                    const moduleResults = await attendanceService.updateExamEligibilityForModule(module.intake_module_id);
                      // Count eligible and ineligible students for this module
                    const moduleEligible = moduleResults.filter(result => !result.error && result.isEligible === true).length;
                    const moduleIneligible = moduleResults.filter(result => !result.error && result.isEligible === false).length;
                    const moduleErrors = moduleResults.filter(result => result.error).length;
                    
                    // Calculate success attendance rate for this module
                    const totalStudentsProcessed = moduleEligible + moduleIneligible;
                    const moduleSuccessRate = totalStudentsProcessed > 0 
                        ? ((moduleEligible / totalStudentsProcessed) * 100).toFixed(2) + '%'
                        : '0%';
                    
                    successCount += moduleEligible;
                    failureCount += moduleIneligible;

                    allResults.push({
                        intake_module_id: module.intake_module_id,
                        students_processed: moduleResults.length,
                        students_success: moduleEligible,
                        students_failed: moduleIneligible,
                        students_with_errors: moduleErrors,
                        success_attendance_rate: moduleSuccessRate,
                        results: moduleResults
                    });                } catch (moduleError) {
                    console.error(`Error processing intake module ${module.intake_module_id}:`, moduleError);
                    allResults.push({
                        intake_module_id: module.intake_module_id,
                        error: moduleError.message,
                        students_processed: 0,
                        students_success: 0,
                        students_failed: 0,
                        students_with_errors: 1,
                        success_attendance_rate: '0%'
                    });
                }
            }

            return {
                lecturer_id: lecturerId,
                summary: {
                    total_modules_processed: modules.length,
                    total_students_success: successCount, // Students with >= 80% attendance (eligible)
                    total_students_failed: failureCount, // Students with < 80% attendance (ineligible)
                    success_rate: (successCount + failureCount) > 0 ? ((successCount / (successCount + failureCount)) * 100).toFixed(2) + '%' : '0%'
                },
                modules: allResults
            };

        } catch (error) {
            console.error('Error updating exam eligibility for lecturer modules:', error);
            throw new Error('Error updating exam eligibility for lecturer modules: ' + error.message);
        }
    },    // Export exam eligibility data to Excel files for each module
    exportExamEligibilityToExcel: async () => {
        try {
            const path = await import('path');
            const fs = await import('fs/promises');
            const Excel = (await import('exceljs')).default;

            // First, update exam eligibility for all modules to get the latest data
            const eligibilityData = await attendanceService.updateExamEligibilityForAllModules();

            // Create the export directory if it doesn't exist
            const exportDir = path.resolve(process.cwd(), 'eligibility for exam');
            try {
                await fs.access(exportDir);
            } catch {
                await fs.mkdir(exportDir, { recursive: true });
            }

            const exportResults = [];            // Process each module from the eligibility data
            for (const moduleData of eligibilityData.modules) {
                try {
                    console.log(`Exporting eligibility data for intake module: ${moduleData.intake_module_id}`);
                    console.log(`Module data structure:`, JSON.stringify(moduleData, null, 2));
                    
                    // Check if there's an error with this module
                    if (moduleData.error) {
                        console.log(`Intake module ${moduleData.intake_module_id} has error: ${moduleData.error}`);
                        exportResults.push({
                            intake_module_id: moduleData.intake_module_id,
                            error: `Module processing error: ${moduleData.error}`,
                            fileName: null,
                            filePath: null
                        });
                        continue;
                    }
                    
                    if (!moduleData.results || moduleData.results.length === 0) {
                        console.log(`No students found for intake module: ${moduleData.intake_module_id}`);
                        console.log(`Module results:`, moduleData.results);
                        continue;
                    }

                    // Get additional module and student information
                    const moduleInfo = await ModuleRegistration.findOne({
                        where: { intake_module_id: moduleData.intake_module_id },
                        include: [
                            { 
                                model: Module, 
                                attributes: ['intake_module_id'] 
                            },
                            { 
                                model: Lecturer, 
                                attributes: ['lecturer_id', 'name'] 
                            }
                        ]
                    });

                    if (!moduleInfo) {
                        console.log(`No intake module info found for: ${moduleData.intake_module_id}`);
                        continue;
                    }

                    // Create Excel workbook and worksheet
                    const workbook = new Excel.Workbook();
                    const worksheet = workbook.addWorksheet(`${moduleData.intake_module_id}_Eligibility`);

                    // Set up headers
                    worksheet.columns = [
                        { header: 'Intake Module ID', key: 'intake_module_id', width: 20 },
                        { header: 'Module Name', key: 'module_name', width: 30 },
                        { header: 'Lecturer ID', key: 'lecturer_id', width: 15 },
                        { header: 'Student ID', key: 'student_id', width: 15 },
                        { header: 'Student Name', key: 'student_name', width: 25 },
                        { header: 'Attendance Rate', key: 'attendanceRate', width: 18 },
                        { header: 'Is Eligible', key: 'isEligible', width: 12 }
                    ];

                    // Style the headers
                    worksheet.getRow(1).font = { bold: true };
                    worksheet.getRow(1).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFE0E0E0' }
                    };

                    // Collect data for each student from the eligibility results
                    const studentData = [];
                    for (const studentResult of moduleData.results) {
                        try {
                            // Skip error entries
                            if (studentResult.error) {
                                console.log(`Skipping student with error: ${studentResult.error}`);
                                continue;
                            }

                            // Get student information
                            const student = await Student.findByPk(studentResult.examRecord.student_id, {
                                attributes: ['student_id', 'name']
                            });

                            if (!student) {
                                console.log(`Student not found: ${studentResult.examRecord.student_id}`);
                                continue;
                            }

                            studentData.push({
                                intake_module_id: moduleData.intake_module_id,
                                module_name: moduleInfo.IntakeModule?.intake_module_id || moduleData.intake_module_id,
                                lecturer_id: moduleInfo.lecturer_id,
                                student_id: student.student_id,
                                student_name: student.name,
                                attendanceRate: `${studentResult.attendanceRate.toFixed(2)}%`,
                                isEligible: studentResult.isEligible ? 'YES' : 'NO'
                            });
                        } catch (studentError) {
                            console.error(`Error processing student data:`, studentError);
                            continue;
                        }
                    }

                    if (studentData.length === 0) {
                        console.log(`No valid student data for intake module: ${moduleData.intake_module_id}`);
                        continue;
                    }

                    // Add data to worksheet
                    studentData.forEach(data => {
                        const row = worksheet.addRow(data);
                        
                        // Color code the eligibility column
                        const eligibilityCell = row.getCell('isEligible');
                        if (data.isEligible === 'YES') {
                            eligibilityCell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FF90EE90' } // Light green
                            };
                        } else if (data.isEligible === 'NO') {
                            eligibilityCell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFCCCB' } // Light red
                            };
                        }
                    });

                    // Auto-fit columns
                    worksheet.columns.forEach(column => {
                        column.width = Math.max(column.width || 10, 12);
                    });

                    // Save the file
                    const fileName = `${moduleData.intake_module_id}_eligibility_for_exam.xlsx`;
                    const filePath = path.join(exportDir, fileName);
                    await workbook.xlsx.writeFile(filePath);

                    exportResults.push({
                        intake_module_id: moduleData.intake_module_id,
                        fileName: fileName,
                        filePath: filePath,
                        studentsProcessed: studentData.length,
                        studentsEligible: studentData.filter(s => s.isEligible === 'YES').length,
                        studentsIneligible: studentData.filter(s => s.isEligible === 'NO').length,
                        errors: 0
                    });

                } catch (moduleError) {
                    console.error(`Error exporting intake module ${moduleData.intake_module_id}:`, moduleError);
                    exportResults.push({
                        intake_module_id: moduleData.intake_module_id,
                        error: moduleError.message,
                        fileName: null,
                        filePath: null
                    });
                }
            }

            return {
                exportDirectory: exportDir,
                totalModules: eligibilityData.modules.length,
                successfulExports: exportResults.filter(r => !r.error).length,
                failedExports: exportResults.filter(r => r.error).length,
                results: exportResults
            };

        } catch (error) {
            console.error('Error exporting exam eligibility to Excel:', error);
            throw new Error('Error exporting exam eligibility to Excel: ' + error.message);
        }
    },

    // Export exam eligibility data to Excel files for each module taught by a specific lecturer
    exportExamEligibilityForLecturerToExcel: async (lecturerId) => {
        try {
            const path = await import('path');
            const fs = await import('fs/promises');
            const Excel = (await import('exceljs')).default;

            // First, update exam eligibility for lecturer's modules to get the latest data
            const eligibilityData = await attendanceService.updateExamEligibilityForLecturerModules(lecturerId);

            // Create the export directory if it doesn't exist
            const exportDir = path.resolve(process.cwd(), 'eligibility for exam');
            try {
                await fs.access(exportDir);
            } catch {
                await fs.mkdir(exportDir, { recursive: true });
            }

            const exportResults = [];

            // Process each module from the eligibility data
            for (const moduleData of eligibilityData.modules) {
                try {
                    console.log(`Exporting eligibility data for lecturer ${lecturerId}, intake module: ${moduleData.intake_module_id}`);
                    console.log(`Module data structure:`, JSON.stringify(moduleData, null, 2));
                    
                    // Check if there's an error with this module
                    if (moduleData.error) {
                        console.log(`Intake module ${moduleData.intake_module_id} has error: ${moduleData.error}`);
                        exportResults.push({
                            intake_module_id: moduleData.intake_module_id,
                            lecturer_id: lecturerId,
                            error: `Module processing error: ${moduleData.error}`,
                            fileName: null,
                            filePath: null
                        });
                        continue;
                    }
                    
                    if (!moduleData.results || moduleData.results.length === 0) {
                        console.log(`No students found for intake module: ${moduleData.intake_module_id}`);
                        console.log(`Module results:`, moduleData.results);
                        continue;
                    }

                    // Get additional module and student information
                    const moduleInfo = await ModuleRegistration.findOne({
                        where: { 
                            intake_module_id: moduleData.intake_module_id,
                            lecturer_id: lecturerId 
                        },
                        include: [
                            { 
                                model: Module, 
                                attributes: ['intake_module_id'] 
                            },
                            { 
                                model: Lecturer, 
                                attributes: ['lecturer_id', 'name'] 
                            }
                        ]
                    });

                    if (!moduleInfo) {
                        console.log(`No intake module info found for lecturer ${lecturerId}, intake module: ${moduleData.intake_module_id}`);
                        continue;
                    }

                    // Create Excel workbook and worksheet
                    const workbook = new Excel.Workbook();
                    const worksheet = workbook.addWorksheet(`${moduleData.intake_module_id}_Eligibility`);

                    // Set up headers
                    worksheet.columns = [
                        { header: 'Intake Module ID', key: 'intake_module_id', width: 20 },
                        { header: 'Module Name', key: 'module_name', width: 30 },
                        { header: 'Lecturer ID', key: 'lecturer_id', width: 15 },
                        { header: 'Student ID', key: 'student_id', width: 15 },
                        { header: 'Student Name', key: 'student_name', width: 25 },
                        { header: 'Attendance Rate', key: 'attendanceRate', width: 18 },
                        { header: 'Is Eligible', key: 'isEligible', width: 12 }
                    ];

                    // Style the headers
                    worksheet.getRow(1).font = { bold: true };
                    worksheet.getRow(1).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFE0E0E0' }
                    };

                    // Collect data for each student from the eligibility results
                    const studentData = [];
                    for (const studentResult of moduleData.results) {
                        try {
                            // Skip error entries
                            if (studentResult.error) {
                                console.log(`Skipping student with error: ${studentResult.error}`);
                                continue;
                            }

                            // Get student information
                            const student = await Student.findByPk(studentResult.examRecord.student_id, {
                                attributes: ['student_id', 'name']
                            });

                            if (!student) {
                                console.log(`Student not found: ${studentResult.examRecord.student_id}`);
                                continue;
                            }

                            studentData.push({
                                intake_module_id: moduleData.intake_module_id,
                                module_name: moduleInfo.IntakeModule?.intake_module_id || moduleData.intake_module_id,
                                lecturer_id: lecturerId,
                                student_id: student.student_id,
                                student_name: student.name,
                                attendanceRate: `${studentResult.attendanceRate.toFixed(2)}%`,
                                isEligible: studentResult.isEligible ? 'YES' : 'NO'
                            });
                        } catch (studentError) {
                            console.error(`Error processing student data:`, studentError);
                            continue;
                        }
                    }

                    if (studentData.length === 0) {
                        console.log(`No valid student data for intake module: ${moduleData.intake_module_id}`);
                        continue;
                    }

                    // Add data to worksheet
                    studentData.forEach(data => {
                        const row = worksheet.addRow(data);
                        
                        // Color code the eligibility column
                        const eligibilityCell = row.getCell('isEligible');
                        if (data.isEligible === 'YES') {
                            eligibilityCell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FF90EE90' } // Light green
                            };
                        } else if (data.isEligible === 'NO') {
                            eligibilityCell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFCCCB' } // Light red
                            };
                        }
                    });

                    // Auto-fit columns
                    worksheet.columns.forEach(column => {
                        column.width = Math.max(column.width || 10, 12);
                    });

                    // Save the file with naming pattern: lecturer_id + intake_module_id + eligibility_for_exam.xlsx
                    const fileName = `${lecturerId}_${moduleData.intake_module_id}_eligibility_for_exam.xlsx`;
                    const filePath = path.join(exportDir, fileName);
                    await workbook.xlsx.writeFile(filePath);

                    exportResults.push({
                        intake_module_id: moduleData.intake_module_id,
                        lecturer_id: lecturerId,
                        fileName: fileName,
                        filePath: filePath,
                        studentsProcessed: studentData.length,
                        studentsEligible: studentData.filter(s => s.isEligible === 'YES').length,
                        studentsIneligible: studentData.filter(s => s.isEligible === 'NO').length,
                        errors: 0
                    });

                } catch (moduleError) {
                    console.error(`Error exporting intake module ${moduleData.intake_module_id} for lecturer ${lecturerId}:`, moduleError);
                    exportResults.push({
                        intake_module_id: moduleData.intake_module_id,
                        lecturer_id: lecturerId,
                        error: moduleError.message,
                        fileName: null,
                        filePath: null
                    });
                }
            }

            return {
                lecturer_id: lecturerId,
                exportDirectory: exportDir,
                totalModules: eligibilityData.modules.length,
                successfulExports: exportResults.filter(r => !r.error).length,
                failedExports: exportResults.filter(r => r.error).length,
                results: exportResults
            };

        } catch (error) {
            console.error('Error exporting exam eligibility to Excel for lecturer:', error);
            throw new Error('Error exporting exam eligibility to Excel for lecturer: ' + error.message);
        }
    },
};

export default attendanceService;
