'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('TRUNCATE TABLE "course" RESTART IDENTITY CASCADE;');

    return queryInterface.bulkInsert('course', [
      { 
        name: 'Introduction to Programming',
        lecturer_id: 'LEC001',
        program_id: 'CS001',
        intake: '2023',
        semester_id: 'SUMMER2023'
      },
      {
        name: 'Database Systems',
        lecturer_id: 'LEC002',
        program_id: 'IT001',
        intake: '2023',
        semester_id: 'SUMMER2023'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('course', null, {});
  }
};