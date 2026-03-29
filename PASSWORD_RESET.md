# Password Reset Setup Guide

## 🔐 Complete Password Reset System Implemented

### ✅ Features Added:

#### **1. Forgot Password Page**
- **URL**: `/forgot-password`
- **Function**: Email input form to request reset link
- **UI**: Professional design matching your app theme

#### **2. Password Reset Page**
- **URL**: `/reset-password/[token]`
- **Function**: New password form with token verification
- **Security**: Token validation and expiration

#### **3. Email Service Integration**
- **Service**: Nodemailer with Gmail SMTP
- **Template**: Professional HTML email template
- **Security**: Rate limiting and token expiration

#### **4. API Endpoints**
- **POST** `/api/auth/forgot-password` - Send reset email
- **POST** `/api/auth/reset-password` - Update password

### 📧 Email Setup Required:

#### **Gmail SMTP Configuration:**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate new app password for "Aqua Tai"
   - Copy the 16-character password

3. **Update Environment Variables**:
   ```bash
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

### 🔄 Password Reset Flow:

#### **Step 1: User Requests Reset**
1. User clicks "Forgot Password?" on login page
2. Enters email address
3. System generates secure token (32 characters)
4. Token stored with 30-minute expiration
5. Reset email sent to user

#### **Step 2: User Receives Email**
- Professional HTML email template
- Contains secure reset link with token
- Link: `http://localhost:3000/reset-password/[token]?email=user@email.com`
- 30-minute expiration for security

#### **Step 3: User Resets Password**
1. User clicks reset link
2. Token and email validated
3. User enters new password (min. 6 characters)
4. Password confirmation required
5. Password hashed with bcrypt (14 salt rounds)
6. User account updated
7. Token cleared from memory
8. Redirect to login page

### 🛡️ Security Features:

#### **Rate Limiting**
- **3 requests per 15 minutes** per IP
- Prevents email bombing attacks
- Applied to forgot-password endpoint

#### **Token Security**
- **32-character random tokens**
- **30-minute expiration**
- **One-time use only**
- **Cleared after successful reset**

#### **Input Validation**
- Email format validation
- Password length requirements
- Token verification
- Error handling without information leakage

#### **Email Security**
- Gmail SMTP with app password
- Professional HTML templates
- No sensitive data in email
- Secure reset links only

### 📱 User Experience:

#### **Login Page Enhancement**
- Added "Forgot Password?" link
- Only shows on login tab
- Clean integration with existing design

#### **Forgot Password Page**
- Email-only form
- Loading states and error handling
- Success message with auto-redirect
- Professional blue theme design

#### **Reset Password Page**
- Token validation on load
- New password and confirmation fields
- Real-time validation feedback
- Success message with auto-redirect

### 🚀 Testing Instructions:

#### **1. Setup Email Service**
```bash
# Update .env.local with your Gmail credentials
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

#### **2. Test Reset Flow**
1. Go to `/login`
2. Click "Forgot Password?"
3. Enter your email
4. Check email for reset link
5. Click reset link
6. Set new password
7. Try logging in with new password

#### **3. Test Security Features**
- Try invalid email (should not reveal if user exists)
- Test rate limiting (4th attempt should fail)
- Test expired tokens (wait 30 minutes)
- Test invalid tokens

### 📁 Files Created:

1. **`lib/email.js`** - Email service and token management
2. **`app/api/auth/forgot-password/route.js`** - Reset request API
3. **`app/api/auth/reset-password/route.js`** - Password update API
4. **`app/(store)/forgot-password/page.js`** - Forgot password UI
5. **`app/(store)/reset-password/[token]/page.js`** - Reset password UI
6. **`lib/mongodb.js`** - Added updateUser function

### 🔧 Configuration Needed:

#### **Environment Variables** (add to `.env.local`):
```bash
# Email Service
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password

# App URL (for reset links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **Gmail Setup** (one-time):
1. Enable 2FA on Gmail
2. Generate app password
3. Update environment variables
4. Restart development server

### 🎯 Current Status:

**✅ Fully Implemented** - Complete password reset system ready to use
**⚠️ Email Setup Required** - Configure Gmail SMTP credentials
**🔒 Security Enhanced** - Rate limiting, token expiration, validation
**📱 Professional UI** - Matches your app's blue theme design

**Your users can now reset their passwords securely!** 🚀🔐

**Next Steps:**
1. Set up Gmail app password
2. Update environment variables
3. Test the complete reset flow
4. Deploy to production with HTTPS
