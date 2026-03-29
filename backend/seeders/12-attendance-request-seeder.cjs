'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendance_request', null, {});

    // Look up actual attendance IDs instead of hardcoding them
    const [attendances] = await queryInterface.sequelize.query(
      `SELECT attendance_id, student_id, intake_module_id FROM attendance WHERE student_id IN ('STU001', 'STU002')`
    );

    const byStudent = {};
    for (const row of attendances) {
      byStudent[row.student_id] = row.attendance_id;
    }

    return queryInterface.bulkInsert('attendance_request', [
      {
        attendance_id: byStudent['STU001'],
        student_id: 'STU001',
        intake_module_id: 'WD2023',
        request_status: 'pending',
        proposed_status: 'present',
        reason: 'Medical appointment',
        created_at: new Date()
      },
      {
        attendance_id: byStudent['STU002'],
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
