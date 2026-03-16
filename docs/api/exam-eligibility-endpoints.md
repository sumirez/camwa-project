# Exam Eligibility API Endpoints
**Version:** 1.6.0  
**Last Updated:** March 2025

## 📋 Overview
Comprehensive API endpoints for managing exam eligibility based on attendance rates with automated calculations and bulk operations.

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🎯 Exam Eligibility Endpoints

### Update All Modules Exam Eligibility
```http
POST /attendance/exam-eligibility/update-all-modules
```

**Description:** Updates exam eligibility for all students across all modules based on 80% attendance threshold.

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
                "students_with_errors": 0,
                "success_attendance_rate": "90.00%",
                "results": [
                    {
                        "student_id": "10421001",
                        "attendanceRate": 85.5,
                        "isEligible": true,
                        "examRecord": {
                            "exam_id": 1,
                            "student_id": "10421001",
                            "module_id": "JOP",
                            "attendance_rate": 85.5,
                            "is_eligible": true,
                            "updated_at": "2025-03-15T10:00:00.000Z"
                        }
                    }
                ]
            }
        ]
    }
}
```

### Update Lecturer's Modules Exam Eligibility
```http
POST /attendance/exam-eligibility/update-my-modules
```

**Description:** Updates exam eligibility for authenticated lecturer's modules only.

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
        },
        "modules": [
            {
                "module_id": "JOP",
                "students_processed": 5,
                "students_success": 4,
                "students_failed": 1,
                "success_attendance_rate": "80.00%"
            }
        ]
    }
}
```

### Update Single Module Exam Eligibility
```http
POST /attendance/exam-eligibility/update-module/:module_id
```

