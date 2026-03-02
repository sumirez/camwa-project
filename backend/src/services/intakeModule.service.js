import IntakeModule from '../models/IntakeModules.model.js';
import Program from '../models/Program.model.js';
import Semester from '../models/Semester.model.js';
import Lecturer from '../models/Lecturer.model.js';
import StudentIntakeModule from '../models/StudentIntakeModule.model.js';
import Student from '../models/Student.model.js';
import sequelize from '../common/sequelize/connect.sequelize.js';
import { Op } from 'sequelize';

const intakeModuleService = {
  getAllIntakeModules: async (filteredActive) => {
    try {
      let whereClause = {};
      if (filteredActive) {
        const currentYear = parseInt(new Date().getFullYear());
        const fourYearsAgo = currentYear - 4;
        whereClause = {
          intake: {
            [Op.between]: [parseInt(fourYearsAgo), parseInt(currentYear)]
          }
        };
      }
  
      const modules = await IntakeModule.findAll({
        where: whereClause,
        include: [
          {
            model: Program,
            attributes: ['name'],
          },
          {
            model: Semester,
            attributes: ['sem_id'],
          },
          {
            model: Lecturer,
            attributes: ['name'],
          }
        ],
        attributes: [
          'intake_module_id',
          'name',
          'intake',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM student_intake_module WHERE student_intake_module.intake_module_id = "IntakeModule".intake_module_id)'
            ),
            'student_count'
          ]
        ]
      });
  
      return modules.map(module => ({
        moduleId: module.intake_module_id,
        moduleName: module.name,
        programName: module.Program.name,
        semesterId: module.Semester.sem_id,
        intakeYear: module.intake,
        lecturerName: module.Lecturer.name,
        studentCount: module.dataValues.student_count
      }));
  
    } catch (error) {
      throw new Error('Error retrieving intake modules: ' + error.message);
    }
  },

  getModuleDetails: async (moduleId) => {
    try {
      const moduleDetails = await IntakeModule.findOne({
        where: {
          intake_module_id: moduleId
        },
        include: [
          {
            model: Program,
            attributes: ['name'],
          },
          {
            model: Semester,
            attributes: ['sem_id'],
          },
          {
            model: Lecturer,
            attributes: ['name'],
          }
        ],
        attributes: [
          'intake_module_id',
          'name',
          'intake',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM student_intake_module WHERE student_intake_module.intake_module_id = "IntakeModule".intake_module_id)'
            ),
            'student_count'
          ]          
        ]
      });

      if (!moduleDetails) {
        throw new Error('Module not found');
      }

      return {
        moduleId: moduleDetails.intake_module_id,
        moduleName: moduleDetails.name,
        programName: moduleDetails.Program.name,
        semesterId: moduleDetails.Semester.sem_id,
        intakeYear: moduleDetails.intake,
        lecturerName: moduleDetails.Lecturer.name,
        studentCount: moduleDetails.dataValues.student_count
      };

    } catch (error) {
      throw new Error('Error retrieving module details: ' + error.message);
    }
  },

  createIntakeModule: async (moduleData) => {
    try {
      const newModule = await IntakeModule.create({
        intake_module_id: moduleData.moduleId,
        name: moduleData.name,
        capacity: moduleData.capacity,
        ects: moduleData.ects,
        lecturer_id: moduleData.lecturerId,
        program_id: moduleData.programId,
        course_id: moduleData.courseId,
        intake: moduleData.intake,
        semester_id: moduleData.semesterId
      });
  
      return await intakeModuleService.getModuleDetails(newModule.intake_module_id);
    } catch (error) {
      throw new Error('Error creating intake module: ' + error.message);
    }
  },
  
  deleteIntakeModule: async (moduleId) => {
    try {
      const result = await IntakeModule.destroy({
        where: {
          intake_module_id: moduleId
        }
      });
  
      if (!result) {
        throw new Error('Module not found');
      }
    } catch (error) {
      throw new Error('Error deleting intake module: ' + error.message);
    }
  },
  
  updateIntakeModule: async (moduleId, moduleData) => {
    try {
      const [updated] = await IntakeModule.update({
        name: moduleData.name,
        capacity: moduleData.capacity,
        ects: moduleData.ects,
        lecturer_id: moduleData.lecturerId,
        program_id: moduleData.programId,
        course_id: moduleData.courseId,
        intake: moduleData.intake,
        semester_id: moduleData.semesterId
      }, {
        where: {
          intake_module_id: moduleId
        }
      });
  
      if (!updated) {
        throw new Error('Module not found');
      }
  
      return await intakeModuleService.getModuleDetails(moduleId);
    } catch (error) {
      throw new Error('Error updating intake module: ' + error.message);
    }
  },

  getModuleStudents: async (moduleId) => {
    try {
      const students = await StudentIntakeModule.findAll({
        where: {
          intake_module_id: moduleId
        },
        include: [{
          model: Student,
          attributes: [
            'student_id',
            'name',
            'map_location',
            'program_id',
            'intake'
          ]
        }],
        attributes: ['enrollment_date']
      });
    
      return students.map(enrollment => ({
        studentId: enrollment.Student.student_id,
        name: enrollment.Student.name,
        mapLocation: enrollment.Student.map_location,
        intakeYear: enrollment.Student.intake,
        programId: enrollment.Student.program_id, // Use program_id instead of Program.name
        enrollmentDate: enrollment.enrollment_date
      }));
    } catch (error) {
      throw new Error('Error retrieving module students: ' + error.message);
    }
  }    
};

export default intakeModuleService;
