# Exam Eligibility Module

This module handles checking student eligibility for exams based on attendance rates.

## Overview

Students are eligible to take exams if they have an attendance rate of at least 80% for a specific module. The system calculates this eligibility only when administrators explicitly request an update through the API.

## Features

- On-demand calculation of attendance rates for each student and module
- Eligibility determination based on configurable threshold (default 80%)
- API endpoints for checking and updating exam eligibility
- Admin-only endpoints for updating eligibility status

## API Endpoints

### Get Exam Eligibility

`GET /api/attendance/exam-eligibility`

Query Parameters:
- `moduleId` (optional): Filter by module
- `studentId` (optional): Filter by student

### Update Exam Eligibility for Module

`POST /api/attendance/exam-eligibility/module/:moduleId`

Updates the exam eligibility for all students registered for a specific module.

## Troubleshooting

If you encounter issues with the exam table structure, you can run the fix script:

```bash
node fix-exam-table.js
```

This script will:
1. Check if the exam table exists and create it if needed
2. Verify all required columns are present
3. Recreate necessary indexes and triggers

## Database Schema

The exam table has the following structure:

- `exam_id`: Integer (Primary Key, Auto-increment)
- `module_id`: VARCHAR(36) (Foreign Key to module table)
- `student_id`: VARCHAR(20) (Foreign Key to student table)
- `attendance_rate`: DECIMAL(5,2) (Range 0-100)
- `is_eligible`: BOOLEAN (Automatically calculated as attendance_rate >= 80)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Using from Code

```javascript
// Import the service
import attendanceService from '../services/attendance.service.js';

// Check eligibility for a student in a module
const eligibility = await attendanceService.checkExamEligibility('student123', 'module456');
console.log(`Attendance rate: ${eligibility.attendanceRate}%`);
console.log(`Eligible: ${eligibility.isEligible}`);

// Update eligibility for all students in a module
const results = await attendanceService.updateExamEligibilityForModule('module456');
```
