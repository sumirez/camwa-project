'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear existing data safely
    await queryInterface.bulkDelete('intake_module', null, {});

    return queryInterface.bulkInsert('intake_module', [
      {
        intake_module_id: 'WD2023',
        name: 'Web Development Module',
        capacity: 30,
        ects: 5,
        lecturer_id: 'LEC001',
        program_id: 'CS001',
        course_id: 1,
        intake: 2023,
        semester_id: 'SUMMER2023'
      },
      {
        intake_module_id: 'DB2023',
        name: 'Database Module',
        capacity: 30,
        ects: 5,
        lecturer_id: 'LEC002',
        program_id: 'IT001',
        course_id: 2,
        intake: 2023,
        semester_id: 'SUMMER2023'
      },
      {
        intake_module_id: 'AP2023',
        name: 'Advanced Mathematics',
        capacity: 25,
        ects: 6,
        lecturer_id: 'LEC003',
        program_id: 'CS001',
        course_id: 1,
        intake: 2023,
        semester_id: 'SUMMER2023'
      },
      {
        intake_module_id: 'SA2023',
        name: 'System Analysis',
        capacity: 25,
        ects: 6,
        lecturer_id: 'LEC004',
        program_id: 'IT001',
        course_id: 2,
        intake: 2023,
        semester_id: 'SUMMER2023'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('intake_module', null, {});
  }
};