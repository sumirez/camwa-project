import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';
import Student from './Student.model.js';
import Module from './Module.model.js';
import Semester from './Semester.model.js';
import Program from './Program.model.js';
import Lecturer from './Lecturer.model.js';

const ModuleRegistration = sequelize.define('ModuleRegistration', {
  module_reg_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'Student',
      key: 'student_id'
    },
  },
  module_id: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: 'Module',
      key: 'module_id'
    },
  },
  lecturer_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'Lecturer',
      key: 'lecturer_id'
    },
  },
}, {
  tableName: 'module_registration',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define associations
ModuleRegistration.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(ModuleRegistration, { foreignKey: 'student_id' });

ModuleRegistration.belongsTo(Module, { foreignKey: 'module_id' });
Module.hasMany(ModuleRegistration, { foreignKey: 'module_id' });

ModuleRegistration.belongsTo(Lecturer, { foreignKey: 'lecturer_id' });
Lecturer.hasMany(ModuleRegistration, { foreignKey: 'lecturer_id' });

export default ModuleRegistration;
