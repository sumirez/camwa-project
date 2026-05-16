Introduction
1.1	Background
VGU existing class management systems are currently legacy paper-based methods, which are time-consuming and lack the security necessary to prevent data tampering. 

Although a prototype for an automated attendance system exists, it is currently underdeveloped and lacks the stability required for institutional use. Firstly, it was not suitable for production deployment due to several critical technical deficiencies. Secondly, the codebase shows a significant semantic inconsistency, specifically failing to follow VGU terminology, using “class and course” instead of the standardized term “module”. Thirdly, the database schema lacked proper normalization, containing redundant attributes that were irrelevant to the core attendance-tracking functionality. Finally, from a functional perspective, the system lacked a robust Role-Based Access Control (RBAC) framework, specifically omitting the AC role essential for CAMWA operations. This shows that the system presented security vulnerabilities, including the absence of secure password management protocols and inadequate mitigation strategies against common web-based attacks.

This project aims to perform a comprehensive overhaul of both the frontend and backend architectures, optimizing the system for performance and reliability to make it deployment-ready for VGUs academic programs. 
1.2	Problem Statement
While the legacy CAMWA prototype established a basic framework for digital attendance, it contains several critical technical and functional deficiencies that prevent its deployment in a production environment. These issues are categorized as follows:
1.2.1	Data Integrity
The current database architecture is based on theoretical models that fail to align with VGUs operational requirements. The schema contains inconsistency, using "class" or "course," instead of "intake” and “module"—which complicates relational mapping and data retrieval. Furthermore, the database has redundant attributes (e.g., ECTS, program duration, and exam proctors) that are irrelevant to the core attendance-tracking logic, thereby increasing data complexity and storage overhead.
1.2.2	Operational Inefficiency
From a workflow perspective, the system is limited by a reliance on manual record creation. This lack of automation results in significant latency in attendance processing and prevents the efficient management of simultaneous data flows. The current architecture does not support the scalable data management necessary for high-volume academic administration.
1.2.3	RBAC Problem
The system lacks a robust RBAC framework, failing to implement the AC role. In the VGU organizational structure, the AC alongside the FA, is responsible for faculty-level academic management with AC often functions in a dual capacity as a Lecturer. Therefore, the current system is incapable of supporting the complex, multi-role permissions required for effective CAMWA operations.
1.2.4	Security and Authentication Vulnerabilities
Authentication of this legacy system relies on static credentials with no provision for user-initiated password resets or changes; while administrators can manually assign passwords, it lacks an API endpoint to handle credential management, which creates significant operational friction. Another important problem, the system lacks rate-limiting and account lockout policies, leaving the authentication endpoint highly vulnerable to brute-force attacks.
1.3	Objectives
This thesis aims to refactor and optimize the backend services of the legacy CAMWA prototype to ensure it is production-ready for deployment within VGU. This includes redesigning database schema, removing abundant attributes, and standardizing naming conventions to follow the organizational roles. The project will also implement robust authentication protocols, including password hashed, password management and defensive mechanisms to mitigate brute-force attacks. Furthermore, the system will also implement advanced administrative features for bulk data processing, attendance analytics exportation, and an optimized attendance correction workflow. A key component of this development is the implementation of a fully functional RBAC framework that mirrors VGUs organizational structure, specifically enabling Academic Coordinators to transition seamlessly between administrative and pedagogical roles within a single authentication context. To improve maintainability and scalability, the system architecture will be modernized using a modular approach that enforces a strict separation of concerns across routes, controllers, services, and models. Finally, the project will establish secure cloud storage interfaces for managing multimedia assets, thereby providing a scalable foundation for future integration with AI-driven facial recognition technologies. 
1.4	Scope and Limitation
This thesis does not involve modifications to the existing Angular-based frontend application. The front-end only have insignificant changes, mainly focus on optimizing UX and responsiveness to ensure that the function flows consistently on both web-based devices and mobile phone. This thesis includes introducing new API endpoints, and several enhancements of security measures. Lastly, the project will be deployed on a cloud storage service. This project does not include the development of AI- powered face recognition capabilities due to lack of information and implementation methods. However, for future development, the system is designed to support AI integration through cloud asset management APIs. Performance testing, pen test and load testing were not conducted for this work, as the focus was to show functional improvements and security enhancements rather than performance optimization. The system has not been deployed to a production environment, and formal user acceptance testing with VGU staff and students has not been performed.
1.5	Thesis Structure
This thesis is presented into six chapters, structured to follow the systematic development and evaluation of the optimized CAMWA system. Chapter 1 provides the research context, establishing the background of attendance management at VGU, formalizing the problem statement by identifying the deficiencies in the existing prototype, and defining the project's objectives, scope, and constraints. Chapter 2 presents a literature review of modern backend development, web security protocols, and database design methodologies, while also providing a technical gap analysis of the legacy system. Chapter 3 proposed system architecture, detailing the modular design, database schema, and architectural principles used to implement new features and security enhancements. Chapter 4 describes the technical implementation phase, covering database modeling, security integration, API development, and cloud service orchestration, supported by architectural diagrams and code snippets. Chapter 5 evaluates the results of the optimization, assessing the system's readiness for production deployment. Finally, Chapter 6 concludes the thesis by concluding the key findings and proposing directions for future research and system scalability.
Chapter 2	
Literature Review and System Analysis

