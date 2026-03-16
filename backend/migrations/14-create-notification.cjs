const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notification', {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sender_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      notification_type: {
        type: DataTypes.ENUM('new_request', 'request_approved', 'request_rejected'),
        allowNull: false,
      },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'attendance_request',
          key: 'request_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('unread', 'read'),
        allowNull: false,
        defaultValue: 'unread',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    });

    // Add indexes
    await queryInterface.addIndex('notification', ['sender_id']);
    await queryInterface.addIndex('notification', ['receiver_id']);
    await queryInterface.addIndex('notification', ['request_id']);
    await queryInterface.addIndex('notification', ['status']);
    await queryInterface.addIndex('notification', ['notification_type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notification');
  }
};
