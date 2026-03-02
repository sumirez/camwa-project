'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear existing data safely
    await queryInterface.bulkDelete('intake_module', null, {});

    return queryInterface.bulkInsert('intake_module', [
      {
        intake_module_id: 'IM001',
        name: 'Web Development Module',
        capacity: 30,
        ects: 5,
        lecturer_id: 'STAFF001', // Must exist in 'lecturer' table
        program_id: 'PROG001',   // Must exist in 'program' table
        course_id: 1,            // Must exist in 'course' table
        intake: 2023,            // This matches your migration column name
        semester_id: 'SEM001'    // Must exist in 'semester' table
      },
      {
        intake_module_id: 'IM002',
        name: 'Database Module',
        capacity: 30,
        ects: 5,
        lecturer_id: 'STAFF002',
        program_id: 'PROG002',
        course_id: 2,
        intake: 2023,
        semester_id: 'SEM001'
      },
      {
        intake_module_id: 'IM003',
        name: 'Advanced Programming',
        capacity: 25,
        ects: 6,
        lecturer_id: 'STAFF001',
        program_id: 'PROG001',
        course_id: 1,
        intake: 2023,
        semester_id: 'SEM001'
      },
      {
        intake_module_id: 'IM004',
        name: 'System Analysis',
        capacity: 25,
        ects: 6,
        lecturer_id: 'STAFF002',
        program_id: 'PROG002',
        course_id: 2,
        intake: 2023,
        semester_id: 'SEM001'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('intake_module', null, {});
  }
};