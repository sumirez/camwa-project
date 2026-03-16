'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Example seed data for exam table
    // This should be updated based on actual student and module data in your database
    const currentDate = new Date();

    try {
      // Sample exam records - replace with actual student_ids and module_ids from your database
      // Try to find actual module and student IDs first
      // const modules = await queryInterface.sequelize.query(
      //   `SELECT module_id FROM module LIMIT 3;`,
      //   { type: queryInterface.sequelize.QueryTypes.SELECT }
      // );

      // const students = await queryInterface.sequelize.query(
      //   `SELECT student_id FROM student LIMIT 3;`,
      //   { type: queryInterface.sequelize.QueryTypes.SELECT }
      // );

      // // Use the actual IDs if available, or fall back to dummy values
      // const moduleIds = modules.length > 0 
      //   ? modules.map(m => m.module_id) 
      //   : ['MODULE123', 'MODULE456', 'MODULE789'];

      // const studentIds = students.length > 0 
      //   ? students.map(s => s.student_id) 
      //   : ['STUDENT123', 'STUDENT456', 'STUDENT789'];

      // // Create seed data with actual IDs
      // await queryInterface.bulkInsert('exam', [
      //   {
      //     module_id: moduleIds[0],
      //     student_id: studentIds[0],
      //     attendance_rate: 85.5,
      //     is_eligible: true,
      //     created_at: currentDate,
      //     updated_at: currentDate
      //   },
      //   {
      //     module_id: moduleIds[0],
      //     student_id: studentIds.length > 1 ? studentIds[1] : studentIds[0],
      //     attendance_rate: 75.0,
      //     is_eligible: false,
      //     created_at: currentDate,
      //     updated_at: currentDate
      //   },
      //   {
      //     module_id: moduleIds.length > 1 ? moduleIds[1] : moduleIds[0],
      //     student_id: studentIds[0],
      //     attendance_rate: 92.5,
      //     is_eligible: true,
      //     created_at: currentDate,
      //     updated_at: currentDate
      //   }
      // ]);
    } catch (error) {
      console.error('Error in exam seeder:', error);
      // Continue even if there's an error in seeding
    }
  },

  async down(queryInterface, Sequelize) {
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
