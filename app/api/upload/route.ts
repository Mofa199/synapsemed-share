import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Optionally verify session to prevent unauthorized uploads
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    // CKEditor uses 'upload' field, other parts of the app might use 'file'
    const file = (formData.get("upload") || formData.get("file")) as File | null;

    if (!file) {
      return NextResponse.json(
        { uploaded: 0, error: { message: "No file uploaded" } },
        { status: 400 }
      );
    }

    // Read file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, ""); // Sanitize filename
    const filename = `${uniqueSuffix}-${originalName}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }

    // Write file to public/uploads
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;

    // CKEditor 4 expects specific JSON format: { uploaded: 1, fileName: '...', url: '...' }
    return NextResponse.json({
      uploaded: 1,
      fileName: filename,
      url: fileUrl,
      // Keep these for non-CKEditor consumers
      success: true,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
