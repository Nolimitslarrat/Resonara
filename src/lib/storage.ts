import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Saves a file to the local filesystem (public/uploads)
 * Note: For production, consider using S3/R2.
 * In Coolify, ensure /public/uploads is a persistent volume.
 */
export async function saveFileLocally(file: File): Promise<{ url: string; name: string; size: number; mimeType: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads");
  
  // Ensure directory exists
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
    // Already exists
  }

  const uniqueId = randomUUID();
  const extension = file.name.split(".").pop();
  const fileName = `${uniqueId}.${extension}`;
  const path = join(uploadDir, fileName);

  await writeFile(path, buffer);

  return {
    url: `/uploads/${fileName}`,
    name: file.name,
    size: file.size,
    mimeType: file.type
  };
}
