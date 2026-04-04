import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { securityConfig, addSecurityHeaders } from "@/lib/security";

function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  console.log('🔐 Admin verification attempt:', {
    hasAuth: !!auth,
    authType: auth?.split(' ')[0],
    authLength: auth?.length
  });
  
  if (!auth?.startsWith("Bearer ")) {
    console.log('❌ No Bearer token found');
    return false;
  }
  
  try {
    const token = auth.slice(7);
    console.log('🔑 Token verification:', {
      tokenLength: token.length,
      tokenStart: token.substring(0, 20) + '...'
    });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "aquatai_fallback_secret");
    console.log('✅ Token decoded:', {
      hasRole: !!decoded.role,
      role: decoded.role,
      isAdmin: decoded.role === "admin"
    });
    
    return decoded.role === "admin";
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return false;
  }
}

export async function GET(req) {
  console.log('=== Upload API GET Test ===');
  
  // Test basic API functionality
  try {
    return addSecurityHeaders(
      NextResponse.json({ 
        message: "Upload API is working",
        timestamp: new Date().toISOString(),
        environment: {
          hasCloudinary: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
          cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
          maxFileSize: securityConfig.MAX_FILE_SIZE,
          allowedTypes: securityConfig.ALLOWED_FILE_TYPES
        }
      })
    );
  } catch (error) {
    console.error('GET test error:', error);
    return NextResponse.json({ error: 'API test failed' }, { status: 500 });
  }
}

export async function POST(req) {
  console.log('=== Upload API Called ===');
  
  if (!verifyAdmin(req)) {
    console.log('❌ Admin verification failed');
    return addSecurityHeaders(
      NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    );
  }
  
  console.log('✅ Admin verification passed');

  try {
    const formData = await req.formData();
    const file = formData.get("image");
    
    console.log('📁 FormData received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    });
    
    if (!file) {
      console.log('❌ No file provided');
      return addSecurityHeaders(
        NextResponse.json({ error: "No image provided." }, { status: 400 })
      );
    }

    // Enhanced file validation with debugging
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    console.log('Allowed file types:', securityConfig.ALLOWED_FILE_TYPES);
    
    // Check MIME type first
    let isValidType = securityConfig.ALLOWED_FILE_TYPES.includes(file.type);
    
    // If MIME type fails, check file extension as fallback
    if (!isValidType) {
      const extension = file.name.toLowerCase().split('.').pop();
      const extensionToMimeMap = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif'
      };
      
      const expectedMime = extensionToMimeMap[extension];
      if (expectedMime && securityConfig.ALLOWED_FILE_TYPES.includes(expectedMime)) {
        isValidType = true;
        console.log(`Using extension fallback: ${extension} -> ${expectedMime}`);
      }
    }
    
    if (!isValidType) {
      console.log('File type validation failed:', {
        actualType: file.type,
        allowedTypes: securityConfig.ALLOWED_FILE_TYPES,
        isIncluded: securityConfig.ALLOWED_FILE_TYPES.includes(file.type)
      });
      
      return addSecurityHeaders(
        NextResponse.json({ 
          error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP, and GIF images are allowed.`,
          actualType: file.type,
          allowedTypes: securityConfig.ALLOWED_FILE_TYPES
        }, { status: 400 })
      );
    }

    if (file.size > securityConfig.MAX_FILE_SIZE) {
      return addSecurityHeaders(
        NextResponse.json({ 
          error: `File size must be less than ${securityConfig.MAX_FILE_SIZE / 1024 / 1024}MB.` 
        }, { status: 400 })
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create secure filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '');

    // Upload to Cloudinary with enhanced security
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'aqua-tai/products',
          public_id: `product_${timestamp}_${random}`,
          quality: 'auto:good',
          secure: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Return secure response
    const response = {
      url: result.secure_url,
      filename: result.original_filename,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    };
    
    return addSecurityHeaders(
      NextResponse.json(response)
    );

  } catch (err) {
    console.error("Upload error occurred:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      cloudinaryConfig: {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      }
    });
    
    // Return more specific error message
    let errorMessage = "Upload failed";
    if (err.message?.includes('cloud_name')) {
      errorMessage = "Cloudinary configuration error - check cloud name";
    } else if (err.message?.includes('api_key')) {
      errorMessage = "Cloudinary configuration error - check API key";
    } else if (err.message?.includes('api_secret')) {
      errorMessage = "Cloudinary configuration error - check API secret";
    } else if (err.message?.includes('file size')) {
      errorMessage = "File too large - maximum size is 10MB";
    } else if (err.message?.includes('format')) {
      errorMessage = "Invalid file format - use JPEG, PNG, WebP, or GIF";
    }
    
    return addSecurityHeaders(
      NextResponse.json({ error: errorMessage, details: err.message }, { status: 500 })
    );
  }
}