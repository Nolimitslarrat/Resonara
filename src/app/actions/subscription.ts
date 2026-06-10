"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

function parseDate(value: FormDataEntryValue | null) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function createSubscriptionAccess(formData: FormData) {
  await requireSuperAdmin();

  const userId = String(formData.get("userId") || "");
  const accessType = String(formData.get("accessType") || "ARTICLE");
  const articleId = String(formData.get("articleId") || "");
  const journalId = String(formData.get("journalId") || "");
  const startsAt = parseDate(formData.get("startsAt"));
  const endsAt = parseDate(formData.get("endsAt"));
  const notes = String(formData.get("notes") || "").trim();

  if (!userId || !startsAt || !endsAt) {
    return { success: false, error: "User, start date, and end date are required." };
  }

  if (endsAt <= startsAt) {
    return { success: false, error: "End date must be after start date." };
  }

  const data =
    accessType === "JOURNAL"
      ? { journalId: journalId || null, articleId: null }
      : { articleId: articleId || null, journalId: null };

  if (accessType === "JOURNAL" && !data.journalId) {
    return { success: false, error: "Select a journal for journal access." };
  }

  if (accessType !== "JOURNAL" && !data.articleId) {
    return { success: false, error: "Select an article for article access." };
  }

  try {
    await prisma.subscriptionAccess.create({
      data: {
        userId,
        startsAt,
        endsAt,
        notes: notes || null,
        ...data,
      },
    });

    revalidatePath("/dashboard/subscriptions");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create subscription access:", error);
    return { success: false, error: "Failed to create subscription access." };
  }
}

export async function updateSubscriptionAccess(subscriptionId: string, formData: FormData) {
  await requireSuperAdmin();

  const startsAt = parseDate(formData.get("startsAt"));
  const endsAt = parseDate(formData.get("endsAt"));
  const notes = String(formData.get("notes") || "").trim();
  const isActive = formData.get("isActive") === "true";

  if (!startsAt || !endsAt) {
    return { success: false, error: "Start date and end date are required." };
  }

  if (endsAt <= startsAt) {
    return { success: false, error: "End date must be after start date." };
  }

  try {
    await prisma.subscriptionAccess.update({
      where: { id: subscriptionId },
      data: {
        startsAt,
        endsAt,
        notes: notes || null,
        isActive,
      },
    });

    revalidatePath("/dashboard/subscriptions");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update subscription access:", error);
    return { success: false, error: "Failed to update subscription access." };
  }
}

export async function revokeSubscriptionAccess(subscriptionId: string) {
  await requireSuperAdmin();

  try {
    await prisma.subscriptionAccess.update({
      where: { id: subscriptionId },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/subscriptions");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to revoke subscription access:", error);
    return { success: false, error: "Failed to revoke subscription access." };
  }
}
