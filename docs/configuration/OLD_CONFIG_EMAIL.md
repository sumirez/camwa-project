# Email Service Environment Configuration Guide

## Quick Setup

Add these variables to your `.env` file in the backend directory:

```bash
# Email Service Configuration (Gmail SMTP)
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_PASS=your-app-specific-password
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_TIMEOUT_MS=10000
```

## Configuration Options

### GMAIL_USER
- **Description**: Gmail address to send emails from
- **Default**: `dangtrunghieu0904hcm@gmail.com`
- **Required**: Yes (for email functionality)
- **Note**: Use your own Gmail address for production

### GMAIL_PASS
- **Description**: Gmail app-specific password (not your regular password)
- **Default**: `eguxjffsohgkxdhs`
- **Required**: Yes (for email functionality)
- **Note**: Generate an app-specific password in your Gmail security settings

### ENABLE_EMAIL_NOTIFICATIONS
- **Description**: Master switch for email notifications
- **Values**: `true` or `false`
- **Default**: `true`
- **Required**: No

### EMAIL_RETRY_ATTEMPTS
- **Description**: Number of retry attempts for failed emails
- **Values**: Any positive integer
- **Default**: `3`
- **Required**: No

### EMAIL_TIMEOUT_MS
- **Description**: Timeout for email sending operations in milliseconds
- **Values**: Any positive integer
- **Default**: `10000` (10 seconds)
- **Required**: No

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-factor authentication if not already enabled

### 2. Generate App-Specific Password
- Go to Google Account > Security > 2-Step Verification
- Scroll down to "App passwords"
- Generate a new app password for "Mail"
- Use this password (not your regular Gmail password) in GMAIL_PASS

### 3. Allow Less Secure Apps (if needed)
- Some Gmail accounts may need to allow less secure apps
- Go to Google Account > Security > Less secure app access
- Turn on access (not recommended for production)

## Testing Configuration

To test the email service without affecting production:

```bash
# Test configuration
GMAIL_USER=your-test-email@gmail.com
GMAIL_PASS=your-test-app-password
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=1
EMAIL_TIMEOUT_MS=5000
```

## Disabling Email Notifications

To disable email notifications while keeping the system functional:

```bash
ENABLE_EMAIL_NOTIFICATIONS=false
```

## Production Recommendations

```bash
# Production settings
GMAIL_USER=your-production-email@gmail.com
GMAIL_PASS=your-production-app-password
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_TIMEOUT_MS=15000
```

## Alternative Email Providers

You can easily switch to other email providers by modifying the transporter configuration in `email.service.js`:

### Outlook/Hotmail
```javascript
transporter: nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS,
    },
}),
```

### Yahoo Mail
```javascript
transporter: nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
    },
}),
```

### Custom SMTP
```javascript
transporter: nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
}),
```
