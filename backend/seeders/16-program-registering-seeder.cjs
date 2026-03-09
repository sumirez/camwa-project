'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('program_registering', null, {});
    return queryInterface.bulkInsert('program_registering', [
      {
        student_id: 'STU001',
        program_id: 'CS001',
        intake: 2023
      },
      {
        student_id: 'STU002',
        program_id: 'IT001',
        intake: 2022
      },
      {
        student_id: 'STU003',
        program_id: 'IS001',
        intake: 2023
      },
      {
        student_id: 'STU004',
        program_id: 'CS001',
        intake: 2023
      },
      {
        student_id: 'STU005',
        program_id: 'IT001',  
        intake: 2022
      },
      {
        student_id: 'STU006',
        program_id: 'IS001',
        intake: 2023
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('program_registering', null, {});
  }
};
