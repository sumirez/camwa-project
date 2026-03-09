'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('program', null, {});
    return queryInterface.bulkInsert('program', [
      {
        program_id: 'CS001',
        name: 'Computer Science',
        duration: 4
      },
      {
        program_id: 'IT001',
        name: 'Information Technology',
        duration: 3
      },
      {
        program_id: 'IS001',
        name: 'Information Systems',
        duration: 4
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('program', null, {});
  }
};
