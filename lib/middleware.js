import { NextResponse } from 'next/server';
import { getSecurityHeaders, rateLimit } from '@/lib/security';

// Middleware to add security headers to all API responses
export function addSecurityHeaders(response) {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Rate limiting middleware
export function withRateLimit(handler, options = {}) {
  const { limit = 100, windowMs = 15 * 60 * 1000 } = options;
  
  return async (req, ...args) => {
    const identifier = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    if (!rateLimit(identifier, limit, windowMs)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        )
      );
    }
    
    return handler(req, ...args);
  };
}

// Input validation middleware
export function withValidation(handler, schema) {
  return async (req, ...args) => {
    try {
      const body = await req.json();
      
      // Sanitize all string inputs
      const sanitizedBody = {};
      Object.keys(body).forEach(key => {
        sanitizedBody[key] = typeof body[key] === 'string' 
          ? sanitizeInput(body[key]) 
          : body[key];
      });
      
      // Validate against schema if provided
      if (schema) {
        const validation = validateSchema(sanitizedBody, schema);
        if (!validation.isValid) {
          return addSecurityHeaders(
            NextResponse.json(
              { error: 'Invalid input', details: validation.errors },
              { status: 400 }
            )
          );
        }
      }
      
      // Replace request body with sanitized version
      req.json = async () => sanitizedBody;
      
      return handler(req, ...args);
    } catch (error) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Invalid request format' },
          { status: 400 }
        )
      );
    }
  };
}

// Schema validation helper
function validateSchema(data, schema) {
  const errors = [];
  
  Object.keys(schema).forEach(key => {
    const rules = schema[key];
    const value = data[key];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`);
      return;
    }
    
    if (value !== undefined && rules.type && typeof value !== rules.type) {
      errors.push(`${key} must be of type ${rules.type}`);
    }
    
    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`${key} must be at least ${rules.minLength} characters`);
    }
    
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors.push(`${key} must be no more than ${rules.maxLength} characters`);
    }
    
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push(`${key} format is invalid`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Authentication middleware
export function withAuth(handler, options = {}) {
  const { requireAdmin = false, allowGuest = false } = options;
  
  return async (req, ...args) => {
    const auth = req.headers.get('authorization');
    
    if (!auth?.startsWith('Bearer ')) {
      if (allowGuest) {
        return handler(req, ...args);
      }
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      );
    }
    
    try {
      const token = auth.slice(7);
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (requireAdmin && decoded.role !== 'admin') {
        return addSecurityHeaders(
          NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          )
        );
      }
      
      // Add user to request
      req.user = decoded;
      return handler(req, ...args);
      
    } catch (error) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      );
    }
  };
}