2.1	Literature Review
The important part of a backend system is performance, security and scalability. To achieve high performance in production environment, the industry has increasingly adopted the Node.js and Express.js ecosystem. These frameworks support the MVC pattern, allowing the application to be organized into distinct layers such as routes, controllers, services, and models, thereby enhancing both system maintainability and testability. 

Besides architectural structure, web applications must also follow security standards, to prevent vulnerabilities of OWASP Top 10. To follow the standards, authentication mechanisms using JWT and multi-factor authentication are used to manage authorization and authentication state. Also to prevent brute-force attacks, rate limiting and account lockout policies, are used. Password reset workflows in the industry now commonly use JWT-based implementations. These stateless, short-lived tokens reduce database overhead and maintain security through dynamic secret generation. 

For scalability, the system integrates with S3-compatible cloud services like Digital Ocean, managing multimedia assets through secure, pre-signed URLs. The database design focuses on normalization and strategic indexing to minimize redundancy. To manage these data interactions, the Sequelize ORM provides an abstraction layer that ensures type safety and simplifies complex database operations.
2.2	Analysis of the Existing System
Technical analysis of the legacy CAMWA system reveals several critical problems, not fit for deployment in production environment. Figure 2 1 illustrate the legacy database schema. Firstly, the database schema lacks proper normalization; redundant properties result in increased query latency, higher storage requirements, and unnecessary computational complexity. Secondly, semantic inconsistency also complicates the data model, as terms such as "Class," "Course," and "Module_enroll" are used instead of VGU’s standardized "Module" terminology.
 
Figure 2 1: Legacy database schema


This creates relational complexity and hinders data integrity. As a result, this thesis proposes a redesign schema to centralize the "Module" entity and simplify relational dependencies. Thirdly, the current RBAC is inadequate. The system fails to accommodate the AC role, which requires dual-role functionality to navigate between administrative and pedagogical permissions seamlessly. Fourthly, the security architecture is insufficient; the lack of robust authentication protocols, secure password management, and brute-force mitigation leaves the system vulnerable to unauthorized access and potential data breaches. Finally, the system lacks the operational scalability required for academic administration. It currently lacks support for bulk data processing—essential for tasks such as account creation and semester-wide module registrations—and lacks role-specific dashboards. The absence of these visualization tools prevents Administrators from monitoring system-wide metrics and prevents Faculty from performing program-level attendance analytics.
Chapter 3	
System Design and Architecture
3.1	System Architecture
The optimized CAMWA system adopts layered architecture based on the Model-View-Controller (MVC) design pattern to enforce a strict separation of functionality. As illustrated in Figure 3.1, the backend is organized into five distinct functional layers: Routes, Middleware, Controllers, Services, and Models. The Routing Layer serves as the entry point, mapping incoming HTTP requests to their corresponding API endpoints and methods. Once a route is matched, the request passes through Middleware Layer, which acts as a security interceptor to perform authentication and authorization checks. Upon successful validation, the request is handled by the Controller Layer, which manages the request-response lifecycle, including input parsing and initial data validation. The Controller acts as an orchestrator, delegating complex operational tasks to the Service Layer. This layer centralizes the system's core business logic—such as attendance computations, automated notifications, and data exportation—ensuring that business rules are decoupled from the transport logic. Finally, the Model Layer provides a data abstraction layer via the Sequelize ORM. By mapping application entities to the PostgreSQL database, this layer ensures type-safe operations, manages relational schemas, and handles data persistence.
 
