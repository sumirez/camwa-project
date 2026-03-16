import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const emailService = {
    // Configuration for nodemailer (using existing Gmail SMTP setup)
    ENABLE_EMAIL: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
    RETRY_ATTEMPTS: parseInt(process.env.EMAIL_RETRY_ATTEMPTS) || 3,
    TIMEOUT_MS: parseInt(process.env.EMAIL_TIMEOUT_MS) || 10000,

    // Create transporter (reuse existing Gmail configuration)
    transporter: nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.GMAIL_USER || "lcnltv16ti@gmail.com",
            pass: process.env.GMAIL_APP_PASSWORD || "usxb xbxn xxty szni", // Use App-Specific Password, not regular password
        },
        // Add debugging options
        debug: true,
        logger: false
    }),

    /**
     * Send email using nodemailer with retry logic
     * @param {Object} emailData - Email data
     * @param {string} emailData.to - Recipient email address
     * @param {string} emailData.subject - Email subject
     * @param {string} emailData.text - Plain text content
     * @param {string} emailData.html - HTML content (optional)
     * @returns {Promise<Object>} - Email service response
     */
    sendEmail: async (emailData) => {
        if (!emailService.ENABLE_EMAIL) {
            console.log('Email notifications are disabled');
            return { message: 'Email notifications disabled' };
        }

        try {
            const { to, subject, text, html } = emailData;

            if (!to || !subject || !text) {
                throw new Error('Missing required email fields: to, subject, text');
            }

            const mailOptions = {
                from: process.env.GMAIL_USER || "lcnltv16ti@gmail.com",
                to: to,
                subject: subject,
                text: text,
                ...(html && { html: html })
            };

            let lastError;
            
            // Retry logic
            for (let attempt = 1; attempt <= emailService.RETRY_ATTEMPTS; attempt++) {
                try {
                    const info = await emailService.transporter.sendMail(mailOptions);
                    console.log(`Email sent successfully on attempt ${attempt}:`, info.messageId);
                    return {
                        success: true,
                        messageId: info.messageId,
                        response: info.response
                    };

                } catch (error) {
                    lastError = error;
                    console.warn(`Email sending attempt ${attempt} failed:`, error.message);
                    
                    if (attempt < emailService.RETRY_ATTEMPTS) {
                        // Wait before retry (exponential backoff)
                        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }

            throw new Error(`Failed to send email after ${emailService.RETRY_ATTEMPTS} attempts: ${lastError.message}`);

        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    },

    /**
     * Send attendance correction notification email to student
     * @param {string} studentEmail - Student's email address
     * @param {Object} requestData - Attendance request data
     * @param {boolean} isApproved - Whether the request was approved
     * @param {string} processedBy - Who processed the request
     * @returns {Promise<Object>} - Email service response
     */
    sendAttendanceCorrectionNotification: async (studentEmail, requestData, isApproved, processedBy) => {
        try {
            const status = isApproved ? 'Approved' : 'Rejected';
            const statusColor = isApproved ? '#28a745' : '#dc3545';
            
            const subject = `Attendance Correction Request ${status}`;
            
            const text = `
Dear Student,

Your attendance correction request has been ${status.toLowerCase()}.

Request Details:
- Module ID: ${requestData.module_id}
- Original Status: ${requestData.original_status || 'N/A'}
- Requested Status: ${requestData.proposed_status}
- ${isApproved ? 'Approved' : 'Final'} Status: ${requestData.approved_status || requestData.proposed_status}
- Reason: ${requestData.reason || 'No reason provided'}
- Processed by: ${processedBy}
- Processed at: ${new Date().toLocaleString()}

${isApproved 
    ? 'Your attendance record has been updated accordingly.' 
    : 'Your attendance record remains unchanged. If you believe this decision is incorrect, please contact your instructor or academic coordinator.'
}

Best regards,
CAMWA System
            `.trim();

            const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${statusColor}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .status-badge { background-color: ${statusColor}; color: white; padding: 5px 10px; border-radius: 5px; }
        .details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid ${statusColor}; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Attendance Correction Request</h2>
            <span class="status-badge">${status}</span>
        </div>
        
        <div class="content">
            <p>Dear Student,</p>
            
            <p>Your attendance correction request has been <strong>${status.toLowerCase()}</strong>.</p>
            
            <div class="details">
                <h3>Request Details:</h3>
                <ul>
                    <li><strong>Module ID:</strong> ${requestData.module_id}</li>
                    <li><strong>Original Status:</strong> ${requestData.original_status || 'N/A'}</li>
                    <li><strong>Requested Status:</strong> ${requestData.proposed_status}</li>
                    <li><strong>${isApproved ? 'Approved' : 'Final'} Status:</strong> ${requestData.approved_status || requestData.proposed_status}</li>
                    <li><strong>Reason:</strong> ${requestData.reason || 'No reason provided'}</li>
                    <li><strong>Processed by:</strong> ${processedBy}</li>
                    <li><strong>Processed at:</strong> ${new Date().toLocaleString()}</li>
                </ul>
            </div>
            
            ${isApproved 
                ? '<p style="color: #28a745;"><strong>Your attendance record has been updated accordingly.</strong></p>' 
                : '<p style="color: #dc3545;"><strong>Your attendance record remains unchanged.</strong> If you believe this decision is incorrect, please contact your instructor or academic coordinator.</p>'
            }
        </div>
        
        <div class="footer">
            <p>Best regards,<br><strong>CAMWA System</strong></p>
        </div>
    </div>
</body>
</html>
            `.trim();

            return await emailService.sendEmail({
                to: studentEmail,
                subject,
                text,
                html
            });

        } catch (error) {
            console.error('Error sending attendance correction notification email:', error);
            throw error;
        }
    },

    /**
     * Send confirmation email to student when they submit an attendance correction request
     * @param {string} studentEmail - Student's email address
     * @param {Object} requestData - Attendance request data
     * @param {string} requestId - ID of the created request
     * @returns {Promise<Object>} - Email service response
     */
    sendAttendanceRequestConfirmation: async (studentEmail, requestData, requestId) => {
        try {
            const subject = 'Attendance Correction Request Submitted Successfully';
            
            const text = `
Dear Student,

Your attendance correction request has been submitted successfully and is now pending review.

Request Details:
- Request ID: ${requestId}
- Module ID: ${requestData.module_id}
- Current Status: ${requestData.current_status || 'N/A'}
- Requested Status: ${requestData.proposed_status}
- Reason: ${requestData.reason || 'No reason provided'}
- Submitted at: ${new Date().toLocaleString()}

Your request will be reviewed by the faculty or academic coordinator. You will receive another email notification once your request has been processed.

Please note:
- You can view the status of your request in the CAMWA system
- Processing may take 1-3 business days
- If you have any urgent concerns, please contact your instructor directly

Best regards,
CAMWA System
            `.trim();

            const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .status-badge { background-color: #ffc107; color: #212529; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
        .details { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }
        .info-box { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
        .request-id { font-family: monospace; background-color: #f1f1f1; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📋 Attendance Correction Request</h2>
            <span class="status-badge">Submitted Successfully</span>
        </div>
        
        <div class="content">
            <p>Dear Student,</p>
            
            <p>Your attendance correction request has been <strong>submitted successfully</strong> and is now pending review.</p>
            
            <div class="details">
                <h3>Request Details:</h3>
                <ul>
                    <li><strong>Request ID:</strong> <span class="request-id">#${requestId}</span></li>
                    <li><strong>Module ID:</strong> ${requestData.module_id}</li>
                    <li><strong>Current Status:</strong> ${requestData.current_status || 'N/A'}</li>
                    <li><strong>Requested Status:</strong> ${requestData.proposed_status}</li>
                    <li><strong>Reason:</strong> ${requestData.reason || 'No reason provided'}</li>
                    <li><strong>Submitted at:</strong> ${new Date().toLocaleString()}</li>
                </ul>
            </div>
            
            <div class="info-box">
                <h4>📧 What happens next?</h4>
                <ul>
                    <li>Your request will be reviewed by faculty or academic coordinator</li>
                    <li>You will receive another email notification once processed</li>
                    <li>Processing typically takes 1-3 business days</li>
                    <li>You can check the status anytime in the CAMWA system</li>
                </ul>
            </div>
            
            <p><strong>Note:</strong> If you have any urgent concerns, please contact your instructor directly.</p>
        </div>
        
        <div class="footer">
            <p>Best regards,<br><strong>CAMWA System</strong></p>
            <p style="font-size: 12px; color: #999;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
            `.trim();

            return await emailService.sendEmail({
                to: studentEmail,
                subject,
                text,
                html
            });

        } catch (error) {
            console.error('Error sending attendance request confirmation email:', error);
            throw error;
        }
    }
};

export default emailService;
