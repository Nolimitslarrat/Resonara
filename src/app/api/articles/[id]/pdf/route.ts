import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const article = await prisma.manuscript.findUnique({
    where: { id: params.id },
    include: {
      article: true,
      versions: { orderBy: { version: "desc" }, take: 1 }
    }
  });

  if (!article) return notFound();

  // Prefer PDF URL from Article record, fallback to latest manuscript version
  const fileUrl = article.article?.pdfUrl || article.versions[0]?.fileUrl;

  if (!fileUrl) return notFound();

  // If it's a local file path (starts with /uploads)
  if (fileUrl.startsWith("/uploads")) {
    const filePath = path.join(process.cwd(), "public", fileUrl);
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found on server", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${article.title.replace(/[^\w\s-]/g, "")}.pdf"`,
      },
    });
  }

  // If it's an external URL, redirect to it
  return NextResponse.redirect(fileUrl);
}