**Description:** Updates exam eligibility for a specific module.

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
        "students_with_errors": 0,
        "success_attendance_rate": "90.00%",
        "results": [
            {
                "student_id": "10421001",
                "attendanceRate": 85.5,
                "isEligible": true,
                "examRecord": {
                    "exam_id": 1,
                    "student_id": "10421001",
                    "module_id": "JOP",
                    "attendance_rate": 85.5,
                    "is_eligible": true,
                    "created_at": "2025-03-15T10:00:00.000Z",
                    "updated_at": "2025-03-15T10:00:00.000Z"
                }
            }
        ]
    }
}
```

### Get Student Exam Eligibility
```http
GET /attendance/exam-eligibility/student/:student_id
```

**Description:** Get exam eligibility records for a specific student.

**Access:** Admin, Faculty, Lecturer (own modules), Student (own records only)

**Parameters:**
- `student_id` (path) - Student ID

**Response:**
```json
{
    "status": "success",
    "message": "Student exam eligibility retrieved successfully",
    "data": [
        {
            "exam_id": 1,
            "student_id": "10421001",
            "module_id": "JOP",
            "attendance_rate": 85.5,
            "is_eligible": true,
            "created_at": "2025-03-15T10:00:00.000Z",
            "updated_at": "2025-03-15T10:00:00.000Z",
            "Module": {
                "module_id": "JOP",
                "name": "Object-oriented Programming with Java",
                "semester_id": "WS2025"
            }
        }
    ]
}
```

### Get Module Exam Eligibility
```http
GET /attendance/exam-eligibility/module/:module_id
```

**Description:** Get exam eligibility records for all students in a module.

**Access:** Admin, Faculty, Lecturer (own modules only)

**Parameters:**
- `module_id` (path) - Module ID

**Response:**
```json
{
    "status": "success",
    "message": "Module exam eligibility retrieved successfully",
    "data": {
        "module_id": "JOP",
        "total_students": 10,
        "eligible_students": 9,
        "ineligible_students": 1,
        "eligibility_rate": "90.00%",
        "records": [
            {
                "exam_id": 1,
                "student_id": "10421001",
                "attendance_rate": 85.5,
                "is_eligible": true,
                "Student": {
                    "student_id": "10421001",
                    "name": "John Doe"
                }
            }
        ]
    }
}
```

### Get My Exam Eligibility (Student)
```http
GET /attendance/exam-eligibility/my-eligibility
```

**Description:** Get authenticated student's exam eligibility records.

**Access:** Student only

**Response:**
```json
{
    "status": "success",
    "message": "Your exam eligibility retrieved successfully",
    "data": [
        {
            "exam_id": 1,
            "student_id": "10421001",
            "module_id": "JOP",
            "attendance_rate": 85.5,
            "is_eligible": true,
            "threshold": 80.0,
            "Module": {
                "module_id": "JOP",
                "name": "Object-oriented Programming with Java"
            }
        }
    ]
}
```

## 🔧 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 📊 Data Models

### Exam Eligibility Record
```typescript
interface ExamEligibility {
    exam_id: number;
    student_id: string;
    module_id: string;
    attendance_rate: number;
    is_eligible: boolean;
    threshold: number;
    created_at: string;
    updated_at: string;
}
```

### Eligibility Update Response
```typescript
interface EligibilityUpdateResponse {
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

### Module Eligibility Result
```typescript
interface ModuleEligibilityResult {
    module_id: string;
    students_processed: number;
    students_success: number;
    students_failed: number;
    students_with_errors: number;
    success_attendance_rate: string;
    results: StudentEligibilityResult[];
}
```

## 🎯 Usage Examples

### Update All Modules (Admin/Faculty)
```javascript
const response = await fetch('/api/attendance/exam-eligibility/update-all-modules', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const result = await response.json();
console.log(`Processed ${result.data.summary.total_modules_processed} modules`);
console.log(`Success rate: ${result.data.summary.success_rate}`);
```

### Update Lecturer's Modules
```javascript
const response = await fetch('/api/attendance/exam-eligibility/update-my-modules', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const result = await response.json();
console.log(`Updated ${result.data.summary.total_modules_processed} of your modules`);
```

### Check Student Eligibility
```javascript
const response = await fetch('/api/attendance/exam-eligibility/student/10421001', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const data = await response.json();
data.data.forEach(record => {
    console.log(`${record.Module.name}: ${record.is_eligible ? 'Eligible' : 'Not Eligible'} (${record.attendance_rate}%)`);
});
```

### Get Module Eligibility Overview
```javascript
const response = await fetch('/api/attendance/exam-eligibility/module/JOP', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const data = await response.json();
console.log(`Module ${data.data.module_id}: ${data.data.eligibility_rate} eligibility rate`);
console.log(`${data.data.eligible_students}/${data.data.total_students} students eligible`);
```

## 📈 Eligibility Calculation Logic

### Attendance Rate Calculation
```
Attendance Rate = (Total Non-Absent Records / Total Attendance Records) × 100
```

### Eligibility Determination
```
Is Eligible = Attendance Rate >= 80%
```

### Status Definitions
- **Present:** Counts towards eligibility
- **Late:** Counts towards eligibility
- **Excused:** Counts towards eligibility
- **Absent:** Does not count towards eligibility

## 🔒 Security & Access Control

### Role-Based Access
- **Admin/Faculty:** Can update all modules and view all records
- **Lecturer:** Can only update/view own modules
- **Student:** Can only view own eligibility records

### Data Isolation
- Lecturers automatically filtered to their own modules
- Students automatically filtered to their own records
- Cross-access prevented at the service layer

### Audit Trail
- All eligibility updates are logged
- Timestamps track when eligibility was last calculated
- Historical records maintained for compliance

## 🚨 Error Handling

### Common Errors
- **403 Forbidden:** Trying to access other lecturer's modules
- **404 Not Found:** Module or student not found
- **500 Internal Server Error:** Database or calculation errors

### Error Response Format
```json
{
    "status": "error",
    "code": 403,
    "message": "Access denied",
    "error": "You can only access your own modules"
}
```

## 📊 Performance Considerations

### Optimization
- **Batch Processing:** Updates processed sequentially to avoid database overload
- **Caching:** Frequently accessed eligibility data cached
- **Indexing:** Database indexes on key fields for fast queries
- **Pagination:** Large result sets paginated for performance

### Monitoring
- **Processing Time:** Track time for bulk operations
- **Success Rates:** Monitor calculation success rates
- **Error Patterns:** Identify common failure points
- **Resource Usage:** Monitor database and server resources

---

**Related Documents:**
- [Exam Eligibility System](../updates/2025-Q1-exam-eligibility-system.md)
- [Attendance Rate Feature](../updates/2025-Q1-attendance-rate-feature.md)
- [Database Schema](../database/exam-eligibility-schema.md)
