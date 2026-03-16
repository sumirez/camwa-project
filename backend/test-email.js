import emailService from '../src/services/email.service.js';

// Test function for email service
async function testEmailService() {
    try {
        console.log('Testing nodemailer email service...');
        
        // Test basic email sending
        const testEmailData = {
            to: 'test-recipient@example.com', // Replace with a real email for testing
            subject: 'Test Email from CAMWA System',
            text: 'This is a test email to verify the email service is working correctly using nodemailer.',
            html: '<h1>Test Email</h1><p>This is a test email to verify the email service is working correctly using <strong>nodemailer</strong>.</p>'
        };

        console.log('Sending basic test email...');
        const basicEmailResult = await emailService.sendEmail(testEmailData);
        console.log('Basic email result:', basicEmailResult);

        // Test attendance correction notification
        const mockRequestData = {
            module_id: 'TEST_MODULE_001',
            original_status: 'absent',
            proposed_status: 'present',
            approved_status: 'present',
            reason: 'I was present but marked absent by mistake'
        };

        console.log('Sending attendance correction notification email...');
        const notificationResult = await emailService.sendAttendanceCorrectionNotification(
            'student-test@example.com', // Replace with a real email for testing
            mockRequestData,
            true, // approved
            'admin@camwa.edu'
        );
        console.log('Notification email result:', notificationResult);

        // Test attendance request confirmation
        const mockConfirmationData = {
            module_id: 'TEST_MODULE_001',
            attendance_date: '2025-01-03',
            current_status: 'absent',
            proposed_status: 'present',
            reason: 'I was present but marked absent by mistake'
        };

        console.log('Sending attendance request confirmation email...');
        const confirmationResult = await emailService.sendAttendanceRequestConfirmation(
            'student-test@example.com', // Replace with a real email for testing
            mockConfirmationData,
            'REQ123456' // mock request ID
        );
        console.log('Confirmation email result:', confirmationResult);

        console.log('Email service test completed successfully!');

    } catch (error) {
        console.error('Email service test failed:', error);
    }
}

// Run the test if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    console.log('Note: Make sure to set GMAIL_USER and GMAIL_PASS environment variables before testing');
    console.log('Also replace test email addresses with real ones to see the emails');
    testEmailService();
}

export { testEmailService };
