import Attendance from '../models/Attendance.model.js';
import AttendanceRequest from '../models/AttendanceRequest.model.js';
import Class from '../models/Class.model.js';
import ExamTaking from '../models/ExamTaking.model.js';
import { sendMail } from '../common/nodemailer/send-mail.nodemailer.js';

const attendanceService = {
    // Create a new attendance request
    createAttendanceRequest: async (attendanceData) => {
        return await AttendanceRequest.create(attendanceData);
    },

    // View attendance requests by module
    viewAttendanceRequestsByModule: async (moduleId) => {
        return await AttendanceRequest.findAll({ where: { module_id: moduleId } });
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
    },

    // Submit attendance for a class or module
    submitAttendance: async (attendanceData) => {
        return await Attendance.create(attendanceData);
    },

    // View attendance by module
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
    },

    // Calculate attendance eligibility for a student based on the 80% rule
    calculateEligibility: async (studentId, moduleId, examDate) => {
        try {
            // Count total classes for the given module
            const totalClasses = await Class.count({ where: { intake_module_id: moduleId } });

            // If there are no classes scheduled, return a default response
            if (totalClasses === 0) {
                return { attendancePercentage: 0, eligibilityStatus: 'No Classes Scheduled' };
            }

            // Count the number of classes the student attended
            const attendedClasses = await Attendance.count({
                where: {
                    student_id: studentId,
                    intake_module_id: moduleId,
                    attendance_status: 'present'
                }
            });

            // Calculate attendance percentage
            const attendancePercentage = (attendedClasses / totalClasses) * 100;

            // Determine eligibility based on the 80% rule
            const isEligible = attendancePercentage >= 80;
            const eligibilityStatus = isEligible ? 'Eligible' : 'Not Eligible';

            // Update or insert exam eligibility in the ExamTaking table
            await ExamTaking.upsert({
                student_id: studentId,
                intake_module_id: moduleId,
                exam_date: examDate,  // Use provided exam date or keep it null if unknown
                is_eligible: isEligible
            });

            return { attendancePercentage, eligibilityStatus };
        } catch (error) {
            console.error('Error calculating eligibility:', error);
            throw new Error('Failed to calculate eligibility');
        }
    },




    // Retrieve exam eligibility status for a student
    viewExamEligibilityStatus: async (studentId, moduleId) => {
        const examStatus = await ExamTaking.findOne({
            where: { student_id: studentId, intake_module_id: moduleId}
        });
        return examStatus ? examStatus.is_eligible ? 'Eligible' : 'Not Eligible' : 'No Record';
    },

    // Handle attendance discrepancy - request correction
    requestAttendanceCorrection: async (studentId, moduleId, classId, requestDetails) => {
        const request = await AttendanceRequest.create({
            student_id: studentId,
            intake_module_id: moduleId,
            class_id: classId,
            status: 'pending',
            ...requestDetails
        });

        // Send email notification to student about the correction request submission
        await sendMail({
            to: 'student@example.com', // Replace with student's email
            subject: 'Attendance Correction Request Submitted',
            text: `Your attendance correction request for module ${moduleId} has been submitted successfully.`,
            html: `<p>Your attendance correction request for module ${moduleId} has been submitted successfully.</p>`
        });

        return request;
    },

    // Approve or deny attendance correction
    handleCorrectionRequest: async (requestId, approvalStatus) => {
        // Update the correction request's status
        await AttendanceRequest.update(
            { status: approvalStatus ? 'approved' : 'denied' },
            { where: { request_id: requestId } }
        );

        // If approved, update the attendance record accordingly
        if (approvalStatus) {
            const request = await AttendanceRequest.findOne({ where: { request_id: requestId } });
            if (request) {
                await Attendance.update(
                    { attendance_status: 'present' },  // Assuming correction to mark as present
                    { where: { student_id: request.student_id, intake_module_id: request.intake_module_id } }
                );
            }
            console.log(`Correction request ${requestId} approved and attendance updated.`);
        } else {
            console.log(`Correction request ${requestId} denied.`);
        }

        const request = await AttendanceRequest.findOne({ where: { request_id: requestId } });
        if (request) {
            // Send email notification about the correction decision
            await sendMail({
                to: 'student@example.com',  // Replace with student's email
                subject: `Attendance Correction ${approvalStatus ? 'Approved' : 'Denied'}`,
                text: `Your attendance correction request for module ${request.intake_module_id} has been ${approvalStatus ? 'approved' : 'denied'}.`,
                html: `<p>Your attendance correction request for module ${request.intake_module_id} has been ${approvalStatus ? 'approved' : 'denied'}.</p>`
            });
        }


        return approvalStatus ? 'Correction Approved' : 'Correction Denied';
    }
};

export default attendanceService;
