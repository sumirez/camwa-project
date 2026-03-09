'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear existing data safely
    await queryInterface.bulkDelete('class', null, {});

    return queryInterface.bulkInsert('class', [
      {
        class_id: '7a34ee3d-3fe4-49d1-8e15-3a251ddf8e5f', 
        intake_module_id: 'WD2023',
        class_number: 1,
        class_date: '2023-09-15',
        start_time: '09:00:00',
        end_time: '11:00:00',
        lecturer_id: 'LEC001'
      },
      {
        class_id: '24ee01f1-25b4-43fd-a8af-071bc705311e', 
        intake_module_id: 'DB2023',
        class_number: 2,
        class_date: '2023-09-16',
        start_time: '14:00:00',
        end_time: '16:00:00',
        lecturer_id: 'LEC002'
      },
      {
        class_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 
        intake_module_id: 'AP2023',
        class_number: 2,
        class_date: '2023-09-17',
        start_time: '09:00:00',
        end_time: '11:00:00',
        lecturer_id: 'LEC001'
      },
      {
        class_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
        intake_module_id: 'SA2023',
        class_number: 1,
        class_date: '2023-09-18',
        start_time: '10:30:00',
        end_time: '12:30:00',
        lecturer_id: 'LEC003'
      },
      {
        class_id: '550e8400-e29b-41d4-a716-446655440000', 
        intake_module_id: 'DB2023',
        class_number: 3,
        class_date: '2023-09-19',
        start_time: '13:00:00',
        end_time: '15:00:00',
        lecturer_id: 'LEC002'
      },
      {
        class_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 
        intake_module_id: 'SA2023',
        class_number: 1,
        class_date: '2023-09-20',
        start_time: '08:00:00',
        end_time: '10:00:00',
        lecturer_id: 'LEC004'
      },
      {
        class_id: 'ad644917-09d6-4497-8d2a-e6270e599b82', 
        intake_module_id: 'AP2023',
        class_number: 2,
        class_date: '2023-09-21',
        start_time: '11:00:00',
        end_time: '13:00:00',
        lecturer_id: 'LEC003'
      },
      {
        class_id: '3e449231-318e-473d-82d8-4f16b2302364', 
        intake_module_id: 'WD2023',
        class_number: 3,
        class_date: '2023-09-22',
        start_time: '15:30:00',
        end_time: '17:30:00',
        lecturer_id: 'LEC001'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('class', null, {});
  }
};