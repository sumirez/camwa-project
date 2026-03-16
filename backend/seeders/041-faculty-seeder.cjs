'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('facility_faculty', null, {});
    return queryInterface.bulkInsert('facility_faculty', [
      {
        staff_id: 'FAC001',
        name: 'Alice Johnson',
        program_id: 'CS001'
      },
      {
        staff_id: 'FAC002',
        name: 'Bob Brown',
        program_id: 'IT001'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('facility_faculty', null, {});
  }
};
