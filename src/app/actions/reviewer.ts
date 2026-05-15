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

    // Notify Editors
    const assignment = await prisma.reviewerAssignment.findUnique({
      where: { id: assignmentId },
      include: { manuscript: true, reviewer: true }
    });

    if (assignment) {
      const { notifyAdmins } = await import("@/lib/notifications");
      await notifyAdmins({
        type: "REVIEW_ACCEPTED",
        title: "Review Invitation Accepted",
        message: `${assignment.reviewer.name} has accepted the invitation to review "${assignment.manuscript.title}".`,
        link: `/dashboard/manuscripts/${assignment.manuscriptId}`
      });
    }

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

    // Notify Editors
    const assignment = await prisma.reviewerAssignment.findUnique({
      where: { id: assignmentId },
      include: { manuscript: true, reviewer: true }
    });

    if (assignment) {
      const { notifyAdmins } = await import("@/lib/notifications");
      await notifyAdmins({
        type: "REVIEW_DECLINED",
        title: "Review Invitation Declined",
        message: `${assignment.reviewer.name} has declined the invitation to review "${assignment.manuscript.title}".`,
        link: `/dashboard/manuscripts/${assignment.manuscriptId}`
      });
    }

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

    // Notify Editors
    const fullAssignment = await prisma.reviewerAssignment.findUnique({
      where: { id: assignmentId },
      include: { manuscript: true, reviewer: true }
    });

    if (fullAssignment) {
      const { notifyAdmins } = await import("@/lib/notifications");
      await notifyAdmins({
        type: "REVIEW_COMPLETED",
        title: "Review Submitted",
        message: `${fullAssignment.reviewer.name} has submitted their review for "${fullAssignment.manuscript.title}".`,
        link: `/dashboard/manuscripts/${fullAssignment.manuscriptId}`
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit review", error);
    return { success: false, error: "Failed to submit review" };
  }
}
