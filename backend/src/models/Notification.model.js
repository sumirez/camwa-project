import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Notification = sequelize.define('Notification', {
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
    references: { model: 'attendance_request', key: 'request_id' },
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read'),
    allowNull: false,
    defaultValue: 'unread',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'notification',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['sender_id'] },
    { fields: ['receiver_id'] },
    { fields: ['request_id'] },
    { fields: ['status'] },
    { fields: ['notification_type'] }
  ]
});

export default Notification;