Figure 3 1: System Architecture layers
This architecture promotes scalability by allowing independent modification of each layer, facilitates testing through clear interfaces between components, and supports maintainability by organizing code according to functional responsibilities.
3.2	Database Redesign
The database redesign addresses the fundamental technical deficiencies of the legacy schema by introducing several optimized domains and optimization required to serve production environment, listed and displayed in Table 3 1.

Table 3 1: Database Schema Comparison – Original vs Optimized
Aspect	Original Schema	Optimized Schema
Terminology	Inconsistent (class/course)	Standardized (module)
Academic Coordinator	Not supported	Dedicated table with RBAC support
Security Features	Basic authentication only	Enhanced with brute-force mitigation
Notification System	Basic notifications	Centralized with status tracking
Asset Management	No image/video support	ImageAsset table with cloud integration
Data Redundancy	High redundancy	Normalized with minimal redundancy
Schema Complexity	Included irrelevant fields (ECTS, etc.)	Optimized for attendance-centric logic

The new schema eliminates redundancy, standardizes terminology, and introduces essential tables for audit logging and asset management (see Figure 2). To enhance security, the iam table has been extended with fields such as failed_attempts, locked_until, and last_attempt_at to facilitate brute-force mitigation, complemented by the implementation of an audit_log for system-wide transparency. Semantic inconsistency is resolved by consolidating the "class" and "course" entities into a unified intake_module table, which adopts VGU’s standardized "Module" nomenclature and eliminates redundant attributes to improve query performance. Regarding access control, the introduction of the academic_coordinator table supports a sophisticated RBAC framework, using a current_role attribute to enable seamless role-toggling between administrative and pedagogical functions within a single authentication context. To support scalable multimedia management, the image_assets table provides a structured method for managing cloud-based file paths, establishing a foundation for future integration with AI-driven facial recognition technologies.  Finally, the communication layer is unified through a redesigned notification table, which centralizes the management of all system alerts including attendance requests and automated emails—thereby streamlining complex administrative workflows and reducing architectural complexity.
3.3	API and Feature Design
The API design follows RESTful principles with clear resource-oriented endpoints and appropriate HTTP methods. The design emphasizes security, usability, and integration with VGU’s existing workflows (see Figure 3 2).
 
Figure 3 2: New database schema
3.3.1	Security Feature Design
Authentication Flow
The authentication is secured through dual-token JWT stateless architecture, using short-lived access tokens and long-lived refresh tokens for session management. This approach can prevent rainbow table attacks and ensure passwords are irreversible in case there is an event of data breach. The JWT authentication system generates short-lived tokens (5 minutes) with timestamps to prevent replay attacks.
 
Figure 3 3: Authentication Sequence Diagram
The flow begins with the client submitting credentials to the /login endpoint. The AuthService retrieves the corresponding user record from the database and validates the password using the bcryptjs algorithm with a salt factor of 10. This irreversible hashing process mitigates the risk of rainbow table attacks and ensures that plaintext credentials cannot be recovered even in the event of a data breach. Upon successful validation, the system issues a short-lived access token (expires in 1 hour) for authorizing API requests, and a long-lived refresh token (expires in 7 days) stored securely in the database to facilitate session renewal. The sequence diagram further details how the AuthMiddleware intercepts subsequent requests, verifies the access token's signature, and grants or denies access to protected resources accordingly. See Figure 3 3 for the sequence diagram explaining the flow.
Password Reset Flow
The password reset process starts when a user submits a POST request to the /request-password-reset endpoint, which params of user email address. To prevent user enumeration vulnerabilities, where an attacker could determine valid email addresses by observing differing API responses, the system implements a uniform response pattern. The AuthController sends a query request to AuthService, which then looks for the email in the Iam database table. If the user is found, the service creates a secure JWT token. This token is made using a special key that includes the user's current password hash, making it stop working automatically after the password is changed.

 
Figure 3 4: Reset Password Sequence Diagram
After creating the token, the system starts an asynchronous email job. The system does not wait for the email to be sent, it answers the client right away with a successful message. To protect against attackers trying to guess valid emails, the system sends the same success message whether the email exists in the database or not.
During the execution phase (shown in Figure 3 4), the user clicks the link in the email. The system checks the JWT signature to make sure it is real and has not expired. If the token is good, it hashes and saves the new password, then deletes all old refresh tokens from the database. This makes sure that anyone logged in on another device is forced to log out. Finally, an email confirmation is sent to the user to tell them the password was updated successfully.
Brute-force protection
To defend against automated login attacks, the system tracks failed login attempts for each user account using an in-memory data structure. As shown in the sequence diagram (see Figure 6). When a login attempt fails, the AuthService records the event before checking whether the account should be locked.
The implementation uses a map structure where each user's login identifier (email or username) is associated with a queue of timestamps representing recent failed attempts. The code snippet below illustrates the core logic:
const loginFails = new Map();
const MAX_ATTEMPTS = 5;
const BASE_LOCKOUT_MINUTES = 5;  
 
