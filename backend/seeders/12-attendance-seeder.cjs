'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendance', null, {});
    const now = new Date();
    // return queryInterface.bulkInsert('attendance', [
    //   {
    //     student_id: 'STU001',
    //     module_id: 'MOD001',
    //     attendance_status: 'present',
    //     created_at: now,
    //     updated_at: now
    //   },
    //   {
    //     student_id: 'STU002',
    //     module_id: 'MOD002',
    //     attendance_status: 'absent',
    //     created_at: now,
    //     updated_at: now
    //   },
    //   {
    //     student_id: 'STU001',
    //     module_id: 'MOD002',
    //     attendance_status: 'late',
    //     created_at: now,
    //     updated_at: now
    //   }
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('attendance', null, {});
  }
};
