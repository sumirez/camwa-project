'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add composite index for better performance on attendance correction request queries
    await queryInterface.addIndex('attendance_request', 
      ['attendance_id', 'student_id', 'request_status'], 
      {
        name: 'idx_attendance_request_composite',
        fields: ['attendance_id', 'student_id', 'request_status']
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove the composite index
    await queryInterface.removeIndex('attendance_request', 'idx_attendance_request_composite');
  }
};
