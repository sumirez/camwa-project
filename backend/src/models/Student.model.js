import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(40),
  },
  map_location: {
    type: DataTypes.STRING(20),
  },
  program_id: {
    type: DataTypes.STRING(20),
    references: { model: 'Program', key: 'program_id' },
  },
  intake: {
    type: DataTypes.INTEGER,
    references: { model: 'Intake', key: 'year' },
  }
}, {
  tableName: 'student',
  timestamps: false,
});

export default Student;
