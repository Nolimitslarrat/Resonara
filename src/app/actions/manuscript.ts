"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getNumericId } from "@/lib/utils";

export async function submitManuscript(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const abstract = formData.get("abstract") as string;
  const keywordsString = formData.get("keywords") as string;
  const journalId = formData.get("journalId") as string;
  const categoryId = formData.get("categoryId") as string | null;
  const coverLetter = formData.get("coverLetter") as string | null;

  // Process keywords
  const keywords = keywordsString
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  // Process Co-authors (from hidden inputs added by JS)
  const caJson = formData.get("coAuthors") as string;
  let coAuthors = [];
  if (caJson) {
    try {
      coAuthors = JSON.parse(caJson);
    } catch (e) {
      console.error("Failed to parse co-authors", e);
    }
  }

  // Handle File Upload
  const file = formData.get("file") as File | null;
  let uploadedFileInfo = null;
  
  if (file && file.size > 0) {
    try {
      const { saveFileLocally } = await import("@/lib/storage");
      uploadedFileInfo = await saveFileLocally(file);
    } catch (e) {
      console.error("File upload error", e);
      return { success: false, error: "Failed to upload manuscript file" };
    }
  }

  try {
    const manuscript = await prisma.manuscript.create({
      data: {
        title,
        abstract,
        keywords,
        journalId,
        ...(categoryId && { categoryId }),
        coverLetter,
        authorId: session.user.id,
        status: "SUBMITTED",
        submittedAt: new Date(),
        coAuthors: {
          create: coAuthors.map((ca: any, index: number) => ({
            name: ca.name,
            email: ca.email,
            affiliation: ca.affiliation,
            order: index + 1,
            isCorresponding: ca.isCorresponding || false,
          })),
        },
        ...(uploadedFileInfo && {
          files: {
            create: {
              url: uploadedFileInfo.url,
              name: uploadedFileInfo.name,
              size: uploadedFileInfo.size,
              mimeType: uploadedFileInfo.mimeType,
              uploadedById: session.user.id,
            }
          },
          versions: {
            create: {
              version: 1,
              fileUrl: uploadedFileInfo.url,
              fileName: uploadedFileInfo.name,
              fileSize: uploadedFileInfo.size,
            }
          }
        }),
        activityLogs: {
          create: {
            userId: session.user.id,
            action: "MANUSCRIPT_SUBMITTED",
            entity: "MANUSCRIPT",
            metadata: { note: "Initial submission" }
          }
        }
      }
    });
    
    // Notify the author
    const { createNotification, notifyAdmins } = await import("@/lib/notifications");
    await createNotification({
      userId: session.user.id,
      type: "SUBMISSION_RECEIVED",
      title: "Manuscript Submitted",
      message: `Your manuscript "${title}" has been successfully submitted and is now under screening.`,
      link: `/dashboard/manuscripts/${getNumericId(manuscript.id)}`
    });

    // Notify Admins/Editors
    await notifyAdmins({
      type: "SUBMISSION_RECEIVED",
      title: "New Submission",
      message: `A new manuscript "${title}" has been submitted to your journal.`,
      link: `/dashboard/manuscripts/${getNumericId(manuscript.id)}`
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/manuscripts");
    
    return { success: true, manuscriptId: manuscript.id };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, error: "Failed to submit manuscript" };
  }
}
