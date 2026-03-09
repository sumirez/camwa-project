'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notification', null, {});
    return queryInterface.bulkInsert('notification', [
      {
        sender_id: 'ADMIN001',
        receiver_id: 'STU001',
        notification_type: 'MODULE_ANNOUNCEMENT',
        notification_text: 'Important announcement for your module',
        notification_date: new Date(),
        status: 'unread',
        module_id: 'WD2023',
        priority: 1,
        is_critical: true,
        read_by_receiver: false
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notification', null, {});
  }
};
