# Student API Endpoints Documentation

## Overview
This document describes the new API endpoints for students to access their module registration information and exam eligibility status.

## Base URL
```
/api/student
```

## Endpoints

### 1. Get Student's Registered Modules with Attendance Rates

#### GET `/student/:student_id/modules-with-attendance`

**Description:** Get all registered modules for a specific student with attendance rates calculated for each module.

**Authentication:** Required (JWT Token)

**Authorization:** 
- ADMIN, FACULTY, LECTURER: Can get modules for any student
- STUDENT: Can only get their own modules

**Parameters:**
- `student_id` (path parameter): The ID of the student

**Response Format:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Student modules with attendance rates retrieved successfully",
  "metaData": [
    {
      "module_reg_id": 1,
      "module_id": "MOD001",
      "module_name": "Software Engineering",
      "lecturer_id": "LEC001",
      "program_id": "PROG001",
      "intake": 2024,
      "semester_id": "SEM001",
      "attendance_rate": 85.5,
      "total_classes": 20,
      "attended_classes": 17,
      "registration_date": "2024-01-15T08:00:00.000Z"
    }
  ],
  "doc": "https://api.example.com/docs"
}
```

### 2. Get My Registered Modules with Attendance Rates (Student Only)

#### GET `/student/my/modules-with-attendance`

**Description:** Get all registered modules for the authenticated student with attendance rates.

**Authentication:** Required (JWT Token)

**Authorization:** STUDENT only

**Response Format:** Same as above

### 3. Get Student's Exam Eligibility Status

#### GET `/student/:student_id/exam-eligibility-status`

**Description:** Get exam eligibility status for all modules where the student has exam records.

**Authentication:** Required (JWT Token)

**Authorization:** 
- ADMIN, FACULTY, LECTURER: Can get exam eligibility for any student
- STUDENT: Can only get their own exam eligibility

**Parameters:**
- `student_id` (path parameter): The ID of the student

**Response Format:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Student exam eligibility status retrieved successfully",
  "metaData": {
    "message": "Found 2 exam record(s) for this student",
    "exam_records": [
      {
        "exam_id": 1,
        "module_id": "MOD001",
        "module_name": "Software Engineering",
        "lecturer_id": "LEC001",
        "program_id": "PROG001",
        "intake": 2024,
        "semester_id": "SEM001",
        "attendance_rate": 85.5,
        "is_eligible": true,
        "eligibility_status": "This student is eligible for the exam in module Software Engineering",
        "exam_record_date": "2024-01-20T10:00:00.000Z"
      },
      {
        "exam_id": 2,
        "module_id": "MOD002",
        "module_name": "Database Systems",
        "lecturer_id": "LEC002",
        "program_id": "PROG001",
        "intake": 2024,
        "semester_id": "SEM001",
        "attendance_rate": 70.0,
        "is_eligible": false,
        "eligibility_status": "This student is not eligible for the exam in module Database Systems",
        "exam_record_date": "2024-01-20T10:00:00.000Z"
      }
    ]
  },
  "doc": "https://api.example.com/docs"
}
```

**Response when no exam records exist:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Student exam eligibility status retrieved successfully",
  "metaData": {
    "message": "Currently there is no update about any exams for this student",
    "exam_records": []
  },
  "doc": "https://api.example.com/docs"
}
```

### 4. Get My Exam Eligibility Status (Student Only)

#### GET `/student/my/exam-eligibility-status`

**Description:** Get exam eligibility status for the authenticated student.

**Authentication:** Required (JWT Token)

**Authorization:** STUDENT only

**Response Format:** Same as above

## Error Responses

### 403 Forbidden
```json
{
  "status": "error",
  "code": 403,
  "message": "Students can only view their own modules",
  "error": "Students can only view their own modules",
  "doc": "https://api.example.com/docs"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "code": 500,
  "message": "Error retrieving student modules with attendance rates: [error details]",
  "error": "[error details]",
  "doc": "https://api.example.com/docs"
}
```

## Usage Examples

### 1. Student accessing their own modules with attendance rates:
```bash
curl -X GET "http://localhost:3000/api/student/my/modules-with-attendance" \
  -H "Authorization: Bearer [student_jwt_token]"
```

### 2. Admin accessing any student's modules:
```bash
curl -X GET "http://localhost:3000/api/student/STU001/modules-with-attendance" \
  -H "Authorization: Bearer [admin_jwt_token]"
```

### 3. Student checking their exam eligibility:
```bash
curl -X GET "http://localhost:3000/api/student/my/exam-eligibility-status" \
  -H "Authorization: Bearer [student_jwt_token]"
```

## Notes

1. **Attendance Rate Calculation:** Uses the existing `calculateAttendanceRate` method from the attendance service.

2. **Eligibility Determination:** Based on the `is_eligible` field in the exam table. If `is_eligible` is true, the student is eligible; if false, they are not eligible.

3. **No Exam Records:** If a student has no exam records, the system returns a message indicating no exam updates are available.

4. **Error Handling:** If attendance calculation fails for a module, the system returns the module information with 0% attendance rate and an error message.

5. **Role-based Access:** Students can only access their own data, while staff (ADMIN, FACULTY, LECTURER) can access any student's data.

6. **Data Relationships:** The APIs leverage existing relationships between ModuleRegistration, Module, and Exam models to provide comprehensive information.
