# Exam Eligibility API

This document outlines the API endpoints for managing student exam eligibility based on attendance rates.

## Overview

The Exam Eligibility API allows administrators, faculty staff, and lecturers to check and update exam eligibility for students. A student is eligible to attend an exam if their attendance rate is 80% or higher. The eligibility status is only updated when explicitly requested by an administrator or faculty member, not automatically when attendance records change.

## Endpoints

### Get Exam Eligibility

Retrieves exam eligibility information for a student or module.

- **URL**: `/api/attendance/exam-eligibility`
- **Method**: `GET`
- **Authentication**: Required (JWT Token)
- **Authorization**: 
  - ADMIN, FACULTY, LECTURER: Can get eligibility for any student/module
  - STUDENT: Can only get their own eligibility

#### Query Parameters

- `moduleId` (optional): The ID of the module to get eligibility for
- `studentId` (optional): The ID of the student to get eligibility for

#### Responses

- **Success Response**:
  - **Code**: 200
  - **Content**: 
  ```json
  {
    "success": true,
    "message": "Exam eligibility retrieved successfully",
    "data": {
      "attendanceRate": 85.5,
      "isEligible": true,
      "examRecord": {
        "exam_id": 1,
        "module_id": "MODULE123",
        "student_id": "STUDENT123",
        "attendance_rate": 85.5,
        "is_eligible": true,
        "created_at": "2025-06-19T12:00:00.000Z",
        "updated_at": "2025-06-19T12:00:00.000Z"
      }
    }
  }
  ```

- **Error Response**:
  - **Code**: 400
  - **Content**: 
  ```json
  {
    "success": false,
    "message": "Either moduleId or studentId must be provided",
    "error": {
      "status": 400,
      "message": "Either moduleId or studentId must be provided"
    }
  }
  ```

### Update Exam Eligibility for Module

Updates the exam eligibility for all students registered in a module. This is the only endpoint that will actually calculate and update the exam eligibility records in the database. Unlike the previous implementation, eligibility is not automatically updated when attendance records change.

- **URL**: `/api/attendance/exam-eligibility/module/:moduleId`
- **Method**: `POST`
- **Authentication**: Required (JWT Token)
- **Authorization**: ADMIN, FACULTY only

#### URL Parameters

- `moduleId`: The ID of the module to update eligibility for

#### Responses

- **Success Response**:
  - **Code**: 200
  - **Content**: 
  ```json
  {
    "success": true,
    "message": "Exam eligibility updated successfully for module",
    "data": [
      {
        "attendanceRate": 85.5,
        "isEligible": true,
        "examRecord": {
          "exam_id": 1,
          "module_id": "MODULE123",
          "student_id": "STUDENT123",
          "attendance_rate": 85.5,
          "is_eligible": true,
          "created_at": "2025-06-19T12:00:00.000Z",
          "updated_at": "2025-06-19T12:00:00.000Z"
        }
      },
      // Additional student records...
    ]
  }
  ```

- **Error Response**:
  - **Code**: 400
  - **Content**: 
  ```json
  {
    "success": false,
    "message": "Module ID is required",
    "error": {
      "status": 400,
      "message": "Module ID is required"
    }
  }
  ```

## Database Schema

The Exam model includes the following fields:

- `exam_id`: Integer, Primary Key, Auto-increment
- `module_id`: String(36), Foreign Key to Module
- `student_id`: String(20), Foreign Key to Student
- `attendance_rate`: Decimal(5,2), Range 0-100
- `is_eligible`: Boolean, Automatically calculated (attendance_rate >= 80%)
- `created_at`: DateTime
- `updated_at`: DateTime
