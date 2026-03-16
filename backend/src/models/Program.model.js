import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Program = sequelize.define('Program', {
  program_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
  },
}, {
  tableName: 'program',
  timestamps: false,
});

export default Program;
