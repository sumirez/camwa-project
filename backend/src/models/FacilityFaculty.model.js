import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const FacilityFaculty = sequelize.define('FacilityFaculty', {
  staff_id: {
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
  
}, {
  timestamps: false,
  tableName: 'facility_faculty'
});

export default FacilityFaculty;
