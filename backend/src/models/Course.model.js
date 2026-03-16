import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  program_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'Program', key: 'program_id' },
  },
  curriculum_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'course',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Course;
