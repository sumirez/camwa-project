import Student from './Student.model.js';
import Program from './Program.model.js';
import Intake from './Intake.model.js';
import ProgramRegistering from './ProgramRegistering.model.js';
import IntakeModules from './IntakeModule.model.js'; 
import Semester from './Semester.model.js';
import Class from './Class.model.js';
import Exam from './Exam.model.js';
import Lecturer from './Lecturer.model.js';
import Attendance from './Attendance.model.js';
import Iam from './Iam.model.js';
import Notification from './Notification.model.js';
import AttendanceRequest from './AttendanceRequest.model.js';
import ExamTaking from './ExamTaking.model.js';
import Course from './Course.model.js';

// Define Associations

// 1. Program and Student Relationship (Many Students belong to one Program)
Program.hasMany(Student, { foreignKey: 'program_id' });
Student.belongsTo(Program, { foreignKey: 'program_id' });

// 2. Intake and Student Relationship (Many Students belong to one Intake)
Intake.hasMany(Student, { foreignKey: 'intake' });
Student.belongsTo(Intake, { foreignKey: 'intake' });

// 3. Program and Course Relationship (A Program has many Courses)
Program.hasMany(Course, { foreignKey: 'program_id' });
Course.belongsTo(Program, { foreignKey: 'program_id' });

// 4. Course and IntakeModule Relationship (A Course has many IntakeModules)
Course.hasMany(IntakeModule, { foreignKey: 'course_id' });
IntakeModule.belongsTo(Course, { foreignKey: 'course_id' });

// 5. Intake and IntakeModule Relationship (An Intake has many IntakeModules)
Intake.hasMany(IntakeModule, { foreignKey: 'intake_id' });
IntakeModule.belongsTo(Intake, { foreignKey: 'intake_id' });

// 6. Semester and IntakeModule Relationship (A Semester has many IntakeModules)
Semester.hasMany(IntakeModule, { foreignKey: 'semester_id' });
IntakeModule.belongsTo(Semester, { foreignKey: 'semester_id' });

// 7. Lecturer and IntakeModule Relationship (A Lecturer teaches many IntakeModules)
Lecturer.hasMany(IntakeModule, { foreignKey: 'lecturer_id' });
IntakeModule.belongsTo(Lecturer, { foreignKey: 'lecturer_id' });

// 8. Lecturer and Class Relationship (A Lecturer teaches many Classes)
Lecturer.hasMany(Class, { foreignKey: 'lecturer_id' });
Class.belongsTo(Lecturer, { foreignKey: 'lecturer_id' });

// 9. Student and Attendance Relationship (A Student has many Attendance records)
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });

// 10. IntakeModule and Attendance Relationship (An IntakeModule has many Attendance records)
IntakeModule.hasMany(Attendance, { foreignKey: 'intake_module_id' });
Attendance.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });

// 11. Student and ExamTaking Relationship (A Student takes many exams recorded in ExamTaking)
Student.hasMany(ExamTaking, { foreignKey: 'student_id' });
ExamTaking.belongsTo(Student, { foreignKey: 'student_id' });

// 12. IntakeModule and ExamTaking Relationship (An IntakeModule has many ExamTaking records)
IntakeModule.hasMany(ExamTaking, { foreignKey: 'intake_module_id' });
ExamTaking.belongsTo(IntakeModule, { foreignKey: 'intake_module_id' });

// 13. IntakeModules and Class Relationship (An IntakeModule has many Classes)
IntakeModules.hasMany(Class, { foreignKey: 'intake_module_id' });
Class.belongsTo(IntakeModules, { foreignKey: 'intake_module_id' });

// 14. Iam and Notification Relationship (An Iam entity sends many Notifications)
Iam.hasMany(Notification, { foreignKey: 'sender_id' });
Notification.belongsTo(Iam, { foreignKey: 'sender_id' });

// 15. Student and Notification Relationship (A Student receives many Notifications)
Student.hasMany(Notification, { foreignKey: 'receiver_id' });
Notification.belongsTo(Student, { foreignKey: 'receiver_id' });

// 16. Iam and AttendanceRequest Relationship (An Iam entity processes many Attendance Requests)
Iam.hasMany(AttendanceRequest, { foreignKey: 'lecturer_id' });
AttendanceRequest.belongsTo(Iam, { foreignKey: 'lecturer_id' });

// 17. Student and AttendanceRequest Relationship (A Student makes many Attendance Requests)
Student.hasMany(AttendanceRequest, { foreignKey: 'student_id' });
AttendanceRequest.belongsTo(Student, { foreignKey: 'student_id' });

// 18. Program and Student (Many-to-Many through ProgramRegistering) - Represents student enrollment in programs
Program.belongsToMany(Student, {
  through: ProgramRegistering,
  foreignKey: 'program_id',
  otherKey: 'student_id',
  as: 'students'
});
Student.belongsToMany(Program, {
  through: ProgramRegistering,
  foreignKey: 'student_id',
  otherKey: 'program_id',
  as: 'programs'
});

// 19. IntakeModule and Student (Many-to-Many through ModuleEnroll) - Represents student enrollment in intake modules
IntakeModule.belongsToMany(Student, {
  through: 'ModuleEnroll', // Replace with actual model if defined
  foreignKey: 'intake_module_id',
  otherKey: 'student_id',
  as: 'students'
});
Student.belongsToMany(IntakeModule, {
  through: 'ModuleEnroll', // Replace with actual model if defined
  foreignKey: 'student_id',
  otherKey: 'intake_module_id',
  as: 'intakeModules'
});

// 20. Iam and Student (One-to-One) - Represents student's account
Student.belongsTo(Iam, { foreignKey: 'acc_id' });
Iam.hasOne(Student, { foreignKey: 'acc_id' });

// Program and IntakeModule Relationship (A Program has many IntakeModules)
Program.hasMany(IntakeModule, { foreignKey: 'program_id' });
IntakeModule.belongsTo(Program, { foreignKey: 'program_id' });

// Program and IntakeModule Relationship (A Program has many IntakeModules)
Semester.hasMany(IntakeModule, { foreignKey: 'semster_id' });
IntakeModule.belongsTo(Semester, { foreignKey: 'sem_id' });

export {
  Student,
  Program,
  Intake,
  ProgramRegistering,
  IntakeModule,
  Semester,
  Class,
  Exam,
  Lecturer,
  Attendance,
  Iam,
  Notification,
  AttendanceRequest,
  ExamTaking,
  Course,
};
