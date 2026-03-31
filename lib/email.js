// Email service with fallback for development
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const RESET_LINKS_FILE = join(process.cwd(), 'public', 'reset-links.json');

// Load existing reset links
function loadResetLinks() {
  try {
    if (existsSync(RESET_LINKS_FILE)) {
      const data = readFileSync(RESET_LINKS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('Failed to load reset links:', error);
  }
  return [];
}

// Save reset links
function saveResetLinks(links) {
  try {
    writeFileSync(RESET_LINKS_FILE, JSON.stringify(links, null, 2));
    console.log('Reset links saved to web panel');
  } catch (error) {
    console.log('Failed to save reset links:', error);
  }
}

// Generate secure reset token
const generateResetToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Fallback email service for development (console log + web panel)
const sendPasswordResetEmailFallback = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}?email=${email}`;
    const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    
    // Load existing links
    const links = loadResetLinks();
    
    // Add new link
    links.unshift({
      email,
      url: resetUrl,
      token: resetToken,
      expiry,
      created: new Date().toISOString()
    });
    
    // Keep only last 10 links
    const limitedLinks = links.slice(0, 10);
    saveResetLinks(limitedLinks);
    
    console.log('='.repeat(80));
    console.log('🔐 PASSWORD RESET EMAIL (Development Mode)');
    console.log('='.repeat(80));
    console.log(`To: ${email}`);
    console.log(`Subject: Password Reset - AQUA R.O Filter`);
    console.log('');
    console.log('💻 Web Panel: http://localhost:3000/reset-panel.html');
    console.log('🔗 Reset Link:', resetUrl);
    console.log('');
    console.log('This link will expire in 30 minutes for security reasons.');
    console.log('If you didn\'t request this, please ignore this email.');
    console.log('='.repeat(80));
    
    return true;
  } catch (error) {
    console.error('Fallback email error:', error);
    return false;
  }
};

// Real email service (Gmail SMTP)
const sendPasswordResetEmailReal = async (email, resetToken) => {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}?email=${email}`;
    
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
    console.error('Real email sending error:', error);
    return false;
  }
};

// Main email function with fallback
export const sendPasswordResetEmail = async (email, resetToken) => {
  // Check if email is configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
      process.env.EMAIL_USER !== 'your_gmail_address@gmail.com' && 
      process.env.EMAIL_PASS !== 'your_gmail_app_password') {
    // Use real email service
    return await sendPasswordResetEmailReal(email, resetToken);
  } else {
    // Use fallback (console log + web panel)
    return await sendPasswordResetEmailFallback(email, resetToken);
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
  // Try to load from JSON file first (fallback mode)
  try {
    const fs = require('fs');
    const path = require('path');
    const resetLinksPath = path.join(process.cwd(), 'public', 'reset-links.json');
    
    if (fs.existsSync(resetLinksPath)) {
      const links = JSON.parse(fs.readFileSync(resetLinksPath, 'utf8'));
      const storedToken = links.find(link => link.email === email && link.token === token);
      
      if (!storedToken) {
        return false;
      }
      
      if (new Date() > new Date(storedToken.expiry)) {
        return false;
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error verifying reset token from file:', error);
  }
  
  // Fallback to global memory (real email mode)
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
export const clearResetToken = (email, token) => {
  // Try to remove from JSON file first (fallback mode)
  try {
    const fs = require('fs');
    const path = require('path');
    const resetLinksPath = path.join(process.cwd(), 'public', 'reset-links.json');
    
    if (fs.existsSync(resetLinksPath)) {
      const links = JSON.parse(fs.readFileSync(resetLinksPath, 'utf8'));
      const filteredLinks = links.filter(link => !(link.email === email && link.token === token));
      fs.writeFileSync(resetLinksPath, JSON.stringify(filteredLinks, null, 2));
    }
  } catch (error) {
    console.error('Error clearing reset token from file:', error);
  }
  
  // Fallback to global memory (real email mode)
  const resetTokens = global.resetTokens || {};
  delete resetTokens[email];
  global.resetTokens = resetTokens;
};
