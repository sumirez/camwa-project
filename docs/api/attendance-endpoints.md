# Attendance API Endpoints
**Version:** 1.6.0  
**Last Updated:** March 2025

## 📋 Overview
Comprehensive API endpoints for attendance management, rate calculations, and exam eligibility operations.

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📊 Attendance Rate Endpoints

### Get Lecturer Modules with Attendance Rates
```http
GET /module-registrations/lecturer/:lecturer_id
```

**Description:** Get all modules for a specific lecturer with attendance rate calculations.

**Access:** Admin, Faculty, Lecturer (own modules only)

**Parameters:**
- `lecturer_id` (path) - Lecturer ID

**Response:**
```json
{
    "success": true,
    "message": "Lecturer modules with student counts and attendance rates retrieved successfully",
    "data": [
        {
            "module_id": "JOP",
            "student_count": "15",
            "attendance_rate": "85.50%",
            "total_attendance_records": 120,
            "non_absent_records": 98,
            "Module": {
                "module_id": "JOP",
                "name": "Object-oriented Programming with Java",
                "semester_id": "WS2025",
                "program_id": "CSE"
            }
        }
    ]
}
```

### Get My Modules with Attendance Rates
```http
GET /module-registrations/my-modules
```

**Description:** Get authenticated lecturer's modules with attendance rates.

**Access:** Lecturer only

**Response:** Same format as above

### Get All Modules with Attendance Rates
```http
GET /module-registrations/all-modules-with-attendance
```

**Description:** Get all registered modules from all lecturers with attendance rates.

**Access:** Admin, Faculty only

**Response:**
```json
{
    "success": true,
    "message": "All registered modules with student counts and attendance rates retrieved successfully",
    "data": [
        {
            "module_id": "JOP",
            "lecturer_id": "L001",
            "student_count": "15",
            "attendance_rate": "85.50%",
            "total_attendance_records": 120,
            "absent_count": 22,
            "Module": {
                "module_id": "JOP",
                "name": "Object-oriented Programming with Java",
                "program_id": "CSE"
            },
            "Lecturer": {
                "lecturer_id": "L001",
                "name": "Dr. John Smith"
            }
        }
    ]
}
```

## 🎯 Exam Eligibility Endpoints

### Update All Modules Exam Eligibility
```http
POST /attendance/exam-eligibility/update-all-modules
```

**Description:** Update exam eligibility for all students across all modules.

**Access:** Admin, Faculty only

**Request Body:** None required

**Response:**
```json
{
    "status": "success",
    "code": 200,
    "message": "Exam eligibility updated for all modules. Processed 5 modules with 95.50% success rate.",
    "data": {
        "summary": {
            "total_modules_processed": 5,
            "total_students_success": 42,
            "total_students_failed": 2,
            "success_rate": "95.45%"
        },
        "modules": [
            {
                "module_id": "JOP",
                "students_processed": 10,
                "students_success": 9,
                "students_failed": 1,
                "success_attendance_rate": "90.00%"
            }
        ]
    }
}
```

### Update Lecturer's Modules Exam Eligibility
```http
POST /attendance/exam-eligibility/update-my-modules
```

**Description:** Update exam eligibility for authenticated lecturer's modules only.

**Access:** Lecturer only

**Request Body:** None required

**Response:**
```json
{
    "status": "success",
    "code": 200,
    "message": "Exam eligibility updated for your modules. 15 students eligible, 3 ineligible.",
    "data": {
        "lecturer_id": "L001",
        "summary": {
            "total_modules_processed": 3,
            "total_students_success": 15,
            "total_students_failed": 3,
            "success_rate": "83.33%"
        }
    }
}
```

### Update Single Module Exam Eligibility
```http
POST /attendance/exam-eligibility/update-module/:module_id
```

**Description:** Update exam eligibility for a specific module.

**Access:** Admin, Faculty, Lecturer (own modules only)

**Parameters:**
- `module_id` (path) - Module ID

**Response:**
```json
{
    "status": "success",
    "code": 200,
    "message": "Exam eligibility updated for module JOP. 9 students eligible, 1 ineligible.",
    "data": {
        "module_id": "JOP",
        "students_processed": 10,
        "students_success": 9,
        "students_failed": 1,
        "success_attendance_rate": "90.00%"
    }
}
```

## 📝 Standard Attendance Endpoints

### Get Attendance Records
```http
GET /attendance/module/:module_id
```

**Description:** Get attendance records for a specific module.

**Access:** Admin, Faculty, Lecturer (own modules), Student (own records)

### Create Attendance Record
```http
POST /attendance
```

**Description:** Create a new attendance record.

**Access:** Admin, Faculty, Lecturer

**Request Body:**
```json
{
    "student_id": "10421001",
    "module_id": "JOP",
    "attendance_date": "2025-03-15",
    "status": "present"
}
```

### Update Attendance Record
```http
PUT /attendance/:attendance_id
```

**Description:** Update an existing attendance record.

**Access:** Admin, Faculty, Lecturer

### Delete Attendance Record
```http
DELETE /attendance/:attendance_id
```

**Description:** Delete an attendance record.

**Access:** Admin, Faculty only

## 🔧 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 📊 Data Models

### Attendance Rate Response
```typescript
interface AttendanceRateResponse {
    module_id: string;
    student_count: string;
    attendance_rate: string;
    total_attendance_records: number;
    non_absent_records: number;
    Module: {
        module_id: string;
        name: string;
        semester_id: string;
        program_id: string;
    };
}
```

### Exam Eligibility Response
```typescript
interface ExamEligibilityResponse {
    status: string;
    code: number;
    message: string;
    data: {
        summary: {
            total_modules_processed: number;
            total_students_success: number;
            total_students_failed: number;
            success_rate: string;
        };
        modules: ModuleEligibilityResult[];
    };
}
```

## 🎯 Usage Examples

### Calculate Attendance Rates
```javascript
// Get lecturer's modules with attendance rates
const response = await fetch('/api/module-registrations/my-modules', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const data = await response.json();
console.log(`Module ${data.data[0].module_id} has ${data.data[0].attendance_rate} attendance rate`);
```

### Update Exam Eligibility
```javascript
// Update all modules (Admin/Faculty only)
const response = await fetch('/api/attendance/exam-eligibility/update-all-modules', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const result = await response.json();
console.log(`Processed ${result.data.summary.total_modules_processed} modules`);
```

## 🔒 Security Notes

- All endpoints require valid JWT authentication
- Role-based access control enforced
- Lecturers can only access their own modules
- Students can only view their own attendance records
- Sensitive operations limited to Admin/Faculty roles

---

**Related Documents:**
- [Attendance Rate Feature](../updates/2025-Q1-attendance-rate-feature.md)
- [Exam Eligibility System](../updates/2025-Q1-exam-eligibility-system.md)
- [API Authentication Guide](authentication-api.md)
