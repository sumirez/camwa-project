import Class from '../models/Class.model.js';
import Attendance from '../models/Attendance.model.js';
import StudentIntakeModule from '../models/StudentIntakeModule.model.js';

const classService = {
    createClass: async (classData) => {
        return await Class.create(classData);
    },

    viewClassesByIntakeModule: async (intakeModuleId) => {
        return await Class.findAll({ where: { intake_module_id: intakeModuleId } });
    },

    viewClassesByLecturer: async (lecturerId) => {
        return await Class.findAll({ where: { lecturer_id: lecturerId } });
    },

    viewClassesForStudent: async (studentId) => {
        const records = await StudentIntakeModule.findAll({
            where: { student_id: studentId },
            attributes: ['intake_module_id']
        });
        const intakeModuleIds = records.map((item) => item.intake_module_id);
        if (intakeModuleIds.length === 0) {
            return [];
        }
        return await Class.findAll({ where: { intake_module_id: intakeModuleIds } });
    },

    assignLecturerToClass: async (classId, lecturerId) => {
        await Class.update({ lecturer_id: lecturerId }, { where: { class_id: classId } });
        return await Class.findByPk(classId);
    },

    assignStudentsToClass: async (classId, studentIds) => {
        return { class_id: classId, student_ids: studentIds || [] };
    },

    updateClass: async (classId, updatedData) => {
        await Class.update(updatedData, { where: { class_id: classId } });
        return await Class.findByPk(classId);
    },

    deleteClass: async (classId) => {
        return await Class.destroy({ where: { class_id: classId } });
    },

    viewStudentAttendance: async (classId) => {
        return await Attendance.findAll({ where: { class_id: classId } });
    },

    viewStudentAttendanceRate: async (moduleId) => {
        return await Attendance.findAll({ where: { intake_module_id: moduleId } });
    }
};

export default classService;
