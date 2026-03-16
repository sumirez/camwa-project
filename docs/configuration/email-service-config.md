# Email Service Configuration Guide
**Version:** 1.3.0  
**Last Updated:** 2025-Q1

## 🎯 Overview
Comprehensive email service configuration for CAMWA system supporting Gmail SMTP, TestMail API, and other email providers with automated notifications and confirmations.

## 🚀 Supported Email Providers

### 1. **Gmail SMTP (Primary)**
- Production-ready SMTP integration
- App-specific password authentication
- High deliverability rates

### 2. **TestMail API (Development)**
- Testing environment support
- API-based email handling
- Development workflow integration

### 3. **Custom SMTP (Alternative)**
- Support for Outlook, Yahoo, and custom providers
- Flexible configuration options

## 📋 Configuration Options

### Gmail SMTP Configuration
```bash
# Gmail SMTP Settings
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_TIMEOUT_MS=10000
```

### TestMail API Configuration
```bash
# TestMail API Settings
API_KEY=your-testmail-api-key
NAMESPACE=your-namespace
BASE_URL=https://api.testmail.app/api/json
DEFAULT_FROM_NAME=CAMWA System
DEFAULT_FROM_EMAIL=noreply@camwa.edu
```

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GMAIL_USER` | Gmail address for sending emails | - | Yes |
| `GMAIL_APP_PASSWORD` | Gmail app-specific password | - | Yes |
| `ENABLE_EMAIL_NOTIFICATIONS` | Master switch for email notifications | `true` | No |
| `EMAIL_RETRY_ATTEMPTS` | Number of retry attempts for failed emails | `3` | No |
| `EMAIL_TIMEOUT_MS` | Timeout for email operations (ms) | `10000` | No |
| `API_KEY` | TestMail API key | - | For TestMail |
| `NAMESPACE` | TestMail namespace | - | For TestMail |
| `DEFAULT_FROM_NAME` | Default sender name | `CAMWA System` | No |
| `DEFAULT_FROM_EMAIL` | Default sender email | `noreply@camwa.edu` | No |

## 🔧 Gmail Setup Instructions

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-factor authentication if not already enabled
3. Verify your account setup

### Step 2: Generate App-Specific Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Enter "CAMWA System"
4. Click **Generate**
5. Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### Step 3: Configure Environment
```bash
# Remove spaces from app password
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### Step 4: Test Configuration
```bash
cd backend
node test-email.js
```

## 🔒 Security Best Practices

### Gmail Security
- Use app-specific passwords (never use main Gmail password)
- Enable 2-factor authentication
- Regularly rotate app passwords
- Monitor Gmail security activity

### Environment Security
- Store credentials in `.env` files
- Never commit credentials to version control
- Use different credentials for different environments
- Implement credential rotation policies

## 📊 Email Service Features

### Automated Notifications
- Attendance correction notifications
- Exam eligibility updates
- Account status changes
- System alerts and warnings

### Email Types Supported
- **Plain Text:** Basic notifications
- **HTML:** Rich formatted emails
- **Transactional:** System-generated emails
- **Bulk:** Mass notifications (with rate limiting)

### Delivery Features
- **Retry Logic:** Automatic retry on failures
- **Error Handling:** Comprehensive error reporting
- **Timeout Management:** Configurable timeout settings
- **Rate Limiting:** Prevents spam and overload

## 🎯 Alternative Email Providers

### Outlook/Hotmail Configuration
```javascript
// Outlook SMTP Settings
host: "smtp-mail.outlook.com",
port: 587,
secure: false,
auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS,
}
```

### Yahoo Mail Configuration
```javascript
// Yahoo SMTP Settings
host: "smtp.mail.yahoo.com",
port: 587,
secure: false,
auth: {
    user: process.env.YAHOO_USER,
    pass: process.env.YAHOO_PASS,
}
```

### Custom SMTP Configuration
```javascript
// Custom SMTP Settings
host: process.env.SMTP_HOST,
port: parseInt(process.env.SMTP_PORT),
secure: process.env.SMTP_SECURE === 'true',
auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
}
```

## 🔧 Environment-Specific Configurations

### Development Environment
```bash
# Development settings
GMAIL_USER=dev-email@gmail.com
GMAIL_APP_PASSWORD=dev-app-password
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=1
EMAIL_TIMEOUT_MS=5000
```

### Production Environment
```bash
# Production settings
GMAIL_USER=production-email@gmail.com
GMAIL_APP_PASSWORD=production-app-password
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_TIMEOUT_MS=15000
```

### Testing Environment
```bash
# Testing settings (disable actual sending)
ENABLE_EMAIL_NOTIFICATIONS=false
# OR use TestMail API for testing
API_KEY=test-api-key
NAMESPACE=test-namespace
```

## 🚨 Troubleshooting

### Common Issues

#### "Username and Password not accepted"
- **Solution:** Use app-specific password, not regular Gmail password
- **Check:** 2-factor authentication is enabled
- **Verify:** App password is correctly formatted (no spaces)

#### "Connection timeout"
- **Solution:** Increase `EMAIL_TIMEOUT_MS` value
- **Check:** Network connectivity and firewall settings
- **Verify:** SMTP server accessibility

#### "Too many requests"
- **Solution:** Implement rate limiting
- **Check:** `EMAIL_RETRY_ATTEMPTS` setting
- **Verify:** Not exceeding Gmail sending limits

### Debug Steps
1. Check environment variables are loaded
2. Test network connectivity to SMTP server
3. Verify authentication credentials
4. Check email service logs
5. Test with minimal email configuration

## 📈 Monitoring and Maintenance

### Email Service Health
- Monitor delivery success rates
- Track retry attempts and failures
- Log email service performance
- Set up alerts for service issues

### Regular Maintenance
- Rotate app passwords quarterly
- Update email templates as needed
- Monitor Gmail account security
- Review and update configuration settings

---
**Related Documents:**
- [Gmail Setup Guide](gmail-setup.md)
- [Email Service API](../api/email-service-endpoints.md)
- [Testing Guide](../testing/email-testing.md)
