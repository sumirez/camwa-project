import attendanceService from "../services/attendance.service.js";
import { responseError, responseSuccess } from "../common/helpers/response.helper.js";

const attendanceManagement = {
    // Create Attendance (Automated or Manual)
    createAttendance: async (req, res, next) => {
        try {
            const attendanceData = req.body;
            const result = await attendanceService.submitAttendance(attendanceData);
            const resData = responseSuccess(result, 'Attendance recorded successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
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

    // Calculate Exam Eligibility
    calculateEligibility: async (req, res, next) => {
        try {
            const { studentId, moduleId, examDate } = req.query;
            const result = await attendanceService.calculateEligibility(studentId, moduleId, examDate);
            const resData = responseSuccess(result, 'Eligibility calculated successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // View Exam Eligibility Status
    viewExamEligibilityStatus: async (req, res, next) => {
        try {
            const { studentId, moduleId } = req.query;
            const result = await attendanceService.viewExamEligibilityStatus(studentId, moduleId);
            const resData = responseSuccess(result, 'Exam eligibility status retrieved successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Request Attendance Correction
    requestAttendanceCorrection: async (req, res, next) => {
        try {
            const { studentId, moduleId, classId} = req.body;
            const requestDetails = req.body;
            const result = await attendanceService.requestAttendanceCorrection(studentId, moduleId, classId, requestDetails);
            const resData = responseSuccess(result, 'Attendance correction request submitted successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Approve/Deny Attendance Correction Request
    handleCorrectionRequest: async (req, res, next) => {
        try {
            const requestId = req.params.requestId;
            const { approvalStatus } = req.body; // true for approval, false for denial
            const result = await attendanceService.handleCorrectionRequest(requestId, approvalStatus);
            const resData = responseSuccess(result, `Correction request ${approvalStatus ? 'approved' : 'denied'} successfully`);
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

