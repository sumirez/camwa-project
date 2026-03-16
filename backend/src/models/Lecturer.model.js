import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';


const Lecturer = sequelize.define('Lecturer', {
  lecturer_id: {
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
  }
}, {
  timestamps: false,
  tableName: 'lecturer'
});

export default Lecturer;
