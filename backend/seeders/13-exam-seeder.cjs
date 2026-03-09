'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('exam', null, {});
    return queryInterface.bulkInsert('exam', [
      {
        module_id: 'WD2023',
        exam_date: '2023-12-15',
        duration: 120,
        proctors: 'John Doe, Jane Smith'
      },
      {
        module_id: 'DB2023',
        exam_date: '2023-12-20',
        duration: 180,
        proctors: 'Alice Brown, Bob Wilson'
      },
      {
        module_id: 'AP2023',
        exam_date: '2023-12-25',
        duration: 120,
        proctors: 'Charlie Davis, Diana Prince'
      },
      {
        module_id: 'SA2023',
        exam_date: '2023-12-30',
        duration: 180,
        proctors: 'Ethan Hunt, Fiona Gallagher'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('exam', null, {});
  }
};