function recordFailedAttempt(email) {
    let attempts = loginFails.get(email);
    // If no list exists yet, create a new empty array
    if (!attempts) {
        attempts = [];
        loginFails.set(email, attempts);
    }
    // Add the current time
    const now = Date.now();
    attempts.push(now);
    if (attempts.length > MAX_ATTEMPTS) {
        attempts.shift(); // Remove the oldest timestamp
    }
    // calculate lockout if pass threshold
    if (attempts.length >= MAX_ATTEMPTS) {
        const extraFailures = attempts.length - MAX_ATTEMPTS + 1;
        const lockoutMinutes = BASE_LOCKOUT_MINUTES * Math.pow(5, extraFailures - 1);
        const lockedUntil = new Date(now + lockoutMinutes * 60 * 1000);
        return { locked: true, lockedUntil, lockoutMinutes };
    }
    
    return { locked: false };

When a login fails, the system calls recordFailedAttempt(email). It checks the loginFails map. The current timestamp is added to the end of the array. If the array contains more than MAX_ATTEMPTS, the oldest one is removed using shift(). This ensures the system only considers the most recent failures when deciding whether to lock the account. Old failures are automatically forgotten. When the array size reaches the threshold, the system calculates an exponential lockout duration. The first lockout lasts 5 minutes. Each next failure beyond the threshold multiplies the lockout time by 5:
•	5th failure → 5 minutes
•	6th failure → 25 minutes
•	7th failure → 125 minutes
The locked until timestamp is then stored in the database in the Iam table. When the user attempts to log in again, the AuthService first retrieves the locked_until field value from the database. If the current time is earlier than locked_until, the system returns a 403 Forbidden. This is shown in the sequence diagram's "Account is locked" branch. If the user eventually enters the correct password, the system resets the failure counter by removing the entry from loginFails and setting locked_until = null and failed_attempts = 0 in the database.
 
Figure 3 5: Brute Force Prevention Sequence Diagram
3.3.2	Role Management Design
The Academic Coordinator role-toggle functionality allows coordinators to switch between administrative and lecturer views without requiring separate authentication (see Figure 7). When a role toggle request is received, the system queries the iam table to find the user record matching the authenticated iam_id. 
const user = await Iam.findOne({ where: { iam_id: userId } });
if (user.role !== 'AC') {
    throw new ForbiddenError('Only Academic Coordinators can toggle roles');
}
Listing 3 1: Query Academic Coordinator
This initial check verifies that the user is permanently designated as an Academic Coordinator in the identity and access management table. The iam.role field represents the user's base identity and never changes during a role toggle. This ensures that the user retains the underlying privilege to switch roles at any time. To determine which view the user currently sees, the system maintains a separate table that serves as the source of truth for the active session role. This table includes a current_role column that stores either 'AC' (for administrative duties) or 'LECTURER' (for teaching responsibilities). The toggle operation updates this column rather than modifying the base iam.role. The service retrieves the user's AC record, flips the current_role value between 'AC' and 'LECTURER', updates the database, invalidates the existing refresh token, and issues new JWT tokens with the updated role embedded.
Because the base iam.role remains 'AC' throughout this process, the authorization check shown above will always pass on subsequent toggle requests, even when the user is currently acting as a lecturer. The separation of concerns—permanent identity in iam versus session-specific role in AC—eliminates the risk of a coordinator becoming locked out of their administrative privileges.
 
Figure 3 6: Academic Coordinator role change Sequence Diagram
3.3.3	Data Handling Design
The Excel import/export functionality supports VGU’s existing administrative workflows by providing seamless integration with spreadsheet-based data management. The system can process multiple Excel files simultaneously during import operations and generate formatted Excel reports for exam eligibility and attendance analysis (see Figure 8).

This is one of the import processes that has been enhanced to enable bulk student account creation through validated spreadsheet uploads. The system validates file formats, processes student data row by row, and provides comprehensive feedback on both successful and failed operations. This workflow ensures data integrity while maintaining efficient batch processing capabilities. The Excel export functionality generates comprehensive exam eligibility reports for lecturer review (see Figure 3.8). The system retrieves module-specific data, applies eligibility calculations, and creates professionally formatted Excel files with color-coded visual indicators for student status assessment.

3.3.4	Attendance Correction Flow Redesign
The cloud asset management system provides secure, temporary access to student images and session videos stored on Digital Ocean cloud-based platform (see Figure 3.10). The system generates signed URLs with configurable expiration times, ensuring secure access while maintaining performance through cloud-based delivery.

Chapter 4	
Implementation
4.1	Database and Model Implementation
The backend uses PostgreSQL with Sequelize ORM to manage the system’s relational data. The new database structure was refactored and enhanced through database migrations to preserve existing data where applicable. The new models are connected as relations to each other. These relationships allow the backend to manage attendance data, process correction requests, and provide structured access to module-related and student-related resources. A brief illustration of the main core relationship is shown on Figure 8
 
Figure 4 1: Core relationships between models flowchart

The Iam model is the based model of the system. It is the identity model which stores account-related information used for authentication and role-based access. From here, all relationships with the rest of the database is created. 

A 1-1 relationship between the Iam and Student models. The Iam model represents as the user identity account, while the student model stores student academic information. The connection allows each student profile to reference to one identity account, keeping authentication data separate from academic data while maintaining a direct link between both entities. This relationship is configured using Sequalize in Lising 4.1.

// Iam and Student
Student.belongsTo(Iam, { foreignKey: 'student_id', targetKey: 'username' });
Iam.hasOne(Student, { foreignKey: 'student_id', sourceKey: 'username' });

The Student model represents student information in the academic system. It is connected to the Attendance model through 1-n relationship, where one student can have multiple attendance records. This allows the backend to track a student’s attendance status across different modules, classes. The Attendance model stores the actual attendance data, while the AttendanceRequest model supports the correction workflow when students request changes to their recorded attendance status. By separating attendance records from correction requests, the system can preserve the original attendance data while maintaining a separate review history for administrative processing. This relationship is configured using Sequalize in Listing 4.2

// Student and Attendance
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Attendance.belongsTo(Student, { foreignKey: 'student_id' });
Listing 4 1: Student and Attendance Relationship
The Program and IntakeModule models support the academic structure of the system. The Program model represents academic programs, while the IntakeModule model helps organize the relationship between programs, student intakes, and academic modules. Together, these models allow the backend to structure module assignments according to the institution’s academic organization. The ImageAsset model manages references to student image files and related metadata. Based on the current implementation evidence, this model should be described only as an image asset management structure. Although it may support future face-recognition-related development, the available code evidence does not show that AI-based face recognition has already been implemented.

IntakeModule.belongsTo(Program, { foreignKey: 'program_id' });
Program.hasMany(IntakeModule, { foreignKey: 'program_id' });
Listing 4 2: IntakeModule and Program Relationship
The Module model shows the academic modules in class. It provides context for attendance records and is also used in the secure video access workflow. In this implementation, module records can include camera path references. These references are not exposed directly to users; instead, the backend uses them to generate temporary signed URLs for accessing video assets stored in cloud storage. This ensures that video files remain protected while still allowing authorized users to access them when needed

const Module = sequelize.define('Module', {
  module_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
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
  },
  camera_path: {
    type: DataTypes.STRING(255),
		allowNull: true,
    comment : 'Path to module session video in cloud storage '
  },
}, {
  timestamps: false,  // Disable createdAt and updatedAt fields
  tableName: 'module'  // Table name in the database
});
Listing 4 3: Module model and relationships
4.2	Security Enhancements
The security implementation addresses critical vulnerabilities present in the original system while introducing modern security practices appropriate for production deployment.
4.2.1	Password Reset Implementation
The password reset function was implemented to help users create a new password when they cannot access their account. The system uses a JWT token for this process, so it does not need to store reset tokens in the database. This makes the implementation simpler because the token can be checked directly by the backend.
When a user requests a password reset, the system first checks the user’s email address. If the email exists, the backend creates a reset token. This token contains the user ID, email address, reset purpose, and timestamp. The token is only valid for 5 minutes, so the reset link cannot be used for a long time.
The reset token is signed using the application’s JWT secret together with the user’s current password hash. This means that if the user changes their password, the old reset token will no longer be valid. This provides an extra layer of security because used or outdated reset links cannot be reused.
// Generate secure reset token with user's current password hash
const resetToken = jwt.sign(
  {
    uid: user.iam_id,
    email: user.email,
    purpose: 'password_reset',
    timestamp: Date.now()
  },
  process.env.JWT_SECRET + user.password,
  { expiresIn: '5m' }
);
Listing 4 4: Reset Token function
After the token is generated, the system sends an email to the user’s VGU email address. This email contains a secure reset link. When the user opens the link, they are directed to the password reset page, where they can enter a new password. When the user submits the new password, the backend verifies the reset token. To do this, the system first reads the user ID from the token, then retrieves the user’s current password hash from the database. After that, it rebuilds the same signing secret and checks whether the token is still valid. If the token is valid and has not expired, the system hashes the new password and updates it in the database. This design improves security because the reset token has a short lifetime and becomes invalid after the password is changed. As a result, even if an old reset link is found later, it cannot be used to change the password again.
 
