# Gmail App Password Setup Guide for CAMWA Email Service

## Problem
You're getting "Username and Password not accepted" because Gmail requires an **App-Specific Password** for SMTP access, not your regular Gmail password.

## Solution: Generate Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow the setup process if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Enter "CAMWA System"
4. Click **Generate**
5. Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### Step 3: Update Your .env File
Replace `your-16-character-app-password-here` in your `.env` file with the generated app password:

```bash
GMAIL_USER=lcnltv16ti@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

**Important:** 
- Use the app password WITHOUT spaces: `abcdefghijklmnop`
- Do NOT use your regular Gmail password `u`

### Step 4: Test the Email Service
```bash
cd backend
node test-email.js
```

## Troubleshooting

### If you still get authentication errors:
1. **Less Secure Apps**: Go to https://myaccount.google.com/lesssecureapps and turn it ON
2. **Account Access**: Go to https://accounts.google.com/DisplayUnlockCaptcha and click "Continue"
3. **Double-check app password**: Make sure you copied it correctly without spaces

### Alternative: Use OAuth2 (More Secure)
If app passwords don't work, we can set up OAuth2 authentication instead.

## Security Notes
- App passwords are safer than using your main password
- You can revoke app passwords anytime from your Google Account
- Each app should have its own unique app password

## Complete .env Configuration
```bash
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=camwa_db
JWT_SECRET=mysecretkey
GOOGLE_APPLICATION_CREDENTIALS=./backend/src/config/serviceAccountKey.json

# Gmail Configuration for Email Service
GMAIL_USER=lcnltv16ti@gmail.com
GMAIL_APP_PASSWORD=your-actual-16-char-app-password

# Email Service Settings
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_RETRY_ATTEMPTS=3
EMAIL_TIMEOUT_MS=10000
```

Once you've set up the app password correctly, the email notifications should work!
