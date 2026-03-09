'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendance_request', null, {});
    return queryInterface.bulkInsert('attendance_request', [
      {
        student_id: 'STU001',
        class_id: '7a34ee3d-3fe4-49d1-8e15-3a251ddf8e5f',
        intake_module_id: 'WD2023',
        lecturer_id: 'LEC001',
        request_date: '2023-09-14',
        status: 'pending',
        reason: 'Medical appointment'
      },
      {
        student_id: 'STU002',
        class_id: '24ee01f1-25b4-43fd-a8af-071bc705311e',
        intake_module_id: 'DB2023',
        lecturer_id: 'LEC002',
        request_date: '2023-09-15',
        status: 'approved',
        reason: 'Family emergency'
      },
      {
        student_id: 'STU003',
        class_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        intake_module_id: 'AP2023',
        lecturer_id: 'LEC003',
        request_date: '2023-09-16',
        status: 'rejected',
        reason: 'Personal reason'
      },
      {
        student_id: 'STU004',
        class_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        intake_module_id: 'SA2023',
        lecturer_id: 'LEC004',
        request_date: '2023-09-17',
        status: 'pending',
        reason: 'Family emergency'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('attendance_request', null, {});
  }
};
