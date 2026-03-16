# Lecturer Exam Eligibility Export API

This document describes the API endpoint for lecturers to export exam eligibility data for their own modules to Excel files.

## Export Exam Eligibility for Lecturer's Modules

**Endpoint:** `POST /api/attendance/exam-eligibility/export-my-modules`

**Description:** Exports exam eligibility data to Excel files (one file per module) for modules taught by the authenticated lecturer. Each file contains student attendance rates and eligibility status for that specific module.

**Access Control:** Only accessible by `LECTURER` role.

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
  "message": "Export completed successfully for lecturer ngocth. Generated 2 Excel files out of 2 modules processed.",
  "data": {
    "lecturer_id": "ngocth",
    "export_summary": {
      "total_modules_processed": 2,
      "successful_exports": 2,
      "failed_exports": 0,
      "export_directory": "c:\\path\\to\\eligibility for exam"
    },
    "export_results": [
      {
        "module_id": "JOP",
        "lecturer_id": "ngocth",
        "fileName": "ngocth_JOP_eligibility_for_exam.xlsx",
        "filePath": "c:\\path\\to\\eligibility for exam\\ngocth_JOP_eligibility_for_exam.xlsx",
        "studentsProcessed": 1,
        "studentsEligible": 0,
        "studentsIneligible": 1,
        "errors": 0
      },
      {
        "module_id": "TCS",
        "lecturer_id": "ngocth",
        "fileName": "ngocth_TCS_eligibility_for_exam.xlsx",
        "filePath": "c:\\path\\to\\eligibility for exam\\ngocth_TCS_eligibility_for_exam.xlsx",
        "studentsProcessed": 4,
        "studentsEligible": 1,
        "studentsIneligible": 3,
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
  "message": "This endpoint is only accessible by lecturers"
}
```

**400 Bad Request - Missing Lecturer ID:**
```json
{
  "status": "error",
  "code": 400,
  "message": "Lecturer ID is required"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "code": 500,
  "message": "Error exporting exam eligibility to Excel for lecturer"
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
| `attendanceRate` | The student's attendance rate as a percentage (e.g., 85.5%) |
| `isEligible` | YES/NO indicating if the student is eligible for the exam |

### File Naming Convention

Files are named using the pattern: `{lecturer_id}_{module_id}_eligibility_for_exam.xlsx`

**Examples:**
- `ngocth_TCS_eligibility_for_exam.xlsx`
- `ngocth_JOP_eligibility_for_exam.xlsx`
- `john123_CS101_eligibility_for_exam.xlsx`

### File Storage

- Files are stored in the `eligibility for exam` folder within the backend directory
- Each lecturer can only export data for their own modules
- Files are organized by the naming convention for easy identification

### Business Logic

- Students with attendance rate ≥ 80% are marked as eligible (`isEligible: YES`)
- Students with attendance rate < 80% are marked as ineligible (`isEligible: NO`)
- Only modules taught by the authenticated lecturer are included
- The export includes all students registered for the lecturer's modules
- Exam eligibility is updated before export to ensure latest data

### Security Features

- **Role-based access:** Only lecturers can access this endpoint
- **Data isolation:** Lecturers can only export their own modules
- **Authentication required:** Valid JWT token must be provided
- **Authorization validation:** Lecturer ID is extracted from the token

### Usage Examples

**Using curl:**
```bash
curl -X POST "http://localhost:5000/api/attendance/exam-eligibility/export-my-modules" \
  -H "Authorization: Bearer lecturer_jwt_token_here" \
  -H "Content-Type: application/json"
```

**Using JavaScript/Fetch:**
```javascript
const response = await fetch('/api/attendance/exam-eligibility/export-my-modules', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${lecturerToken}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
console.log('Export completed for lecturer:', result.data.lecturer_id);
console.log('Files generated:', result.data.export_results.length);
```

### Integration with updateExamEligibilityForMyModules

This export endpoint integrates seamlessly with the `updateExamEligibilityForMyModules` functionality:

1. **Automatic Update:** Calls `updateExamEligibilityForMyModules` first to ensure latest data
2. **Reuses Results:** Uses the updated eligibility data to generate Excel files
3. **Consistent Data:** Export reflects the same calculation logic as the update endpoint
4. **Efficient Processing:** No redundant calculations, leverages existing service methods

### Response Data Mapping

The export uses data from `updateExamEligibilityForMyModules` response:
- `modules[].results[].attendanceRate` → Excel `attendanceRate` column
- `modules[].results[].isEligible` → Excel `isEligible` column  
- `modules[].results[].examRecord.student_id` → Excel `student_id` column
- Additional student and module data fetched for complete Excel file

### Workflow

1. **Authentication:** Verify lecturer token and extract lecturer ID
2. **Update Eligibility:** Call `updateExamEligibilityForMyModules(lecturerId)`
3. **Process Modules:** Iterate through lecturer's modules
4. **Fetch Additional Data:** Get student names and module details
5. **Generate Excel Files:** Create formatted files with styling
6. **Return Results:** Provide comprehensive export summary

This endpoint provides lecturers with a convenient way to export their module eligibility data for record-keeping, analysis, and reporting purposes.
