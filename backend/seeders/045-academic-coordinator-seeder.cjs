'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('academic_coordinator', null, {});
    return queryInterface.bulkInsert('academic_coordinator', [
      {
        ac_id: 'sonll',
        name: 'Le Lam Son',
        program_id: 'CSE',
        current_role: 'AC'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('academic_coordinator', null, {});
  }
};
