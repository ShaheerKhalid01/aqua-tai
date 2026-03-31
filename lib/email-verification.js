// Email verification service with fallback for development
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const VERIFICATION_LINKS_FILE = join(process.cwd(), 'public', 'verification-links.json');

// Load existing verification links
function loadVerificationLinks() {
  try {
    if (existsSync(VERIFICATION_LINKS_FILE)) {
      const data = readFileSync(VERIFICATION_LINKS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('Failed to load verification links:', error);
  }
  return [];
}

// Save verification links
function saveVerificationLinks(links) {
  try {
    writeFileSync(VERIFICATION_LINKS_FILE, JSON.stringify(links, null, 2));
    console.log('Verification links saved to web panel');
  } catch (error) {
    console.log('Failed to save verification links:', error);
  }
}

// Generate secure verification token
const generateVerificationToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Fallback email service for development (console log + web panel)
const sendVerificationEmailFallback = async (email, verificationToken, userName) => {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email/${verificationToken}?email=${email}`;
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    // Load existing links
    const links = loadVerificationLinks();
    
    // Add new link
    links.unshift({
      email,
      url: verificationUrl,
      token: verificationToken,
      expiry,
      created: new Date().toISOString(),
      type: 'email-verification',
      userName
    });
    
    // Keep only last 10 links
    const limitedLinks = links.slice(0, 10);
    saveVerificationLinks(limitedLinks);
    
    console.log('='.repeat(80));
    console.log('📧 EMAIL VERIFICATION (Development Mode)');
    console.log('='.repeat(80));
    console.log(`To: ${email}`);
    console.log(`User: ${userName}`);
    console.log(`Subject: Verify Your Email - AQUA R.O Filter`);
    console.log('');
    console.log('💻 Web Panel: http://localhost:3000/verification-panel.html');
    console.log('🔗 Verification Link:', verificationUrl);
    console.log('');
    console.log('This link will expire in 24 hours for security reasons.');
    console.log('If you didn\'t request this, please ignore this email.');
    console.log('='.repeat(80));
    
    return true;
  } catch (error) {
    console.error('Fallback verification email error:', error);
    return false;
  }
};

// Real email service (Gmail SMTP)
const sendVerificationEmailReal = async (email, verificationToken, userName) => {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email/${verificationToken}?email=${email}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - AQUA R.O Filter',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://your-domain.com/logo.jpeg" alt="AQUA R.O Filter" style="width: 80px; height: 80px; border-radius: 10px;">
            <h1 style="color: #0057a8; margin: 10px 0;">AQUA R.O Filter</h1>
            <p style="color: #666; margin: 5px 0;">Pure Water Solutions</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">Welcome to AQUA R.O Filter!</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              Hi ${userName},<br><br>
              Thank you for registering with AQUA R.O Filter! 
              Please verify your email address to activate your account and start using our services.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #0057a8; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              This link will expire in 24 hours for security reasons.<br>
              If you didn't create an account, please ignore this email.
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
    console.error('Real verification email sending error:', error);
    return false;
  }
};

// Main email function with fallback
export const sendVerificationEmail = async (email, verificationToken, userName) => {
  // Check if email is configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
      process.env.EMAIL_USER !== 'your_gmail_address@gmail.com' && 
      process.env.EMAIL_PASS !== 'your_gmail_app_password') {
    // Use real email service
    return await sendVerificationEmailReal(email, verificationToken, userName);
  } else {
    // Use fallback (console log + web panel)
    return await sendVerificationEmailFallback(email, verificationToken, userName);
  }
};

// Generate and store verification token
export const createEmailVerificationToken = (email) => {
  const token = generateVerificationToken();
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Store token (in real app, use database)
  const verificationTokens = global.verificationTokens || {};
  verificationTokens[email] = { token, expiry };
  global.verificationTokens = verificationTokens;
  
  return token;
};

// Verify email token
export const verifyEmailToken = (email, token) => {
  const verificationTokens = global.verificationTokens || {};
  const storedToken = verificationTokens[email];
  
  if (!storedToken || storedToken.token !== token) {
    return false;
  }
  
  if (new Date() > storedToken.expiry) {
    delete verificationTokens[email];
    return false;
  }
  
  return true;
};

// Clear verification token
export const clearEmailVerificationToken = (email) => {
  const verificationTokens = global.verificationTokens || {};
  delete verificationTokens[email];
  global.verificationTokens = verificationTokens;
};

// Check if email is verified
export const isEmailVerified = (email) => {
  const verifiedEmails = global.verifiedEmails || [];
  return verifiedEmails.includes(email);
};

// Mark email as verified
export const markEmailAsVerified = (email) => {
  const verifiedEmails = global.verifiedEmails || [];
  if (!verifiedEmails.includes(email)) {
    verifiedEmails.push(email);
    global.verifiedEmails = verifiedEmails;
  }
};
