import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const AttendanceRequest = sequelize.define('AttendanceRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attendance_id: {
    type: DataTypes.INTEGER,
    references: { model: 'Attendance', key: 'attendance_id' },
    allowNull: false,
  },
  student_id: {
    type: DataTypes.STRING(20),
    references: { model: 'Student', key: 'student_id' },
    allowNull: false,
  },
  module_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: { model: 'Module', key: 'module_id' },
  },
  request_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  proposed_status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    allowNull: false,
  },
  approved_status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    allowNull: true,
  },
  reason: {
    type: DataTypes.TEXT,
  },
  processed_by: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendance_request',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['attendance_id'] },
    { fields: ['student_id'] },
    { fields: ['module_id'] },
    { fields: ['request_status'] },
    // Composite index for the common query in requestAttendanceCorrection
    { fields: ['attendance_id', 'student_id', 'request_status'] }
  ]
});

export default AttendanceRequest;
