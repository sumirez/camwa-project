'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('module', null, {});
    return queryInterface.bulkInsert('module', [
      {
        module_id: 'MOD001',
        name: 'Introduction to Programming',
        lecturer_id: 'LEC001',
        program_id: 'CS001',
        intake: 2023,
        semester_id: 'SUMMER2023'
      },
      {
        module_id: 'MOD002',
        name: 'Database Systems',
        lecturer_id: 'LEC002',
        program_id: 'IT001',
        intake: 2023,
        semester_id: 'SUMMER2023'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('module', null, {});
  }
};
