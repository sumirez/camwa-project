import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Attendance = sequelize.define('Attendance', {
  attendance_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.STRING(20),
    references: { model: 'Student', key: 'student_id' },
  },
  module_id: {
    type: DataTypes.STRING(36),
    references: { model: 'Module', key: 'module_id' },
  },
  attendance_status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    allowNull: false 
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['student_id'] },
    { fields: ['module_id'] }
  ]
});

export default Attendance;
