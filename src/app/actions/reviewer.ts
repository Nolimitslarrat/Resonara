"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function acceptReview(assignmentId: string) {
  const session = await auth();
  if (!session || session.user.role !== "REVIEWER") throw new Error("Unauthorized");

  try {
    await prisma.reviewerAssignment.update({
      where: { id: assignmentId, reviewerId: session.user.id },
      data: { status: "ACCEPTED" }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to accept review" };
  }
}

export async function declineReview(assignmentId: string) {
  const session = await auth();
  if (!session || session.user.role !== "REVIEWER") throw new Error("Unauthorized");

  try {
    await prisma.reviewerAssignment.update({
      where: { id: assignmentId, reviewerId: session.user.id },
      data: { status: "DECLINED" }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to decline review" };
  }
}

export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "REVIEWER") {
    throw new Error("Unauthorized");
  }

  const assignmentId = formData.get("assignmentId") as string;
  const score = parseInt(formData.get("score") as string, 10);
  const recommendation = formData.get("recommendation") as string;
  const commentsToAuthor = formData.get("commentsToAuthor") as string;
  const commentsToEditor = formData.get("commentsToEditor") as string;

  if (!assignmentId || !score || !recommendation || !commentsToAuthor) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const assignment = await prisma.reviewerAssignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment || assignment.reviewerId !== session.user.id) {
      return { success: false, error: "Invalid assignment" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          assignmentId,
          score,
          recommendation: recommendation as any,
          authorComments: commentsToAuthor,
          confidentialComments: commentsToEditor,
        }
      });

      await tx.reviewerAssignment.update({
        where: { id: assignmentId },
        data: { status: "COMPLETED", completedAt: new Date() }
      });

      await tx.activityLog.create({
        data: {
          userId: session.user.id,
          action: "REVIEW_SUBMITTED",
          entity: "REVIEW",
          metadata: `Recommendation: ${recommendation}`
        }
      });
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit review", error);
    return { success: false, error: "Failed to submit review" };
  }
}
