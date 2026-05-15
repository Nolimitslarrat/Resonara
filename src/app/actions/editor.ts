"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateManuscriptStatus(manuscriptId: string, status: any, comment: string) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: {
        status,
        activityLogs: {
          create: {
            userId: session.user.id,
            action: `STATUS_UPDATED_TO_${status}`,
            entity: "MANUSCRIPT",
            metadata: comment
          }
        }
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/manuscripts/${manuscriptId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update status", error);
    return { success: false, error: "Failed to update manuscript status." };
  }
}

export async function assignReviewer(manuscriptId: string, reviewerId: string) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN", "MANAGING_EDITOR"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks to review

    await prisma.reviewerAssignment.create({
      data: {
        manuscriptId,
        reviewerId,
        dueDate,
        status: "PENDING"
      }
    });

    // Update manuscript status to UNDER_REVIEW if it wasn't already
    await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: {
        status: "UNDER_REVIEW",
        activityLogs: {
          create: {
            userId: session.user.id,
            action: "REVIEWER_ASSIGNED",
            entity: "MANUSCRIPT",
            metadata: `Assigned to Reviewer ID: ${reviewerId}`
          }
        }
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to assign reviewer", error);
    return { success: false, error: "Failed to assign reviewer. They might already be assigned." };
  }
}
