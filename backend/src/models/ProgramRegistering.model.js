import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const ProgramRegistering = sequelize.define('ProgramRegistering', {
  student_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    references: { model: 'Student', key: 'student_id' },
    allowNull: false,
  },
  program_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    references: { model: 'Program', key: 'program_id' },
    allowNull: false,
  },
  intake: {
    type: DataTypes.INTEGER,
    references: { model: 'Intake', key: 'year' },
  },
}, {
  tableName: 'program_registering',
  timestamps: false
});

export default ProgramRegistering;