Figure 4 2: Password Reset Email
After the password is successfully reset, the system automatically sends a confirmation email to the user. This email informs the user that their password has been changed successfully and helps reassure them that their account is still secure, as shown in Figure 4.3.
This password reset process uses two emails. The first email contains the reset link, and the second email confirms that the password has been changed. This approach helps keep the user informed during the whole process and improves transparency and security.
 
Figure 4 3: Email Reset Success
4.2.2	Brute-Force Protection Implementation
The brute-force protection function was implemented to prevent repeated password guessing during login. The system records the number of failed login attempts for each account. When the number of failed attempts reaches the configured limit, the account is temporarily locked.
if (newFailedAttempts >= 5) {
  const lockoutExponent = newFailedAttempts - 4;
  const lockoutMinutes = Math.pow(5, lockoutExponent);
  lockedUntil = new Date(Date.now() + (lockoutMinutes * 60 * 1000));
}
Figure 4 4: Brute Force Protection algorithm
The implementation uses a progressive lockout mechanism. This means that the lockout duration becomes longer after each additional failed attempt. In this system, the lockout starts from the 5th failed login attempt. The lockout time is calculated using an exponential formula, where the 5th failed attempt results in a 5-minute lockout, the 6th failed attempt results in a 25-minute lockout, and the 7th failed attempt results in a 125-minute lockout.
As shown in Listing 4.4, the system calculates the lockout duration by subtracting 4 from the number of failed attempts and using the result as the exponent. The calculated time is then added to the current time to produce the lockedUntil value.
The system also provides user feedback during login. If the account is not locked yet, the response can show the number of remaining attempts before the lockout begins. If the account is locked, the response informs the user about the lockout duration, as shown in Figure 4.4. This makes the login process clearer for users while still protecting the system from brute-force attacks.

