'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notification', null, {});
    
    // We need a valid request_id for the notification.
    // Assuming request_id 1 exists from attendance_request seeder.
    return queryInterface.bulkInsert('notification', [
      {
        sender_id: 'ADMIN001',
        receiver_id: 'STU001',
        notification_type: 'new_request',
        request_id: 1,
        status: 'unread',
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notification', null, {});
  }
};
