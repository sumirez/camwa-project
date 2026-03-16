# Attendance Correction API

## Overview
This documentation explains the updated attendance correction process where admins/faculty staff can update the approved status and the system handles request status based on the comparison between proposed and approved status.

## Handling Correction Requests

### Endpoint
```
PUT /api/attendance/correction/:requestId
```

### Authentication
- Required roles: `ADMIN`, `FACULTY`

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| requestId | String | Yes | The ID of the correction request to process |

### Request Body
```json
{
  "approved_status": "present",  // Required: One of 'present', 'absent', 'late', 'excused'
  "processedBy": "admin_username" // Optional: Username of the processor
}
```

### Response
#### Success (200 OK)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "status": "approved", // or "rejected"
    "message": "Correction Approved", // or "Correction Rejected"
    "proposed_status": "present",
    "approved_status": "present",
    "isApproved": true // true if approved_status matches proposed_status, false otherwise
  },
  "message": "Correction request approved successfully" // or "rejected"
}
```

#### Error (400 Bad Request)
```json
{
  "status": "error",
  "code": 400,
  "message": "Approved status is required"
}
```

### Logic
1. The admin/faculty provides the `approved_status` for the attendance request
2. If `approved_status` matches the student's `proposed_status`, the request is automatically approved and the attendance record is updated
3. If `approved_status` is different from the student's `proposed_status`, the request is marked as rejected
4. The `approved_status` is always saved to the request record, regardless of approval or rejection

### Notes
- This approach gives admins/faculty more control over the attendance correction process
- It automatically determines approval/rejection based on the status values
- The attendance record is only updated when the request is approved
