'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notification', null, {});

    // Dynamically look up actual request_id to avoid hardcoding auto-increment values
    const [requests] = await queryInterface.sequelize.query(
      `SELECT request_id FROM attendance_request WHERE student_id = 'STU001' LIMIT 1`
    );

    if (!requests.length) return;

    return queryInterface.bulkInsert('notification', [
      {
        sender_id: 'ADMIN001',
        receiver_id: 'STU001',
        notification_type: 'new_request',
        request_id: requests[0].request_id,
        status: 'unread',
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notification', null, {});
  }
};
