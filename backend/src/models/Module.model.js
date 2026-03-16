import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lecturer_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'Lecturer', key: 'staff_id' },
  },
  program_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    allowNull: false,
    references: { model: 'Program', key: 'program_id' },
  },
  intake: {
    type: DataTypes.INTEGER,
    allowNull: false,
    allowNull: false,
    references: { model: 'Intake', key: 'year' },
  },
  semester_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    allowNull: false,
    references: { model: 'Semester', key: 'sem_id' },
  }
}, {
  timestamps: false,  // Disable createdAt and updatedAt fields
  tableName: 'course'  // Table name in the database
});

export default Course;
