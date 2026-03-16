import Student from './Student.model.js';
import Program from './Program.model.js';
import Intake from './Intake.model.js';
import Semester from './Semester.model.js';
import Lecturer from './Lecturer.model.js';
import Attendance from './Attendance.model.js';
import Iam from './Iam.model.js';
import AttendanceRequest from './AttendanceRequest.model.js';
import Module from './Module.model.js';
import Exam from './Exam.model.js';
import ModuleRegistration from './ModuleRegistration.model.js';
import ImageAsset from './ImageAsset.model.js';
import Course from './Course.model.js';
import IntakeModule from './IntakeModule.model.js';
import Class from './Class.model.js';
import ProgramRegistering from './ProgramRegistering.model.js';
import StudentIntakeModule from './StudentIntakeModule.model.js';

// Define Associations after all models are importedent Relationship (Many Students belong to one Program)
Program.hasMany(Student, { foreignKey: 'program_id' });
Student.belongsTo(Program, { foreignKey: 'program_id' });

// 2. Intake and Student Relationship (Many Students belong to one Intake)
Intake.hasMany(Student, { foreignKey: 'intake' });
Student.belongsTo(Intake, { foreignKey: 'intake' });

// 3. Program and Module Relationship (A Program has many Modules)
Program.hasMany(Module, { foreignKey: 'program_id' });
Module.belongsTo(Program, { foreignKey: 'program_id' });

// 4. Student and Attendance Relationship (A Student has many Attendance records)
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

// 5. Iam and AttendanceRequest Relationship (An Iam entity processes many Attendance Requests)
Iam.hasMany(AttendanceRequest, { foreignKey: 'lecturer_id' });
AttendanceRequest.belongsTo(Iam, { foreignKey: 'lecturer_id' });

// 6. Student and AttendanceRequest Relationship (A Student makes many Attendance Requests)
Student.hasMany(AttendanceRequest, { foreignKey: 'student_id' });
AttendanceRequest.belongsTo(Student, { foreignKey: 'student_id' });

// 9. Exam and Module Relationship (An Exam belongs to one Module)
// Exam.belongsTo(Module, { foreignKey: 'module_id' });
// Module.hasMany(Exam, { foreignKey: 'module_id' });

// 10. Iam and Student (One-to-One) - Represents student's account
Student.belongsTo(Iam, { foreignKey: 'student_id', targetKey: 'username' });
Iam.hasOne(Student, { foreignKey: 'student_id', sourceKey: 'username' });

// 11. Exam model relationships
// Module.hasMany(Exam, { foreignKey: 'module_id' });
// Exam.belongsTo(Module, { foreignKey: 'module_id' });

Student.hasMany(Exam, { foreignKey: 'student_id' });
Exam.belongsTo(Student, { foreignKey: 'student_id' });

// 12. ImageAsset and Iam Relationship (An Iam user can have many images)
Iam.hasMany(ImageAsset, { foreignKey: 'username', sourceKey: 'username' });
ImageAsset.belongsTo(Iam, { foreignKey: 'username', targetKey: 'username' });

// IntakeModule relationships
IntakeModule.belongsTo(Program, { foreignKey: 'program_id' });
Program.hasMany(IntakeModule, { foreignKey: 'program_id' });

IntakeModule.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(IntakeModule, { foreignKey: 'course_id' });

IntakeModule.belongsTo(Lecturer, { foreignKey: 'lecturer_id' });
Lecturer.hasMany(IntakeModule, { foreignKey: 'lecturer_id' });

IntakeModule.belongsTo(Semester, { foreignKey: 'semester_id' });
Semester.hasMany(IntakeModule, { foreignKey: 'semester_id' });

IntakeModule.belongsTo(Intake, { foreignKey: 'intake', targetKey: 'year' });
Intake.hasMany(IntakeModule, { foreignKey: 'intake', sourceKey: 'year' });

// Attendance and IntakeModule
Attendance.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });
IntakeModule.hasMany(Attendance, { foreignKey: 'intake_module_id' });

// AttendanceRequest and IntakeModule
AttendanceRequest.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });
IntakeModule.hasMany(AttendanceRequest, { foreignKey: 'intake_module_id' });

// Class and IntakeModule
Class.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });
IntakeModule.hasMany(Class, { foreignKey: 'intake_module_id' });

// Exam and IntakeModule
Exam.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });
IntakeModule.hasMany(Exam, { foreignKey: 'intake_module_id' });

// ModuleRegistration and IntakeModule
ModuleRegistration.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });
IntakeModule.hasMany(ModuleRegistration, { foreignKey: 'intake_module_id' });

// ProgramRegistering associations
ProgramRegistering.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(ProgramRegistering, { foreignKey: 'student_id' });
ProgramRegistering.belongsTo(Program, { foreignKey: 'program_id' });
Program.hasMany(ProgramRegistering, { foreignKey: 'program_id' });

// StudentIntakeModule associations
StudentIntakeModule.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(StudentIntakeModule, { foreignKey: 'student_id' });
StudentIntakeModule.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });
IntakeModule.hasMany(StudentIntakeModule, { foreignKey: 'intake_module_id' });

export {
  Student,
  Program,
  Intake,
  Semester,
  Lecturer,
  Attendance,
  Iam,
  AttendanceRequest,
  Module,
  Exam,
  ModuleRegistration,
  ImageAsset,
  Course,
  IntakeModule,
  Class
};
