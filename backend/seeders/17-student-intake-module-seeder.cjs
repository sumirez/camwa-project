'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('student_intake_module', null, {});
    return queryInterface.bulkInsert('student_intake_module', [
      {
        student_id: 'STU001',
        intake_module_id: 'WD2023',
        enrollment_date: new Date()
      },
      {
        student_id: 'STU001',
        intake_module_id: 'DB2023',
        enrollment_date: new Date()
      },
      {
        student_id: 'STU002',
        intake_module_id: 'DB2023',
        enrollment_date: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('student_intake_module', null, {});
  }
};
