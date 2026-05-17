'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('student_intake_module', null, {});
    const records = [];

    const enrollments = [
      { student_id: 'STU001', intake_module_id: 'WD2023' },
      { student_id: 'STU001', intake_module_id: 'DB2023' },
      { student_id: 'STU002', intake_module_id: 'DB2023' },
      { student_id: 'STU003', intake_module_id: 'WD2023' },
      { student_id: 'STU004', intake_module_id: 'DB2023' },
      { student_id: 'STU005', intake_module_id: 'WD2023' },
      { student_id: 'STU006', intake_module_id: 'DB2023' },
      { student_id: 'STU007', intake_module_id: 'WD2023' },
      { student_id: 'STU008', intake_module_id: 'DB2023' },
      { student_id: 'STU009', intake_module_id: 'WD2023' },
      { student_id: 'STU010', intake_module_id: 'DB2023' },
      { student_id: 'STU011', intake_module_id: 'WD2023' },
      { student_id: 'STU012', intake_module_id: 'DB2023' },
      { student_id: 'STU013', intake_module_id: 'WD2023' },
      { student_id: 'STU014', intake_module_id: 'DB2023' },
      { student_id: 'STU015', intake_module_id: 'WD2023' },
      { student_id: 'STU016', intake_module_id: 'DB2023' },
      { student_id: 'STU017', intake_module_id: 'WD2023' },
      { student_id: 'STU018', intake_module_id: 'DB2023' },
      { student_id: 'STU019', intake_module_id: 'WD2023' },
      { student_id: 'STU020', intake_module_id: 'DB2023' },
      { student_id: 'STU021', intake_module_id: 'AP2023' },
      { student_id: 'STU022', intake_module_id: 'AP2023' },
      { student_id: 'STU023', intake_module_id: 'AP2023' },
      { student_id: 'STU024', intake_module_id: 'AP2023' },
      { student_id: 'STU025', intake_module_id: 'AP2023' },
      { student_id: 'STU026', intake_module_id: 'AP2023' },
      { student_id: 'STU027', intake_module_id: 'AP2023' },
      { student_id: 'STU028', intake_module_id: 'AP2023' },
    ];

    enrollments.forEach((e) => {
      records.push({
        student_id: e.student_id,
        intake_module_id: e.intake_module_id,
        enrollment_date: new Date('2021-08-01')
      });
    });

    return queryInterface.bulkInsert('student_intake_module', records);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('student_intake_module', null, {});
  }
};
