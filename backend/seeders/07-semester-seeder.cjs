'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('semester', null, {});
    return queryInterface.bulkInsert('semester', [
      {
        sem_id: 'SUMMER2023',
        sem_type: 'SUMMER',
        start_date: '2023-09-01',
        end_date: '2023-12-31'
      },
      {
        sem_id: 'WINTER2024',
        sem_type: 'WINTER',
        start_date: '2024-01-01',
        end_date: '2024-05-31'
      },
      {
        sem_id: 'SUMMER2024',
        sem_type: 'SUMMER',
        start_date: '2024-06-01',
        end_date: '2024-09-30'
      },
      {
        sem_id: 'WINTER2025',
        sem_type: 'WINTER',
        start_date: '2025-01-01',
        end_date: '2025-05-31'
      },
      {
        sem_id: 'SUMMER2025',
        sem_type: 'SUMMER',
        start_date: '2025-06-01',
        end_date: '2025-09-30'
      },
      {
        sem_id: 'WINTER2026',
        sem_type: 'WINTER',
        start_date: '2026-01-01',
        end_date: '2026-05-31'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('semester', null, {});
  }
};
