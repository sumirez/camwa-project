'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('exam_taking', null, {});
    return queryInterface.bulkInsert('exam_taking', [
      {
        student_id: 'STU001',
        intake_module_id: 'WD2023',
        exam_date: '2023-12-15',
        is_eligible: true
      },
      {
        student_id: 'STU002',
        intake_module_id: 'DB2023',
        exam_date: '2023-12-20',
        is_eligible: true
      },
      {
        student_id: 'STU003',
        intake_module_id: 'AP2023',
        exam_date: '2023-12-25',
        is_eligible: true
      },
      {
        student_id: 'STU004',
        intake_module_id: 'SA2023',
        exam_date: '2023-12-30',
        is_eligible: true
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('exam_taking', null, {});
  }
};
