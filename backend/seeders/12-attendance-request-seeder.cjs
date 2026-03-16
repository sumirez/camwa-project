'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendance_request', null, {});

    // Assuming attendance_id 1 exists from attendance seeder
    return queryInterface.bulkInsert('attendance_request', [
      {
        attendance_id: 1,
        student_id: 'STU001',
        intake_module_id: 'WD2023',
        request_status: 'pending',
        proposed_status: 'present',
        reason: 'Medical appointment',
        created_at: new Date()
      },
      {
        attendance_id: 2,
        student_id: 'STU002',
        intake_module_id: 'DB2023',
        request_status: 'approved',
        proposed_status: 'present',
        reason: 'Family emergency',
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('attendance_request', null, {});
  }
};
