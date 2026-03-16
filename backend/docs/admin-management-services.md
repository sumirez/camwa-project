# Admin Management Services

This document describes the services for admin-only management of intakes, semesters, and programs.

## Authentication

All admin operations require a valid JWT token with admin role. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Intake Management

### Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET    | /api/intakes | Get all intakes | Any |
| GET    | /api/intakes/:year | Get intake by year | Any |
| POST   | /api/intakes | Create new intake | Admin |
| PUT    | /api/intakes/:year | Update an intake | Admin |
| DELETE | /api/intakes/:year | Delete an intake | Admin |

### Sample Request Body for Create/Update

```json
{
  "year": 2025
}
```

## Semester Management

### Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET    | /api/semesters | Get all semesters | Any |
| GET    | /api/semesters/current | Get current active semester | Any |
| GET    | /api/semesters/:sem_id | Get semester by ID | Any |
| POST   | /api/semesters | Create new semester | Admin |
| PUT    | /api/semesters/:sem_id | Update a semester | Admin |
| DELETE | /api/semesters/:sem_id | Delete a semester | Admin |

### Sample Request Body for Create/Update

```json
{
  "start_date": "2025-09-01T00:00:00.000Z",
  "end_date": "2026-01-31T00:00:00.000Z"
}
```

## Program Management

### Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET    | /api/programs | Get all programs | Admin, Faculty |
| GET    | /api/programs/:program_id | Get program by ID | Admin, Faculty |
| POST   | /api/programs | Create new program | Admin |
| PUT    | /api/programs/:program_id | Update a program | Admin |
| DELETE | /api/programs/:program_id | Delete a program | Admin |
| POST   | /api/programs/:program_id/students/:student_id | Assign student to program | Admin, Faculty |
| POST   | /api/programs/:program_id/lecturers/:lecturer_id | Assign lecturer to program | Admin, Faculty |
| POST   | /api/programs/:program_id/modules/:module_id | Assign module to program | Admin, Faculty |
| GET    | /api/programs/:program_id/modules | View modules in program | Admin, Faculty |
| GET    | /api/programs/:program_id/lecturers | View lecturers in program | Admin, Faculty |
| GET    | /api/programs/:program_id/students | View students in program | Admin, Faculty |

### Sample Request Body for Create/Update

```json
{
  "program_id": "CS2025",
  "name": "Computer Science"
}
```
