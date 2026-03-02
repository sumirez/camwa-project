'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('TRUNCATE TABLE "course" RESTART IDENTITY CASCADE;');

    return queryInterface.bulkInsert('course', [
      { 
        name: 'Introduction to Programming',
        lecturer_id: 'STAFF001',
        program_id: 'PROG001',
        intake: '2023',
        semester_id: 'SEM001'
      },
      {
        name: 'Database Systems',
        lecturer_id: 'STAFF002',
        program_id: 'PROG002',
        intake: '2023',
        semester_id: 'SEM001'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('course', null, {});
  }
};