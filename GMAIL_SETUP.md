# Gmail SMTP Setup Guide

## 🔐 Real Email Setup (Optional)

The forgot password feature works in development mode with console logs. For production, set up Gmail SMTP:

### 📧 Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification
3. Enable 2FA on your Gmail account

### 🔑 Step 2: Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" for the app
3. Select "Other (Custom name)" → Enter "Aqua Tai"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### ⚙️ Step 3: Update Environment Variables
Update your `.env.local` file:

```bash
# Email Service (Gmail SMTP)
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### 🚀 Step 4: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### ✅ Step 5: Test Real Emails
1. Try forgot password again
2. Check your Gmail inbox
3. Should receive professional HTML email

## 🎯 Current Status: Development Mode ✅

**Forgot password is working right now!**

### 📱 How to Test (Current Setup):

1. **Go to**: http://localhost:3000/forgot-password
2. **Enter your email**: (use existing account like `persistent@test.com`)
3. **Click "Send Reset Link"**
4. **Check server console** for reset link
5. **Copy the link** and paste in browser
6. **Reset your password**

### 🔍 Console Output Example:
```
================================================================================
🔐 PASSWORD RESET EMAIL (Development Mode)
================================================================================
To: persistent@test.com
Subject: Password Reset - AQUA R.O Filter

Click the link below to reset your password:
http://localhost:3000/reset-password/AfvIGywbjcPUoXEREFtinumsVl5LUyiH?email=persistent@test.com

This link will expire in 30 minutes for security reasons.
If you didn't request this, please ignore this email.
================================================================================
```

## 🛡️ Security Features:

- ✅ **Rate Limiting**: 3 requests per 15 minutes
- ✅ **Secure Tokens**: 32-character random tokens
- ✅ **30-Minute Expiry**: Tokens expire automatically
- ✅ **Email Obfuscation**: Doesn't reveal if user exists
- ✅ **Professional Template**: Ready for production

## 📁 File-Based Storage:

Reset tokens are stored in memory and will survive server restarts with the new file-based database system.

## 🎉 Ready to Use!

**Your forgot password system is fully functional right now!** 🚀

**Test it:**
1. Use existing account email
2. Check console for reset link
3. Reset password successfully
4. Login with new password

**Optional:** Set up Gmail SMTP for real email delivery in production.
