import nodemailer from 'nodemailer';

// Email service configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter(emailConfig);
};

// Generate secure reset token
const generateResetToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - AQUA R.O Filter',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://your-domain.com/logo.jpeg" alt="AQUA R.O Filter" style="width: 80px; height: 80px; border-radius: 10px;">
            <h1 style="color: #0057a8; margin: 10px 0;">AQUA R.O Filter</h1>
            <p style="color: #666; margin: 5px 0;">Pure Water Solutions</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Hi there,<br><br>
              You requested to reset your password for your AQUA R.O Filter account. 
              Click the button below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #0057a8; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              This link will expire in 30 minutes for security reasons.<br>
              If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px;">
            <p>© 2024 AQUA R.O Filter. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Generate and store reset token
export const createPasswordResetToken = (email) => {
  const token = generateResetToken();
  const expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  
  // Store token (in real app, use database)
  const resetTokens = global.resetTokens || {};
  resetTokens[email] = { token, expiry };
  global.resetTokens = resetTokens;
  
  return token;
};

// Verify reset token
export const verifyResetToken = (email, token) => {
  const resetTokens = global.resetTokens || {};
  const storedToken = resetTokens[email];
  
  if (!storedToken || storedToken.token !== token) {
    return false;
  }
  
  if (new Date() > storedToken.expiry) {
    delete resetTokens[email];
    return false;
  }
  
  return true;
};

// Clear reset token
export const clearResetToken = (email) => {
  const resetTokens = global.resetTokens || {};
  delete resetTokens[email];
  global.resetTokens = resetTokens;
};
