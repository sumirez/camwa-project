'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notification', null, {});

    const [requests] = await queryInterface.sequelize.query(
      `
        SELECT request_id, student_id, request_status, created_at
        FROM attendance_request
        WHERE student_id IN ('STU001', 'STU002')
        ORDER BY request_id ASC
      `
    );

    if (!requests.length) {
      return;
    }

    const st1Request = requests.find((request) => request.student_id === 'STU001');
    const st2Request = requests.find((request) => request.student_id === 'STU002');

    if (!st1Request && !st2Request) {
      return;
    }

    const notifications = [];

    if (st1Request) {
      notifications.push(
        {
          sender_id: 'STU001',
          receiver_id: 'ADMIN001',
          notification_type: 'new_request',
          request_id: st1Request.request_id,
          status: 'unread',
          created_at: new Date('2021-08-07T08:30:00Z')
        },
        {
          sender_id: 'ADMIN001',
          receiver_id: 'STU001',
          notification_type: 'request_approved',
          request_id: st1Request.request_id,
          status: 'read',
          created_at: new Date('2021-08-07T10:00:00Z'),
          read_at: new Date('2021-08-07T10:15:00Z')
        }
      );
    }

    if (st2Request) {
      notifications.push(
        {
          sender_id: 'STU002',
          receiver_id: 'ADMIN001',
          notification_type: 'new_request',
          request_id: st2Request.request_id,
          status: 'unread',
          created_at: new Date('2021-08-08T09:45:00Z')
        },
        {
          sender_id: 'ADMIN001',
          receiver_id: 'STU002',
          notification_type: 'request_rejected',
          request_id: st2Request.request_id,
          status: 'read',
          created_at: new Date('2021-08-08T12:00:00Z'),
          read_at: new Date('2021-08-08T12:20:00Z')
        }
      );
    }

    return queryInterface.bulkInsert('notification', notifications);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notification', null, {});
  }
};
