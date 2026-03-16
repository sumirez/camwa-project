'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('course', null, {});
    return queryInterface.bulkInsert('course', [
      {
        course_id: 'CS101',
        name: 'Introduction to Computer Science',
        program_id: 'CS001',
        curriculum_year: 2023
      },
      {
        course_id: 'IT101',
        name: 'Information Technology Fundamentals',
        program_id: 'IT001',
        curriculum_year: 2023
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('course', null, {});
  }
};
