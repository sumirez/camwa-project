'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('exam', null, {});
    const currentDate = new Date();
    
    return queryInterface.bulkInsert('exam', [
      {
        intake_module_id: 'WD2023',
        student_id: 'STU001',
        attendance_rate: 85.5,
        is_eligible: true,
        created_at: currentDate,
        updated_at: currentDate
      },
      {
        intake_module_id: 'DB2023',
        student_id: 'STU002',
        attendance_rate: 75.0,
        is_eligible: false,
        created_at: currentDate,
        updated_at: currentDate
      },
      {
        intake_module_id: 'AP2023',
        student_id: 'STU003',
        attendance_rate: 92.5,
        is_eligible: true,
        created_at: currentDate,
        updated_at: currentDate
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('exam', null, {});
  }
};
