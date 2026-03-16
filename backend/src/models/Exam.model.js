import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Exam = sequelize.define('Exam', {
  exam_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'exam_id'
  },
  module_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: { model: 'module', key: 'module_id' },
    field: 'module_id'
  },
  student_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'student', key: 'student_id' },
    field: 'student_id'
  },
  attendance_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    },
    field: 'attendance_rate'
  },
  is_eligible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_eligible',
    get() {
      // This will still provide the calculated value from the database
      // but also ensure we have a proper field in the database
      return this.getDataValue('is_eligible');
    }
  }
}, {
  tableName: 'exam',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',

});

// Add a custom method to check eligibility
Exam.prototype.checkEligibility = function() {
  return this.attendance_rate >= 80;
};

// Import related models for associations
import Module from './Module.model.js';

// Define associations
Exam.belongsTo(Module, { foreignKey: 'module_id' });

export default Exam;
