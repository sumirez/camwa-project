'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendance', null, {});
    return queryInterface.bulkInsert('attendance', [
      {
        student_id: 'STU001',
        intake_module_id: 'WD2023',
        attendance_status: 'present',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        student_id: 'STU002',
        intake_module_id: 'DB2023',
        attendance_status: 'absent',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('attendance', null, {});
  }
};