import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Semester = sequelize.define('Semester', {
  sem_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
  },
  sem_type: {
    type: DataTypes.STRING(20),
  },
  start_date: {
    type: DataTypes.DATE,
  },
  end_date: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'semester',
  timestamps: false,
});

export default Semester;
