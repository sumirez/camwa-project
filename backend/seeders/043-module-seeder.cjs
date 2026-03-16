'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('module', null, {});
    // return queryInterface.bulkInsert('module', [
    //   {
    //     module_id: 'MOD001',
    //     name: 'Introduction to Programming',
    //     lecturer_id: 'STAFF001',
    //     program_id: 'PROG001',
    //     intake: 2023,
    //     semester_id: 'SEM001'
    //   },
    //   {
    //     module_id: 'MOD002',
    //     name: 'Database Systems',
    //     lecturer_id: 'STAFF002',
    //     program_id: 'PROG002',
    //     intake: 2023,
    //     semester_id: 'SEM001'
    //   }
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('module', null, {});
  }
};
