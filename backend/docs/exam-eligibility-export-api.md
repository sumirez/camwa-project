# Exam Eligibility Export API

This document describes the API endpoint for exporting exam eligibility data to Excel files.

## Export Exam Eligibility to Excel

**Endpoint:** `POST /api/attendance/exam-eligibility/export`

**Description:** Exports exam eligibility data to Excel files (one file per module) containing student attendance rates and eligibility status.

**Access Control:** Only accessible by `ADMIN` and `FACULTY` roles.

### Request

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:** No request body required.

### Response

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Export completed successfully. Generated 5 Excel files out of 5 modules processed.",
  "data": {
    "export_summary": {
      "total_modules_processed": 5,
      "successful_exports": 5,
      "failed_exports": 0,
      "export_directory": "c:\\path\\to\\eligibility for exam"
    },
    "export_results": [
      {
        "module_id": "CS101",
        "fileName": "CS101_eligibility_for_exam.xlsx",
        "filePath": "c:\\path\\to\\eligibility for exam\\CS101_eligibility_for_exam.xlsx",
        "studentsProcessed": 30,
        "studentsEligible": 25,
        "studentsIneligible": 5,
        "errors": 0
      },
      {
        "module_id": "MATH201",
        "fileName": "MATH201_eligibility_for_exam.xlsx",
        "filePath": "c:\\path\\to\\eligibility for exam\\MATH201_eligibility_for_exam.xlsx",
        "studentsProcessed": 28,
        "studentsEligible": 20,
        "studentsIneligible": 8,
        "errors": 0
      }
    ]
  }
}
```

**Error Responses:**

**403 Forbidden - Insufficient Permissions:**
```json
{
  "status": "error",
  "code": 403,
  "message": "This endpoint is only accessible by administrators and faculty"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "code": 500,
  "message": "Failed to export exam eligibility data"
}
```

### Excel File Format

Each exported Excel file contains the following columns:

| Column | Description |
|--------|-------------|
| `module_id` | The unique identifier for the module |
| `module_name` | The name of the module |
| `lecturer_id` | The ID of the lecturer teaching the module |
| `student_id` | The unique identifier for the student |
| `student_name` | The full name of the student |
| `attendanceRate` | The student's attendance rate as a percentage (e.g., 85.5) |
| `isEligible` | Boolean indicating if the student is eligible for the exam (true/false) |

### File Storage

- Files are stored in the `eligibility for exam` folder within the backend directory
- Each file is named using the pattern: `{module_id}_eligibility_for_exam.xlsx`
- Files are automatically organized by module for easy access

### Business Logic

- Students with attendance rate ≥ 80% are marked as eligible (`isEligible: true`)
- Students with attendance rate < 80% are marked as ineligible (`isEligible: false`)
- Only modules with registered students are included in the export
- The export includes all active modules and their registered students

### Usage Examples

**Using curl:**
```bash
curl -X POST "http://localhost:5000/api/attendance/exam-eligibility/export" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

**Using JavaScript/Fetch:**
```javascript
const response = await fetch('/api/attendance/exam-eligibility/export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log('Export completed:', result.data.export_summary);
```

### Integration Notes

- This endpoint can be called independently or as part of a larger workflow
- Consider implementing file cleanup procedures for old exports
- The export process may take some time for large datasets
- Files can be downloaded separately using file system access or additional download endpoints
