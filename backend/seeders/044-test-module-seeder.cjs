'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('module', [
      {
        module_id: 'TCS',
        name: 'Theory of Computer Science',
        lecturer_id: 'STAFF001', // Assuming this lecturer exists from other seeders
        program_id: 'PROG001',   // Assuming this program exists from other seeders
        intake: 2023,
        semester_id: 'SEM001',   // Assuming this semester exists from other seeders
        camera_path: '1.mp4'     // This is the key field for our camera path API
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('module', {
      module_id: 'TCS'
    }, {});
  }
};
