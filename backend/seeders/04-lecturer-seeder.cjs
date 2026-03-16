'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear existing data to avoid primary key conflicts
    await queryInterface.bulkDelete('lecturer', null, {});

    return queryInterface.bulkInsert('lecturer', [
      {
        lecturer_id: 'LEC001',
        name: 'John Doe',
        program_id: 'CS001',
        iam_id: 'LEC001',
      },
      {
        lecturer_id: 'LEC002',
        name: 'Jane Smith',
        program_id: 'IT001',
        iam_id: 'LEC002',
      },
      {
        lecturer_id: 'LEC003',
        name: 'Robert Brown',
        program_id: 'CS001',
        iam_id: 'LEC003',
      },
      {
        lecturer_id: 'LEC004',
        name: 'Emily Davis',
        program_id: 'IT001',
        iam_id: 'LEC004',
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('lecturer', null, {});
  }
};