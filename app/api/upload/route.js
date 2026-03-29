import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { securityConfig, addSecurityHeaders } from "@/lib/security";

function verifyAdmin(req) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET || "aquatai_fallback_secret");
    return decoded.role === "admin";
  } catch { return false; }
}

export async function POST(req) {
  if (!verifyAdmin(req)) {
    return addSecurityHeaders(
      NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");
    
    if (!file) {
      return addSecurityHeaders(
        NextResponse.json({ error: "No image provided." }, { status: 400 })
      );
    }

    // Enhanced file validation
    if (!securityConfig.ALLOWED_FILE_TYPES.includes(file.type)) {
      return addSecurityHeaders(
        NextResponse.json({ 
          error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." 
        }, { status: 400 })
      );
    }

    if (file.size > securityConfig.MAX_FILE_SIZE) {
      return addSecurityHeaders(
        NextResponse.json({ 
          error: "File size must be less than 5MB." 
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
          format: 'auto',
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
    console.error("Upload error occurred");
    return addSecurityHeaders(
      NextResponse.json({ error: "Upload failed" }, { status: 500 })
    );
  }
}