'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear existing data to avoid primary key conflicts
    await queryInterface.bulkDelete('lecturer', null, {});

    return queryInterface.bulkInsert('lecturer', [
      {
        staff_id: 'LEC001',
        name: 'John Doe',
        program_id: 'CS001',
      },
      {
        staff_id: 'LEC002',
        name: 'Jane Smith',
        program_id: 'IT001',
      },
      {
        staff_id: 'LEC003',
        name: 'Robert Brown',
        program_id: 'CS001',
      },
      {
        staff_id: 'LEC004',
        name: 'Emily Davis',
        program_id: 'IT001',
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('lecturer', null, {});
  }
};