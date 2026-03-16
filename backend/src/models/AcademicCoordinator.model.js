import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const AcademicCoordinator = sequelize.define('AcademicCoordinator', {
  ac_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  program_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'Program', key: 'program_id' },
  },
  current_role: {
    type: DataTypes.ENUM('LECTURER', 'AC'),
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'academic_coordinator'
});

export default AcademicCoordinator;
