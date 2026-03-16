// Example: How Email Notifications Work in Attendance Correction Flow

/*
SCENARIO: A student requests attendance correction and admin processes it

1. STUDENT ACTION: Student submits attendance correction request
   POST /api/attendance/request-correction
   {
     "attendance_id": 123,
     "student_id": "10421001",
     "module_id": "CSE101",
     "proposed_status": "present",
     "reason": "I was present but marked absent by mistake"
   }

2. ADMIN/FACULTY ACTION: Admin reviews and processes the request
   PUT /api/attendance/correction/456
   {
     "approved_status": "present",
     "processed_by": "admin@camwa.edu"
   }

3. SYSTEM PROCESSING (in attendance.service.js):
   - Updates attendance_request table with decision
   - Updates attendance table if approved
   - Creates in-app notification
   - NEW: Sends email to student automatically

4. EMAIL NOTIFICATION FLOW:
   a) System looks up student email in IAM table
   b) Prepares email content with request details
   c) Sends email via testmail API asynchronously
   d) Logs success/failure for monitoring

5. STUDENT RECEIVES:
   - In-app notification (existing feature)
   - Email notification (NEW feature)
*/

// Example Email Content (HTML version):
const exampleEmailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .status-badge { background-color: #28a745; color: white; padding: 5px 10px; border-radius: 5px; }
        .details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Attendance Correction Request</h2>
            <span class="status-badge">Approved</span>
        </div>
        
        <div class="content">
            <p>Dear Student,</p>
            
            <p>Your attendance correction request has been <strong>approved</strong>.</p>
            
            <div class="details">
                <h3>Request Details:</h3>
                <ul>
                    <li><strong>Module ID:</strong> CSE101</li>
                    <li><strong>Original Status:</strong> absent</li>
                    <li><strong>Requested Status:</strong> present</li>
                    <li><strong>Approved Status:</strong> present</li>
                    <li><strong>Reason:</strong> I was present but marked absent by mistake</li>
                    <li><strong>Processed by:</strong> admin@camwa.edu</li>
                    <li><strong>Processed at:</strong> 1/3/2025, 10:30:00 AM</li>
                </ul>
            </div>
            
            <p style="color: #28a745;"><strong>Your attendance record has been updated accordingly.</strong></p>
        </div>
        
        <div class="footer">
            <p>Best regards,<br><strong>CAMWA System</strong></p>
        </div>
    </div>
</body>
</html>
`;

// Example API Usage:
async function exampleUsage() {
    // This is automatically called when admin processes a request
    // No additional API calls needed from frontend
    
    console.log('Email notification is automatically sent when:');
    console.log('1. Admin/Faculty calls PUT /api/attendance/correction/:requestId');
    console.log('2. System processes the request successfully');
    console.log('3. Student receives both in-app and email notifications');
}

export { exampleEmailHTML, exampleUsage };
