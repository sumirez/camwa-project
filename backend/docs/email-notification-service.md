# Email Notification Service

## Overview
The email notification service has been integrated into the CAMWA attendance system to automatically send email notifications to students when their attendance correction requests are processed by admin/faculty members.

## Features
- Automatic email notifications when attendance correction requests are approved or rejected
- Professional HTML email templates with proper styling
- Retry logic with exponential backoff for improved reliability
- Configurable settings via environment variables
- Comprehensive error handling and logging

## Integration Points

### Attendance Service Integration
The email service is integrated into the `attendance.service.js` file in the `handleCorrectionRequest` function. When an admin or faculty member processes an attendance correction request, the system will:

1. Update the attendance request status in the database
2. Update the actual attendance record if approved
3. Create an in-app notification for the student
4. **NEW**: Send an email notification to the student's registered email address

### Email Template Features
The email notifications include:
- Professional styling with color-coded status (green for approved, red for rejected)
- Complete request details including:
  - Module ID
  - Original attendance status
  - Requested status
  - Final approved/rejected status
  - Reason provided by student
  - Processing details (who processed and when)
- Clear next steps for the student

## Configuration

### Environment Variables
You can configure the email service by setting these environment variables in your `.env` file:

```bash
# Email API Configuration
EMAIL_API_KEY=28fc5620-1270-451b-abb9-ce3b3dedd571
EMAIL_NAMESPACE=8clge
EMAIL_BASE_URL=https://api.testmail.app/api/json

# Email Service Settings
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_TIMEOUT_MS=10000
```

### Default Configuration
If environment variables are not set, the service uses these defaults:
- API Key: `28fc5620-1270-451b-abb9-ce3b3dedd571`
- Namespace: `8clge`
- Base URL: `https://api.testmail.app/api/json`
- Retry attempts: 3
- Timeout: 10 seconds
- Email notifications: Enabled

## API Flow

### When Admin/Faculty Processes Request

1. **API Call**: `PUT /api/attendance/correction/:requestId`
   ```json
   {
     "approved_status": "present",
     "processed_by": "admin@camwa.edu"
   }
   ```

2. **Service Processing**:
   - Validates the request
   - Updates database records
   - **NEW**: Retrieves student email from IAM table
   - **NEW**: Sends email notification asynchronously
   - Creates in-app notification

3. **Email Notification**: Sent to student's registered email with:
   - Request details
   - Approval/rejection status
   - Next steps

## Email Content Examples

### Approved Request Email
```
Subject: Attendance Correction Request Approved

Your attendance correction request has been approved.

Request Details:
- Module ID: CSE101
- Original Status: absent
- Requested Status: present
- Approved Status: present
- Reason: I was present but marked absent by mistake
- Processed by: admin@camwa.edu
- Processed at: 2025-01-03 10:30 AM

Your attendance record has been updated accordingly.
```

### Rejected Request Email
```
Subject: Attendance Correction Request Rejected

Your attendance correction request has been rejected.

Request Details:
- Module ID: CSE101
- Original Status: absent
- Requested Status: present
- Final Status: absent
- Reason: I was present but marked absent by mistake
- Processed by: admin@camwa.edu
- Processed at: 2025-01-03 10:30 AM

Your attendance record remains unchanged. If you believe this decision is incorrect, please contact your instructor or academic coordinator.
```

## Error Handling

### Graceful Failure
- Email sending failures do not block the main attendance correction process
- Errors are logged for monitoring and debugging
- Retry logic ensures delivery in case of temporary network issues
- If email fails completely, the in-app notification still works

### Logging
The service provides comprehensive logging:
```javascript
// Success
console.log(`Email notification sent to ${studentEmail} for request ${requestId}`);

// Warning
console.warn(`Could not find email for student ${studentId} - email notification not sent`);

// Error
console.error('Failed to send email notification:', emailError);
```

## Testing

### Test File
A test file is provided at `backend/test-email.js` to verify email functionality:

```bash
cd backend
node test-email.js
```

### Manual Testing
You can test the email service by:
1. Creating an attendance correction request as a student
2. Processing the request as admin/faculty
3. Checking the student's email for the notification

## Security Considerations

### Email Address Validation
- Only sends emails to verified email addresses from the IAM table
- No external email addresses can be targeted
- API key is stored securely in environment variables

### Privacy
- Email content includes only necessary attendance information
- No sensitive personal data is included
- Emails are sent only to the affected student

## Dependencies

### New Dependencies Added
- `node-fetch`: For making HTTP requests to the email API

### Existing Dependencies Used
- `dotenv`: For environment variable management
- IAM model: For retrieving student email addresses

## Monitoring

### Success Indicators
- Successful email delivery logs
- No error logs in email service
- Students receive email notifications

### Failure Indicators
- Email service error logs
- Students not receiving notifications
- API response errors

## Future Enhancements

### Potential Improvements
1. Email template customization via admin panel
2. Email delivery status tracking
3. Email bounce handling
4. Bulk email notifications for attendance updates
5. Email preferences for students (opt-in/opt-out)
6. Multi-language email templates

### Alternative Email Providers
The service can be easily adapted to use other email providers by:
1. Updating the `sendEmail` function
2. Modifying the API configuration
3. Adjusting the payload format

## Troubleshooting

### Common Issues

#### Emails Not Being Sent
1. Check if `ENABLE_EMAIL_NOTIFICATIONS` is set to `true`
2. Verify API key and namespace configuration
3. Check network connectivity to email API
4. Review error logs for specific failure reasons

#### Student Not Receiving Emails
1. Verify student has email address in IAM table
2. Check if email went to spam folder
3. Confirm email address is correct and active
4. Review email delivery logs

#### API Errors
1. Verify API key is correct and active
2. Check namespace configuration
3. Confirm email API service is operational
4. Review API rate limits and quotas
