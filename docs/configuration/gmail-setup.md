# Gmail App Password Setup Guide
**Version:** 1.0.0  
**Last Updated:** 2025-Q1

## 🎯 Problem Statement
Gmail requires **App-Specific Passwords** for SMTP access, not regular Gmail passwords. This guide provides step-by-step instructions for setting up Gmail authentication for the CAMWA email service.

## 🚀 Quick Setup Steps

### Step 1: Enable 2-Factor Authentication
1. Navigate to: https://myaccount.google.com/security
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow the setup process if not already enabled
4. Verify your phone number or alternate verification method

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Enter "CAMWA System"
4. Click **Generate**
5. Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### Step 3: Configure Environment Variables
```bash
# Update your .env file
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop  # Remove spaces!
```

**Important Notes:**
- Use the app password WITHOUT spaces: `abcdefghijklmnop`
- Do NOT use your regular Gmail password
- Keep the app password secure and private

### Step 4: Test Configuration
```bash
cd backend
node test-email.js
```

## 🔧 Complete Environment Configuration

### Required Variables
```bash
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=camwa_db
JWT_SECRET=mysecretkey
GOOGLE_APPLICATION_CREDENTIALS=./backend/src/config/serviceAccountKey.json

# Gmail Configuration
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-actual-16-char-app-password

# Email Service Settings
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_TIMEOUT_MS=10000
```

## 🚨 Troubleshooting

### Common Authentication Errors

#### "Username and Password not accepted"
**Solutions:**
1. **Verify App Password:** Ensure you're using the 16-character app password
2. **Check Spaces:** Remove all spaces from the app password
3. **Regenerate:** Create a new app password if the current one isn't working

#### "Less Secure Apps" Error
**Solutions:**
1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Note: This is not recommended for production environments

#### "Account Access" Error
**Solutions:**
1. Go to: https://accounts.google.com/DisplayUnlockCaptcha
2. Click "Continue" to unlock your account
3. Try the email service again

### Advanced Troubleshooting Steps

#### Double-check App Password
1. Go back to Google App Passwords
2. Revoke the existing "CAMWA System" password
3. Generate a new app password
4. Update your `.env` file with the new password

#### Verify 2-Factor Authentication
1. Ensure 2FA is properly enabled
2. Test that you can receive verification codes
3. Make sure your backup codes are saved

#### Test Network Connectivity
```bash
# Test SMTP connection
telnet smtp.gmail.com 587
```

## 🔒 Security Best Practices

### App Password Management
- **Unique Passwords:** Use different app passwords for different applications
- **Regular Rotation:** Change app passwords quarterly
- **Revoke Unused:** Remove app passwords for discontinued services
- **Monitor Activity:** Regularly check Gmail security activity

### Account Security
- **Enable 2FA:** Always use 2-factor authentication
- **Strong Password:** Use a strong primary Gmail password
- **Security Alerts:** Enable Gmail security notifications
- **Regular Reviews:** Periodically review account access

## 🎯 Alternative Authentication Methods

### OAuth2 Setup (More Secure)
If app passwords don't work, OAuth2 provides enhanced security:

```javascript
// OAuth2 Configuration (Advanced)
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

// Set credentials
oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});
```

### Service Account Setup
For production environments, consider using service accounts:

```javascript
// Service Account Configuration
const serviceAccount = require('./path/to/service-account.json');
const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/gmail.send']
);
```

## 📊 Testing and Validation

### Test Email Service
```bash
# Run the email test script
cd backend
node test-email.js
```

### Expected Test Output
```
Testing nodemailer email service...
Sending basic test email...
✓ Basic email sent successfully
Sending attendance notification...
✓ Notification email sent successfully
Email service test completed successfully!
```

### Manual Testing
1. **Send Test Email:** Use the test script with a real email address
2. **Check Delivery:** Verify emails arrive in the recipient's inbox
3. **Check Logs:** Review console output for any errors
4. **Test Retry Logic:** Temporarily use wrong credentials to test error handling

## 📈 Production Considerations

### Multiple Environments
```bash
# Development
GMAIL_USER=dev-camwa@gmail.com
GMAIL_APP_PASSWORD=dev-app-password

# Staging
GMAIL_USER=staging-camwa@gmail.com
GMAIL_APP_PASSWORD=staging-app-password

# Production
GMAIL_USER=production-camwa@gmail.com
GMAIL_APP_PASSWORD=production-app-password
```

### Email Rate Limits
- **Gmail Daily Limit:** 500 emails per day for free accounts
- **Gmail Hourly Limit:** 100 emails per hour
- **Batch Processing:** Implement delays between bulk emails

### Monitoring
- **Success Rate:** Track email delivery success rates
- **Error Logging:** Log all email failures with details
- **Alert System:** Set up alerts for high failure rates

---
**Related Documents:**
- [Email Service Configuration](email-service-config.md)
- [Email Testing Guide](../testing/email-testing.md)
- [Security Best Practices](../security/email-security.md)