4.3	Feature Implementation
4.3.1	Role-Toggle Functionality
The Academic Coordinator role-toggle feature was implemented to support users with multiple responsibilities in the CAMWA system. In the academic environment, an Academic Coordinator may need to access administrative functions while also working with teaching-related module information. To support this requirement, the system allows authorized Academic Coordinator users to switch their active role based on the task they are performing.
const toggleCoordinatorRole = async (userId) => {
  if (userId.role !== 'academic_coordinator') {
    throw new Error('Unauthorized: Only coordinators can toggle roles');
  }
 
  const coordinator = await AcademicCoordinator.findOne({ where: { ac_id: userId } });
 
  if (!coordinator) {
    throw new Error('Coordinator not found');
  }
 
  const newRole = coordinator.current_role === 'AC' ? 'LECTURER' : 'AC';
  await coordinator.update({ current_role: newRole });
 
  await Iam.update({ refresh_token: null }, { where: { iam_id: userId } });
 
  return newRole;
};
Figure 4 5: Toggle AC Role Function
The function first performs an authorization check by verifying whether the current user has the academic_coordinator role. If the user does not have this role, the system throws an unauthorized error and stops the process. This prevents users without coordinator permission from changing their active role. 

After the authorization check, the backend searches for the corresponding coordinator record in the AcademicCoordinator table using the coordinator ID. If no matching record is found, the system returns a Coordinator not found error. This ensures that only valid coordinator accounts can use the role-toggle function.

