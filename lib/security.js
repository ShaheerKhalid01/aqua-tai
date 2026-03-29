// Generate cryptographically secure secrets
const generateSecureSecret = (length = 64) => {
  // Use Web Crypto API for Edge Runtime compatibility
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for Node.js
  try {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  } catch {
    // Final fallback - less secure but works everywhere
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// Security configuration
export const securityConfig = {
  // JWT secrets (change these immediately)
  JWT_SECRET: generateSecureSecret(64),
  JWT_EXPIRY: '7d',
  ADMIN_JWT_EXPIRY: '8h',
  
  // Rate limiting
  LOGIN_ATTEMPTS_LIMIT: 5,
  LOGIN_LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  
  // File upload security
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  
  // Security headers
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  }
};

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map();

// Rate limiting middleware
export const rateLimit = (identifier, limit, windowMs) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }
  
  const requests = rateLimitStore.get(identifier).filter(time => time > windowStart);
  rateLimitStore.set(identifier, [...requests, now]);
  
  return requests.length < limit;
};

// Login attempt tracking
export const trackLoginAttempt = (email, success) => {
  const key = `login_${email}`;
  const now = Date.now();
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { attempts: 0, lockoutUntil: 0 });
  }
  
  const data = rateLimitStore.get(key);
  
  if (success) {
    // Reset on successful login
    rateLimitStore.set(key, { attempts: 0, lockoutUntil: 0 });
  } else {
    data.attempts++;
    
    if (data.attempts >= securityConfig.LOGIN_ATTEMPTS_LIMIT) {
      data.lockoutUntil = now + securityConfig.LOGIN_LOCKOUT_TIME;
    }
    
    rateLimitStore.set(key, data);
  }
  
  return rateLimitStore.get(key);
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < securityConfig.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${securityConfig.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  if (securityConfig.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (securityConfig.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (securityConfig.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (securityConfig.PASSWORD_REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// CSRF token generation
export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Security headers
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': Object.entries(securityConfig.CSP_DIRECTIVES)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ')
  };
};

// Add security headers to response
export const addSecurityHeaders = (response) => {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};
