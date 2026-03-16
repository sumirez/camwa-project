import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';

const IntakeModule = sequelize.define('IntakeModule', {
  intake_module_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ects: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lecturer_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'Lecturer', key: 'lecturer_id' },
  },
  program_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'Program', key: 'program_id' },
  },
  course_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: { model: 'Course', key: 'course_id' },
  },
  intake: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Intake', key: 'year' },
  },
  semester_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: { model: 'Semester', key: 'sem_id' },
  }
}, {
  tableName: 'intake_module',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default IntakeModule;
