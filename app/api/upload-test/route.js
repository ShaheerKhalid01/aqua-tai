import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { securityConfig, addSecurityHeaders } from "@/lib/security";

export async function POST(req) {
  console.log('=== Simple Upload Test (No Auth) ===');
  
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
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    // Basic file validation
    if (file.size > securityConfig.MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size must be less than ${securityConfig.MAX_FILE_SIZE / 1024 / 1024}MB.` 
      }, { status: 400 });
    }

    console.log('✅ File validation passed');

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('✅ Cloudinary configured');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('✅ File converted to buffer');

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'aqua-tai/test',
          public_id: `test_${Date.now()}`,
          quality: 'auto:good',
          secure: true,
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload success:', result.public_id);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    console.log('✅ Upload completed successfully');

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      filename: result.original_filename,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    });

  } catch (err) {
    console.error("❌ Simple upload test error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack
    });
    
    return NextResponse.json({ 
      error: "Upload test failed", 
      details: err.message 
    }, { status: 500 });
  }
}
