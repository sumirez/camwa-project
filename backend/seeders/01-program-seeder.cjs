'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('program', null, {});
    return queryInterface.bulkInsert('program', [
      {
        program_id: 'CS001',
        name: 'Computer Science'
      },
      {
        program_id: 'IT001',
        name: 'Information Technology'
      },
      {
        program_id: 'IS001',
        name: 'Information Systems'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('program', null, {});
  }
};
