import Course from '../models/Course.model.js';
import Lecturer from '../models/Lecturer.model.js';
import Student from '../models/Student.model.js';
import IntakeModule from '../models/IntakeModules.model.js';
import Class from '../models/Class.model.js';
import Attendance from '../models/Attendance.model.js';
import auditLogService from '../services/auditLogService.js';
import { sendMail } from '../common/nodemailer/send-mail.nodemailer.js';
import StudentIntakeModule from '../models/StudentIntakeModule.model.js';

const courseService = {
    // Create a new course (Admin only)
    createCourse: async (courseData, userId) => {
        const course = await Course.create(courseData);
        await auditLogService.logAction(userId, 'createCourse', course);
        return course;
    },

    // View all courses (Admin/Faculty Assistant)
    viewCourses: async () => {
        return await Course.findAll();
    },

    // View courses by lecturer (Lecturer)
    viewCoursesByLecturer: async (lecturerId) => {
        return await Course.findAll({ where: { lecturer_id: lecturerId } });
    },

    // View intake modules by student (Student)
    viewCoursesForStudent: async (studentId) => {
        return await IntakeModule.findAll({
            include: [{
                model: Student,
                where: { student_id: studentId }
            }]
        });
    },

    // Assign a lecturer to an intake module (Faculty Assistant)
    assignLecturerToIntakeModule: async (intakeModuleId, lecturerId, userId) => {
        // Check if the lecturer exists
        const lecturer = await Lecturer.findByPk(lecturerId);
        if (!lecturer) {
            throw new Error('Lecturer not found');
        }

        // Get the lecturer's email
        // const lecturerEmail = lecturer.email;
        
        // Assign lecturer to the intake module
        const result = await IntakeModule.update(
            { lecturer_id: lecturerId },
            { where: { intake_module_id: intakeModuleId } }
        );
    
        await auditLogService.logAction(userId, 'assignLecturer', { intakeModuleId, lecturerId });
        // Send email notification to lecturer
        // await sendMail({
        //     to: lecturerEmail,  
        //     subject: 'You Have Been Assigned to a New Course',
        //     text: `You have been assigned to module ${intakeModuleId}.`,
        //     html: `<p>You have been assigned to module <b>${intakeModuleId}</b>.</p>`
        // });

        return result;
    },

    // Assign students to an intake module (Faculty Assistant)
    assignStudentsToIntakeModule: async (intakeModuleId, studentIds, userId) => {
        const students = await Student.findAll({ where: { student_id: studentIds } });
        if (students.length !== studentIds.length) {
            // Check if the number of found students matches the input studentIds
            const missingStudents = studentIds.filter(id => !students.some(student => student.student_id === id));  // Find missing students
            throw new Error(`Some students not found: ${missingStudents.join(', ')}`);
        }
        const intakeModule = await IntakeModule.findByPk(intakeModuleId);
        if (!intakeModule) {
            throw new Error('Intake module not found');
        }

        const studentIntakeModules = await Promise.all(
            studentIds.map(studentId => 
                StudentIntakeModule.create({
                    student_id: studentId,
                    intake_module_id: intakeModuleId
                })
            )
        );
    
        await auditLogService.logAction(userId, 'assignStudents', { intakeModuleId, studentIds });
        
        // Send email notification to students
        // await sendMail({
        //     to: students.map(student => student.email),  // Send email to the students' actual emails
        //     subject: 'You Have Been Enrolled in a New Course',
        //     text: `You have been enrolled in module ${intakeModuleId}.`,
        //     html: `<p>You have been enrolled in module <b>${intakeModuleId}</b>.</p>`
        // });

        return intakeModule;
    },

    // Create classes for an intake module (Admin)
    createClassesForIntakeModule: async (intakeModuleId, classCount = 15, userId) => {
        const intakeModule = await IntakeModule.findByPk(intakeModuleId);
        if (!intakeModule) {
            throw new Error('Intake module not found');
        }

        // Create classes for the intake module
        const classes = [];
        for (let i = 1; i <= classCount; i++) {
            classes.push({
                intake_module_id: intakeModuleId,
                class_number: i,
                class_date: new Date(), // Here you can set a specific date or logic for the class date
            });
        }
        // Insert all the classes into the database in bulk
        await Class.bulkCreate(classes); 

         // Optionally log the action
        await auditLogService.logAction(userId, 'createClasses', { intakeModuleId, classCount });
        
        return classes;
    },

    // Get Intake Module Analytics for Export
    getIntakeModuleAnalytics: async (intakeModuleId) => {
        // Retrieve students enrolled in the intake module
        const students = await Student.findAll({
            include: {
                model: IntakeModule,
                where: { intake_module_id: intakeModuleId }
            }
        });

        // Retrieve attendance records for each student
        const attendanceRecords = await Attendance.findAll({
            where: { intake_module_id: intakeModuleId }
        });

        // Format the data to structure attendance by student and date
        const dates = [...new Set(attendanceRecords.map(record => record.class_date))]; // Unique dates
        const studentsData = students.map(student => {
            const attendance = {};
            dates.forEach(date => {
                const record = attendanceRecords.find(
                    r => r.student_id === student.student_id && r.class_date === date
                );
                attendance[date] = record ? (record.attendance_status === 'present' ? 'present' : 'absent') : 'absent';
            });
            return {
                id: student.student_id,
                name: student.name,
                attendance
            };
        });

        return { dates, students: studentsData };
    },


    // Update a course by course_id (Admin/Faculty Assistant)
    updateCourse: async (courseId, updatedData, userId) => {
        const [affectedCount] = await Course.update(updatedData, { where: { course_id: courseId } });  // Update course in the database
        if (affectedCount === 0) {
            throw new Error('Course not found or no changes made');  // Handle case where course was not found or no changes were made
        }
        await auditLogService.logAction(userId, 'updateCourse', { courseId, updatedData });  // Log the update action with userId
        return await Course.findByPk(courseId);  // Return the updated course object
    },

    // Delete a course by course_id (Admin only)
    deleteCourse: async (courseId, userId) => {
        const affectedRows = await Course.destroy({ where: { course_id: courseId } });  // Delete course from the database
        if (affectedRows === 0) {
            throw new Error('Course not found');  // Handle case where course was not found
        }
        await auditLogService.logAction(userId, 'deleteCourse', { courseId });  // Log the deletion action with userId
        return { message: 'Course successfully deleted' };  // Return success message
    },

};

export default courseService;
