import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Class = sequelize.define('Class', {
  class_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  intake_module_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: { model: 'IntakeModule', key: 'intake_module_id' },
  },
  class_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  class_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  lecturer_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'Lecturer', key: 'lecturer_id' },
  }
}, {
  tableName: 'class',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Class;
