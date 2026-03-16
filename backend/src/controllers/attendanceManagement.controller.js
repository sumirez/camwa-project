import attendanceService from "../services/attendance.service.js";
import { responseError, responseSuccess } from "../common/helpers/response.helper.js";

const attendanceManagement = {    // Create Attendance (Automated or Manual)
    createAttendance: async (req, res, next) => {
        try {
            const attendanceData = req.body;
            const userId = req.user?.uid;
            const userRole = req.user?.role;

            // Validate required fields
            if (!attendanceData.student_id || !attendanceData.module_id || !attendanceData.attendance_status) {
                return res.status(400).json(responseError('Missing required fields: student_id, module_id, and attendance_status are required', 400));
            }

            // Check if a student user is trying to record attendance for someone else
            if (userRole === 'STUDENT' && userId !== attendanceData.student_id) {
                return res.status(403).json(responseError('Students can only record their own attendance', 403));
            }

            const result = await attendanceService.submitAttendance(attendanceData);
            const resData = responseSuccess(result, 'Attendance recorded successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            // Handle registration validation error with appropriate status code
            if (error.message && error.message.includes('not registered for this module')) {
                return res.status(400).json(responseError(error.message, 400));
            }

            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // View Attendance Records by Class, Module, or Student
    viewAttendance: async (req, res, next) => {
        try {
            const { moduleId, studentId, classIds } = req.query;
            if (!moduleId && !studentId && !classIds) {
                return res.status(400).json({ message: 'Either moduleId, studentId, or classIds must be provided' });
            }

            // For non-student users, proceed normally
            let result;
            if (moduleId) {
                result = await attendanceService.viewAttendanceByModule(moduleId);
            } else if (studentId) {
                result = await attendanceService.viewAttendanceByStudent(studentId);
            } else if (classIds) {
                const ids = classIds.split(',');
                result = await attendanceService.viewAttendanceByClassIds(ids);
            }
            const resData = responseSuccess(result, 'Attendance records retrieved successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },
    // Update Attendance (for corrections)
    updateAttendance: async (req, res, next) => {
        try {
            const attendanceId = req.params.attendanceId;
            const updatedData = req.body;
            const userId = req.user?.uid;
            const userRole = req.user?.role;

            // If the user is a student, verify they can only update their own attendance
            if (userRole === 'STUDENT') {
                // First retrieve the attendance record to check ownership
                const attendance = await attendanceService.getAttendanceById(attendanceId);

                if (!attendance) {
                    return res.status(404).json(responseError('Attendance record not found', 404));
                }

                // Check if this attendance record belongs to the student
                if (attendance.student_id !== userId) {
                    return res.status(403).json(responseError('Students can only update their own attendance records', 403));
                }
            }

            const result = await attendanceService.updateAttendance(attendanceId, updatedData);
            const resData = responseSuccess(result, 'Attendance updated successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Delete Attendance Record
    deleteAttendance: async (req, res, next) => {
        try {
            const attendanceId = req.params.attendanceId;
            await attendanceService.deleteAttendance(attendanceId);
            const resData = responseSuccess(null, 'Attendance record deleted successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Request Attendance Correction    
    requestAttendanceCorrection: async (req, res, next) => {
        try {
            const { attendance_id, student_id, module_id, proposed_status, reason } = req.body;
            const userId = req.user?.uid;
            const userRole = req.user?.role;

            // Early validation to fail fast
            if (!attendance_id || !student_id || !module_id || !proposed_status) {
                return res.status(400).json(responseError('Missing required fields', 400));
            }

            // If the user is a student, verify they can only request corrections for their own attendance
            if (userRole === 'STUDENT' && userId !== student_id) {
                return res.status(403).json(responseError('Students can only request corrections for their own attendance', 403));
            }

            const requestDetails = {
                proposed_status,
                reason
            };

            const result = await attendanceService.requestAttendanceCorrection(
                attendance_id,
                student_id,
                module_id,
                requestDetails
            );

            const resData = responseSuccess(result, 'Attendance correction request submitted successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            // Handle specific error cases with appropriate status codes
            if (error.message && error.message.includes('already a pending correction request')) {
                return res.status(409).json(responseError(error.message, 409));
            }

            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Approve/Deny Attendance Correction Request
    handleCorrectionRequest: async (req, res, next) => {
        try {
            const { requestId } = req.params;
            const { approved_status, processedBy } = req.body;
            const finalProcessedBy = processedBy || req.user?.username || 'system';

            // Early validation to fail fast
            if (!approved_status) {
                return res.status(400).json(responseError('Approved status is required', 400));
            }

            // Validate that approved_status is a valid status value
            if (!['present', 'absent', 'late', 'excused'].includes(approved_status)) {
                return res.status(400).json(responseError('Invalid attendance status', 400));
            }

            const result = await attendanceService.handleCorrectionRequest(
                requestId,
                approved_status,
                finalProcessedBy
            );

            const resData = responseSuccess(
                result,
                `Correction request ${result.status === 'approved' ? 'approved' : 'rejected'} successfully`
            );
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Get attendance requests by status
    getAttendanceRequestsByStatus: async (req, res, next) => {
        try {
            const { status, moduleId } = req.query;

            if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: 'Valid status parameter is required' });
            }

            const result = await attendanceService.getAttendanceRequestsByStatus(status, moduleId);
            const resData = responseSuccess(
                result,
                `${status.charAt(0).toUpperCase() + status.slice(1)} attendance requests retrieved successfully`
            );
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Create attendance records from Excel file (Faculty Assistant only)
    createAttendanceFromExcel: async (req, res, next) => {
        try {
            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json(responseError('No Excel file uploaded. Make sure to include a file field with your Excel file.', 400));
            }

            console.log('File uploaded for attendance:', req.file);
            console.log('File path:', req.file.path);

            // Process the Excel file and create attendance records
            const results = await attendanceService.createAttendanceFromExcel(req.file.path);

            res.status(201).json(
                responseSuccess(
                    results,
                    `Created ${results.successful.length} attendance records successfully. ${results.failed.length} failed.`
                )
            );
        } catch (error) {
            console.error('Error processing attendance Excel file:', error);
            res.status(500).json(responseError(error.message, 500));
        }
    },

    // Get exam eligibility for a student in a module
    // This endpoint only retrieves existing eligibility records or calculated values
    // It does not update the eligibility records in the database
    getExamEligibility: async (req, res, next) => {
        try {
            const { moduleId, studentId } = req.query;
            const userId = req.user?.uid;
            const userRole = req.user?.role;

            if (!moduleId && !studentId) {
                return res.status(400).json(responseError('Either moduleId or studentId must be provided', 400));
            }

            // If user is a student, they can only view their own exam eligibility
            if (userRole === 'STUDENT') {
                // If studentId is provided, ensure it matches the user's ID
                if (studentId && studentId !== userId) {
                    return res.status(403).json(responseError('Students can only view their own exam eligibility records', 403));
                }

                // If no studentId is provided, default to the user's ID
                const studId = studentId || userId;

                if (moduleId) {
                    // Get exam eligibility for a specific module - just retrieves, doesn't update
                    const eligibility = await attendanceService.checkExamEligibility(studId, moduleId);

                    // Include a note about eligibility records that may need to be updated by admin
                    if (eligibility.examRecord._calculated) {
                        eligibility.message = "This eligibility calculation is not yet saved. An administrator needs to update exam eligibility records.";
                    }

                    const resData = responseSuccess(eligibility, 'Exam eligibility retrieved successfully');
                    res.status(resData.code).json(resData);
                } else {
                    // Get all exam eligibility records for the student
                    const eligibilities = await attendanceService.getExamEligibilityByStudent(studId);
                    const resData = responseSuccess(eligibilities, 'Exam eligibility records retrieved successfully');
                    res.status(resData.code).json(resData);
                }
            } else {
                // For admins, lecturers, and other staff
                if (moduleId && studentId) {
                    // Get exam eligibility for a specific student in a specific module
                    const eligibility = await attendanceService.checkExamEligibility(studentId, moduleId);

                    // Include a note about eligibility records that may need to be updated by admin
                    if (eligibility.examRecord._calculated) {
                        eligibility.message = "This eligibility calculation is not yet saved. Use the update API endpoint to save this calculation.";
                    }

                    const resData = responseSuccess(eligibility, 'Exam eligibility retrieved successfully');
                    res.status(resData.code).json(resData);
                } else if (moduleId) {
                    // Get all exam eligibility records for a module
                    const eligibilities = await attendanceService.getExamEligibilityByModule(moduleId);
                    const resData = responseSuccess(eligibilities, 'Exam eligibility records for module retrieved successfully');
                    res.status(resData.code).json(resData);
                } else if (studentId) {
                    // Get all exam eligibility records for a student
                    const eligibilities = await attendanceService.getExamEligibilityByStudent(studentId);
                    const resData = responseSuccess(eligibilities, 'Exam eligibility records for student retrieved successfully');
                    res.status(resData.code).json(resData);
                }
            }
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },
    // Update exam eligibility for all students in a module
    // This is the only endpoint that should update exam eligibility records
    // It should only be callable by admin or faculty
    updateExamEligibility: async (req, res, next) => {
        try {
            const { moduleId } = req.params;
            const userRole = req.user?.role;

            if (!moduleId) {
                return res.status(400).json(responseError('Module ID is required', 400));
            }

            // Only ADMIN and FACULTY can update exam eligibility
            if (userRole !== 'ADMIN' && userRole !== 'FACULTY') {
                return res.status(403).json(responseError('Only administrators or faculty members can update exam eligibility', 403));
            }

            const results = await attendanceService.updateExamEligibilityForModule(moduleId);
            const resData = responseSuccess(results, 'Exam eligibility updated successfully for module');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Update exam eligibility for all students in all modules
    // This endpoint updates exam eligibility records for all modules at once
    // It should only be callable by admin or faculty
    updateExamEligibilityForAllModules: async (req, res, next) => {
        try {
            const userRole = req.user?.role;

            // Only ADMIN and FACULTY can update exam eligibility
            if (userRole !== 'ADMIN' && userRole !== 'FACULTY') {
                return res.status(403).json(responseError('Only administrators or faculty members can update exam eligibility', 403));
            }
            const results = await attendanceService.updateExamEligibilityForAllModules();
            const resData = responseSuccess(
                results,
                `Exam eligibility updated for all modules. Processed ${results.summary.total_modules_processed} modules. ${results.summary.total_students_success} students eligible, ${results.summary.total_students_failed} students ineligible for exams.`
            );
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Update exam eligibility for all students in lecturer's modules only
    // This endpoint updates exam eligibility records for lecturer's modules only
    // It should only be callable by lecturers for their own modules
    updateExamEligibilityForMyModules: async (req, res, next) => {
        try {
            const userRole = req.user?.role;
            const lecturerId = req.user?.uid;

            // Only LECTURER can access this endpoint
            if (userRole !== 'LECTURER') {
                return res.status(403).json(responseError('This endpoint is only accessible by lecturers', 403));
            }

            if (!lecturerId) {
                return res.status(400).json(responseError('Lecturer ID is required', 400));
            }

            const results = await attendanceService.updateExamEligibilityForLecturerModules(lecturerId);
            const resData = responseSuccess(
                results,
                `Exam eligibility updated for your modules. Processed ${results.summary.total_modules_processed} modules. ${results.summary.total_students_success} students eligible, ${results.summary.total_students_failed} students ineligible for exams.`
            );
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Export exam eligibility data to Excel files
    // This endpoint exports exam eligibility data to Excel files (one per module)
    // Only accessible by ADMIN and FACULTY
    exportExamEligibilityToExcel: async (req, res, next) => {
        try {
            const userRole = req.user?.role;

            // Only ADMIN and FACULTY can access this endpoint
            if (!['ADMIN', 'FACULTY', 'AC'].includes(userRole)) {
                return res.status(403).json(responseError('This endpoint is only accessible by administrators and faculty', 403));
            }

            const exportResults = await attendanceService.exportExamEligibilityToExcel();

            const resData = responseSuccess(
                {
                    export_summary: {
                        total_modules_processed: exportResults.totalModules,
                        successful_exports: exportResults.successfulExports,
                        failed_exports: exportResults.failedExports,
                        export_directory: exportResults.exportDirectory
                    },
                    export_results: exportResults.results
                },
                `Export completed successfully. Generated ${exportResults.successfulExports} Excel files out of ${exportResults.totalModules} modules processed.`
            );
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Export exam eligibility data to Excel files for lecturer's modules
    // This endpoint exports exam eligibility data to Excel files for a lecturer's modules only
    // Only accessible by LECTURER
    exportExamEligibilityForMyModulesToExcel: async (req, res, next) => {
        try {
            const userRole = req.user?.role;
            const lecturerId = req.user?.uid;

            // Only LECTURER can access this endpoint
            if (userRole !== 'LECTURER') {
                return res.status(403).json(responseError('This endpoint is only accessible by lecturers', 403));
            }

            if (!lecturerId) {
                return res.status(400).json(responseError('Lecturer ID is required', 400));
            }

            const exportResults = await attendanceService.exportExamEligibilityForLecturerToExcel(lecturerId);

            const resData = responseSuccess(
                {
                    lecturer_id: lecturerId,
                    export_summary: {
                        total_modules_processed: exportResults.totalModules,
                        successful_exports: exportResults.successfulExports,
                        failed_exports: exportResults.failedExports,
                        export_directory: exportResults.exportDirectory
                    },
                    export_results: exportResults.results
                },
                `Export completed successfully for lecturer ${lecturerId}. Generated ${exportResults.successfulExports} Excel files out of ${exportResults.totalModules} modules processed.`
            );
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    viewAttendanceRequestsByLecturerId: async (req, res, next) => {
        const lecturerId = req.params.lecturerId;
        const { class_id } = req.query;
        const result = await attendanceService.viewAttendanceRequestsByLecturerId(lecturerId, class_id);
        const resData = responseSuccess(result, 'Attendance requests retrieved successfully');
        res.status(resData.code).json(resData);
    },
};

export default attendanceManagement;

