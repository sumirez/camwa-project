import { DataTypes } from 'sequelize';
import sequelize from '../common/sequelize/connect.sequelize.js';
import Student from './Student.model.js';

const StudentIntakeModule = sequelize.define('StudentIntakeModule', {
  student_id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    references: { model: 'Student', key: 'student_id' },
  },
  intake_module_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    references: { model: 'IntakeModule', key: 'intake_module_id' },
  },
  enrollment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'student_intake_module',
  timestamps: false,
});

StudentIntakeModule.belongsTo(Student, {
  foreignKey: 'student_id',
  targetKey: 'student_id',
});

export default StudentIntakeModule;
