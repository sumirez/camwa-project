import courseService from "../services/course.service.js";
import { responseError, responseSuccess } from "../common/helpers/response.helper.js";
import ExcelJS from 'exceljs';

const courseManagement = {
    // Create Course (Admin only)
    createCourse: async (req, res, next) => {
        try {
            const courseData = req.body;
            const userId = req.user.uid;
            const result = await courseService.createCourse(courseData, userId);
            const resData = responseSuccess(result, 'Course created successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            console.error("Failed to create course:", error);
            const resError = responseError(error, 'Failed to create course');
            res.status(resError.code).json(resError);
        }
    },

    // View Courses (List all courses, for Admin/Faculty Assistant)
    viewCourses: async (req, res, next) => {
        try {
            const result = await courseService.viewCourses();
            const resData = responseSuccess(result, 'Courses retrieved successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Assign Lecturer to Intake Module (Faculty Assistant only)
    assignLecturerToIntakeModule: async (req, res, next) => {
        try {
            const intakeModuleId = req.params.intakeModuleId;
            const lecturerId = req.body.lecturerId;
            const userId = req.user.id;
            const result = await courseService.assignLecturerToIntakeModule(intakeModuleId, lecturerId, userId);
            const resData = responseSuccess(result, 'Lecturer assigned to intake module successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            console.error("Failed to assign lecturer to intake module:", error);
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Assign Students to Intake Module (Faculty Assistant only)
    assignStudentsToIntakeModule: async (req, res, next) => {
        try {
            const intakeModuleId = req.params.intakeModuleId;
            const studentIds = req.body.studentIds;
            const userId = req.user.id;
            const result = await courseService.assignStudentsToIntakeModule(intakeModuleId, studentIds, userId);
            const resData = responseSuccess(result, 'Students assigned to intake module successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            console.error("Failed to assign students to intake module:", error);
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Create Classes for Intake Module (Faculty Assistant)
    createClassesForIntakeModule: async (req, res, next) => {
        try {
            const intakeModuleId = req.params.intakeModuleId;
            const userId = req.user.id;
            const result = await courseService.createClassesForIntakeModule(intakeModuleId, userId);
            const resData = responseSuccess(result, 'Classes created for intake module successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            console.error("Failed to create classes for intake module:", error);
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Export Intake Module Report (Faculty Assistant only)
    exportIntakeModuleReport: async (req, res, next) => {
        try {
            const intakeModuleId = req.params.intakeModuleId;
            const reportData = await courseService.getIntakeModuleAnalytics(intakeModuleId);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Intake Module Report');

            // Set up the header row
            worksheet.columns = [
                { header: 'No.', key: 'no', width: 5 },
                { header: 'Student Name', key: 'studentName', width: 30 },
                { header: 'Student ID', key: 'studentId', width: 15 },
                // Add dynamic columns for each attendance date
                ...reportData.dates.map(date => ({ header: date, key: date, width: 15 }))
            ];

            // Fill in the rows
            reportData.students.forEach((student, index) => {
                const row = {
                    no: index + 1,
                    studentName: student.name,
                    studentId: student.id,
                    ...student.attendance // Spread attendance data with date keys
                };
                worksheet.addRow(row);
            });

            // Set the response headers and send the Excel file
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=intake_module_report.xlsx'
            );

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error("Failed to export intake module report:", error);
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Update Course (Admin/Faculty Assistant)
    updateCourse: async (req, res, next) => {
        try {
            const courseId = req.params.courseId;
            const updatedData = req.body;
            const userId = req.user.id;
            const result = await courseService.updateCourse(courseId, updatedData, userId);
            const resData = responseSuccess(result, 'Course updated successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },

    // Delete Course (Admin only)
    deleteCourse: async (req, res, next) => {
        try {
            const courseId = req.params.courseId;
            const userId = req.user.id;
            const result = await courseService.deleteCourse(courseId, userId);
            const resData = responseSuccess(result, 'Course deleted successfully');
            res.status(resData.code).json(resData);
        } catch (error) {
            const resError = responseError(error);
            res.status(resError.code).json(resError);
        }
    },
};

export default courseManagement;
