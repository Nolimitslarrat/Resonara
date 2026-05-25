import { NextRequest, NextResponse } from "next/server";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  if (!filename) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Prevent directory traversal attacks
  if (filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = join(process.cwd(), "public", "uploads", filename);

  if (!existsSync(filePath)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on extension
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    let contentType = "application/octet-stream";
    
    if (ext === 'pdf') contentType = "application/pdf";
    else if (ext === 'png') contentType = "image/png";
    else if (ext === 'jpg' || ext === 'jpeg') contentType = "image/jpeg";
    else if (ext === 'doc' || ext === 'docx') contentType = "application/msword";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