The main toggle logic checks the coordinator’s current role. If the current role is AC, the system changes it to LECTURER. If the current role is LECTURER, the system changes it back to AC. The new role is then saved in the AcademicCoordinator table by updating the current_role field. After updating the role, the system invalidates the existing refresh token by setting the refresh_token field in the Iam table to null. This step is important because old tokens may still contain outdated role information. By removing the refresh token, the system reduces the risk of users continuing to access the system with stale credentials after their active role has changed.

Finally, the function returns the new role to confirm the result of the operation. Overall, this implementation allows Academic Coordinators to switch role contexts while still maintaining authorization control and token security.
 
Figure 4 6: Success AC toggle response

4.3.2 Cloud Asset Access Implementation
The cloud asset management system provides secure access to student images and session videos stored in DigitalOcean Spaces. The system generates temporary, signed URLs that provide time- limited access to cloud-stored resources. The implementation utilizes the AWS SDK to interact with DigitalOcean Spaces’ S3-compatible API. The system generates signed URLs with configurable expiration times, ensuring secure access while maintaining performance through cloud-based delivery (see Listing 4.7).
The signed URL mechanism provides enhanced security through time-based access control. When a user requests access to a video resource, the system generates a temporary URL that includes crypto- graphic signatures and expiration timestamps (see Figure 4.6). The user can click on this link to directly access the video stored in the cloud without requiring addi- tional authentication (see Figure 4.7). However, this access is strictly time-limited - by default, the URL expires after 5 minutes. In the demonstration example, the expiration time is set to 1 minute.
Once the expiration time has passed, the same URL becomes invalid and will no longer provide access to the video resource (see Figure 4.8). If a user attempts to access an expired URL, they will receive an access denied error from the cloud storage service. This temporal restriction ensures that shared URLs cannot be used indefinitely, maintaining security while providing convenient access to authorized users.
4.4	Attendance Correction and Notification Flow
The cloud asset access function was implemented to provide secure access to files stored in DigitalOcean Spaces. In this system, cloud storage is used for resources such as student images and module session videos. Instead of giving users the direct file path from the cloud storage, the backend generates a temporary signed URL. This URL allows the user to access the file only for a limited amount of time.
The implementation uses the AWS SDK because DigitalOcean Spaces supports an S3-compatible API. This means the backend can use S3 functions to communicate with DigitalOcean Spaces. When the system needs to provide access to a stored file, it receives the object key of the file and creates a signed URL with an expiration time.
const generateSignedUrl = async (objectKey, expirationMinutes = 5) => {
  const params = {
    Bucket: process.env.DO_SPACE_BUCKET,
    Key: objectKey,
    Expires: expirationMinutes * 60   };

  try {
    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return {
      url: signedUrl,
      expiresIn: `${expirationMinutes} minutes`,
      objectKey: objectKey     };
  } catch (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};
Listing 4 5: Cloud asset access service
As shown in Listing 4 5, the function takes the object key of the file and an expiration time. The object key identifies the file in DigitalOcean Space. The bucket name is loaded from the environment variable DO_SPACE_BUCKET, so the storage configuration is not hardcoded in the source code. The expiration time is converted into seconds because the signed URL function expects the value in seconds. The function then calls s3.getSignedUrlPromise('getObject', params) to generate a signed URL for reading the object. If the operation is successful, the function returns the signed URL, the expiration time, and the object key. If the signed URL cannot be generated, the function throws an error so that the backend can handle the failure.

This signed URL mechanism improves security because the real cloud storage path is not directly exposed to the user. When an authorized user requests access to a module video, the backend generates a temporary link, as shown in Figure 4.6. The user can then open the link to view the video stored in DigitalOcean Spaces, as shown in Figure 4.7.
However, the link is only valid for a limited time. By default, the URL expires after 5 minutes. In the demonstration example, the expiration time is set to 1 minute to show how the mechanism works. After the expiration time passes, the same URL can no longer be used. If the user tries to open the expired link, DigitalOcean Spaces returns an access denied error, as shown in Figure 4.8.

Overall, this implementation allows the system to provide convenient access to cloud-stored assets while still protecting them from permanent public access. The backend controls when a file can be accessed, and the signed URL automatically becomes invalid after the configured expiration time.
