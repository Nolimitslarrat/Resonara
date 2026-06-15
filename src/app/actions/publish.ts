"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getNumericId } from "@/lib/utils";

export async function publishArticle(manuscriptId: string) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: {
        author: true,
        journal: true,
        versions: { orderBy: { version: "desc" }, take: 1 }
      }
    });

    if (!manuscript) throw new Error("Manuscript not found");

    // Create Article record
    const article = await prisma.article.create({
      data: {
        manuscriptId: manuscript.id,
        pdfUrl: manuscript.versions[0]?.fileUrl || null,
        publishedAt: new Date(),
        license: "CC BY 4.0", // Default license
        metaTitle: manuscript.title,
        metaDesc: manuscript.abstract.substring(0, 160),
      }
    });

    // Update Manuscript status
    await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: {
        status: "PUBLISHED",
        activityLogs: {
          create: {
            userId: session.user.id,
            action: "ARTICLE_PUBLISHED",
            entity: "MANUSCRIPT",
            metadata: { doi: article.doi || 'Pending', note: 'Article published successfully' }
          }
        }
      }
    });

    // Notify Author
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: manuscript.authorId,
      type: "ARTICLE_PUBLISHED",
      title: "Article Published!",
      message: `Congratulations! Your article "${manuscript.title}" has been officially published in ${manuscript.journal.title}.`,
      link: `/articles/${getNumericId(manuscript.id)}`
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/manuscripts/${manuscriptId}`);
    revalidatePath(`/articles/${manuscriptId}`);
    revalidatePath("/articles");

    return { success: true, articleId: article.id };
  } catch (error) {
    console.error("Failed to publish article:", error);
    return { success: false, error: "Failed to publish article." };
  }
}

export async function unpublishArticle(manuscriptId: string) {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: { author: true, journal: true }
    });

    if (!manuscript) throw new Error("Manuscript not found");

    // Update Manuscript status
    await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: {
        status: "READY_TO_PUBLISH",
        activityLogs: {
          create: {
            userId: session.user.id,
            action: "ARTICLE_UNPUBLISHED",
            entity: "MANUSCRIPT",
            metadata: { note: 'Article unpublished successfully' }
          }
        }
      }
    });

    // Delete Article record
    await prisma.article.deleteMany({
      where: { manuscriptId }
    });

    // Notify Author
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: manuscript.authorId,
      type: "GENERAL",
      title: "Article Unpublished",
      message: `Your article "${manuscript.title}" has been unpublished from ${manuscript.journal.title}.`,
      link: `/dashboard/manuscripts/${getNumericId(manuscript.id)}`
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/manuscripts/${manuscriptId}`);
    revalidatePath(`/articles/${manuscriptId}`);
    revalidatePath("/articles");
    revalidatePath("/dashboard/articles");

    return { success: true };
  } catch (error) {
    console.error("Failed to unpublish article:", error);
    return { success: false, error: "Failed to unpublish article." };
  }
}
