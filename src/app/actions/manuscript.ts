"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  const coAuthorsJson = formData.get("coAuthors") as string;
  let coAuthors = [];
  if (coAuthorsJson) {
    try {
      coAuthors = JSON.parse(coAuthorsJson);
    } catch (e) {
      console.error("Failed to parse co-authors", e);
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
        activityLogs: {
          create: {
            userId: session.user.id,
            action: "MANUSCRIPT_SUBMITTED",
            entity: "MANUSCRIPT",
            metadata: "Initial submission"
          }
        }
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/manuscripts");
    
    return { success: true, manuscriptId: manuscript.id };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, error: "Failed to submit manuscript" };
  }
}
