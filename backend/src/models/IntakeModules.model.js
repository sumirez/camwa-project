import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';
import Program from './Program.model.js';
import Semester from './Semester.model.js';
import Lecturer from './Lecturer.model.js';

const IntakeModule = sequelize.define('IntakeModule', {
  intake_module_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ects: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  program_id: {
    type: DataTypes.STRING(20),
    references: { model: 'Program', key: 'program_id' },
  },
  // Reference to the lecturer responsible for this intake module
  lecturer_id: {
    type: DataTypes.STRING(20),
    references: { model: 'Lecturer', key: 'staff_id' },
    allowNull: false,
  },
  // Reference to the course this intake module belongs to
  course_id: {
    type: DataTypes.INTEGER,
    references: { model: 'Course', key: 'course_id' },
    allowNull: false,
  },
  // Reference to the intake year for this module
  intake: {
    type: DataTypes.INTEGER,
    references: { model: 'Intake', key: 'year' },
  },
  // Reference to the semester of the module
  semester_id: {
    type: DataTypes.STRING(36),
    references: { model: 'Semester', key: 'sem_id' },
    allowNull: false,
  },
}, {
  tableName: 'intake_module',
  timestamps: false,
});

// Add this association
IntakeModule.belongsTo(Program, {
  foreignKey: 'program_id',
  targetKey: 'program_id'
});

IntakeModule.belongsTo(Semester, {
  foreignKey: 'semester_id',
  targetKey: 'sem_id'
});

IntakeModule.belongsTo(Lecturer, {
  foreignKey: 'lecturer_id',
  targetKey: 'staff_id'
});

export default IntakeModule;
