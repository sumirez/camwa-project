'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('module', [
      {
        module_id: 'TCS',
        name: 'Theory of Computer Science',
        lecturer_id: 'LEC001',
        program_id: 'CS001',
        intake: 2023,
        semester_id: 'SUMMER2023',
        camera_path: '1.mp4'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('module', {
      module_id: 'TCS'
    }, {});
  }
};
